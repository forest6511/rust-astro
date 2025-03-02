// components/convert/ImageConverter.tsx
import { useState, useCallback, useEffect } from 'react'
import { convertImages } from '@/lib/api'
import FormatSelector from './FormatSelector'
import FileDropzone from './FileDropzone'
import ProgressBar from './ProgressBar'
import ConvertedFileList from './ConvertedFileList'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { ConvertedFile } from '@/types/convert.ts'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function ImageConverter() {
  const [files, setFiles] = useState<File[]>([])
  const [format, setFormat] = useState('webp')
  const [formatHistory, setFormatHistory] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFormatChange = useCallback((newFormat: string) => {
    setFormat(newFormat)
    setFormatHistory((prev) => {
      const updatedHistory = prev.filter((f) => f !== newFormat)
      return [newFormat, ...updatedHistory].slice(0, 5)
    })
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // ファイルサイズとフォーマットのチェックロジック
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > MAX_FILE_SIZE
      )
      if (oversizedFiles.length > 0) {
        setError(
          `ファイルサイズが10MBを超えています: ${oversizedFiles.map((f) => f.name).join(', ')}`
        )
        acceptedFiles = acceptedFiles.filter(
          (file) => file.size <= MAX_FILE_SIZE
        )
      }

      if (rejectedFiles.length > 0) {
        setError('サポートされていないファイル形式は選択できません')
      }

      if (loading) {
        setError('変換中は新しいファイルをアップロードできません')
        return
      }

      const sameFormatFiles = acceptedFiles.filter((file) => {
        const fileExt = file.name.split('.').pop()?.toLowerCase()
        if (format === 'jpeg' && (fileExt === 'jpg' || fileExt === 'jpeg'))
          return true
        return fileExt === format
      })

      if (sameFormatFiles.length > 0) {
        setError(
          `変換元と変換先が同じフォーマットです: ${sameFormatFiles.map((f) => f.name).join(', ')}`
        )
        acceptedFiles = acceptedFiles.filter((file) => {
          const fileExt = file.name.split('.').pop()?.toLowerCase()
          if (format === 'jpeg' && (fileExt === 'jpg' || fileExt === 'jpeg'))
            return false
          return fileExt !== format
        })
      }

      if (acceptedFiles.length > 0) {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
      }
    },
    [format, loading]
  )

  const convertFile = async (file: File) => {
    try {
      console.log(`変換開始: ${file.name} -> ${format}形式`)
      const result = await convertImages([file], format)
      console.log(`変換完了: ${file.name}`)
      return {
        ...result.files[0],
        convertedFormat: format,
      }
    } catch (error) {
      console.error('Conversion error:', error)
      throw error
    }
  }

  const clearFiles = useCallback(() => {
    setFiles([])
    setConvertedFiles([])
  }, [])

  useEffect(() => {
    const processFiles = async () => {
      if (files.length === 0 || loading) return

      setLoading(true)
      setError(null)
      setProgress(0)

      const convertedFilesArray: ConvertedFile[] = []

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const convertedFile = await convertFile(file)
          convertedFilesArray.push(convertedFile)

          const newProgress = Math.round(((i + 1) / files.length) * 100)
          setProgress(newProgress)
          setConvertedFiles([...convertedFilesArray])
        }
      } catch (error) {
        console.error('Conversion process error:', error)
        setError('変換中にエラーが発生しました。もう一度お試しください。')
      } finally {
        setLoading(false)
      }
    }

    processFiles()
  }, [files])

  useEffect(() => {
    setError(null)
  }, [format])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">画像フォーマット変換</CardTitle>
        <CardDescription>
          JPG、PNG、WebP、HEIC、AVIF形式の画像を別のフォーマットに変換できます
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormatSelector
          format={format}
          formatHistory={formatHistory}
          onFormatChange={handleFormatChange}
          disabled={loading}
        />

        <FileDropzone onDrop={onDrop} loading={loading} />

        {loading && <ProgressBar progress={progress} />}

        {convertedFiles.length > 0 && (
          <ConvertedFileList
            convertedFiles={convertedFiles}
            format={format}
            clearFiles={clearFiles}
          />
        )}
      </CardContent>
    </Card>
  )
}
