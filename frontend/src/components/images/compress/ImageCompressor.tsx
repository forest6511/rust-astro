// src/components/images/compress/ImageCompressor.tsx
import { useState, useCallback, useEffect } from 'react'
import { compressImages } from '@/lib/api'
import QualitySelector from './QualitySelector'
import FileDropzone from './FileDropzone'
import ProgressBar from './ProgressBar'
import CompressedFileList from './CompressedFileList'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { CompressedFile } from '@/types/compress'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([])
  const [quality, setQuality] = useState(60)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [compressedFiles, setCompressedFiles] = useState<CompressedFile[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleQualityChange = useCallback((newQuality: number) => {
    setQuality(newQuality)
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // 1ファイルのみ処理
      if (acceptedFiles.length > 1) {
        acceptedFiles = [acceptedFiles[0]]
      }

      // ファイルサイズのチェック
      if (acceptedFiles.length > 0 && acceptedFiles[0].size > MAX_FILE_SIZE) {
        setError(`ファイルサイズが10MBを超えています: ${acceptedFiles[0].name}`)
        return
      }

      if (rejectedFiles.length > 0) {
        setError('サポートされていないファイル形式は選択できません')
      }

      if (loading) {
        setError('圧縮中は新しいファイルをアップロードできません')
        return
      }

      if (acceptedFiles.length > 0) {
        setFiles([acceptedFiles[0]]) // 常に1ファイルのみセット
      }
    },
    [loading]
  )

  const clearFiles = useCallback(() => {
    setFiles([])
    setCompressedFiles([])
  }, [])

  useEffect(() => {
    const processFiles = async () => {
      if (files.length === 0 || loading) return

      setLoading(true)
      setError(null)
      setProgress(0)

      try {
        // ファイルを送信
        const result = await compressImages(files, quality)
        // 既存のリストに新しい結果を追加
        setCompressedFiles((prevFiles) => [...prevFiles, ...result.files])
        setProgress(100)
      } catch (error) {
        console.error('Compression process error:', error)
        setError('圧縮中にエラーが発生しました。もう一度お試しください。')
      } finally {
        setLoading(false)
        setFiles([]) // 処理後にファイルをクリア
      }
    }

    processFiles()
  }, [files, loading, quality])

  useEffect(() => {
    setError(null)
  }, [quality])

  return (
    <Card className="w-full">
      <CardContent className="space-y-6 pt-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <QualitySelector
          quality={quality}
          onQualityChange={handleQualityChange}
          disabled={loading}
        />

        <FileDropzone onDrop={onDrop} loading={loading} />

        {loading && <ProgressBar progress={progress} />}

        {compressedFiles.length > 0 && (
          <CompressedFileList
            compressedFiles={compressedFiles}
            clearFiles={clearFiles}
          />
        )}
      </CardContent>
    </Card>
  )
}
