import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Loader2, Upload, FileType, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type ConvertedFile = {
  originalName: string
  name: string
  url: string
  size: number
}

export default function ImageConverter() {
  const [files, setFiles] = useState<File[]>([])
  const [format, setFormat] = useState('webp')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic'],
      'image/avif': ['.avif'],
      'image/gif': ['.gif'],
    },
    multiple: true,
    onDrop,
  })

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const clearFiles = () => {
    setFiles([])
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileTypeColor = (type: string): string => {
    if (type.includes('jpeg') || type.includes('jpg'))
      return 'bg-red-100 text-red-800'
    if (type.includes('png')) return 'bg-blue-100 text-blue-800'
    if (type.includes('webp')) return 'bg-green-100 text-green-800'
    if (type.includes('heic')) return 'bg-purple-100 text-purple-800'
    if (type.includes('avif')) return 'bg-yellow-100 text-yellow-800'
    if (type.includes('gif')) return 'bg-pink-100 text-pink-800'
    return 'bg-gray-100 text-gray-800'
  }

  const handleConvert = async () => {
    // if (files.length === 0) {
    //   toast({
    //     title: "エラー",
    //     description: "変換するファイルを選択してください",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    setLoading(true)
    setProgress(0)
    setConvertedFiles([])

    try {
      // ここで実際の変換処理を行います。
      // この例では、変換処理をシミュレートするだけです。
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        await new Promise((resolve) => setTimeout(resolve, 1000)) // 1秒待機

        const newFileName = `${file.name.split('.')[0]}.${format}`
        setConvertedFiles((prev) => [
          ...prev,
          {
            originalName: file.name,
            name: newFileName,
            url: URL.createObjectURL(file), // 実際には変換されたファイルのURLを使用します
            size: file.size,
          },
        ])

        setProgress(Math.round(((i + 1) / files.length) * 100))
      }

      // toast({
      //   title: "変換完了",
      //   description: `${files.length}個のファイルを${format.toUpperCase()}形式に変換しました`,
      // });
    } catch (error) {
      console.error('変換エラー', error)
      // toast({
      //   title: "変換エラー",
      //   description: "ファイルの変換中にエラーが発生しました",
      //   variant: "destructive",
      // });
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">画像フォーマット変換</CardTitle>
        <CardDescription>
          JPG、PNG、WebP、HEIC、AVIF、GIF形式の画像を別のフォーマットに変換できます
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ファイルアップロード */}
        <div
          {...getRootProps()}
          className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-gray-400" />
            {isDragActive ? (
              <p className="text-primary font-medium">
                ファイルをドロップしてアップロード
              </p>
            ) : (
              <>
                <p className="font-medium">画像をドラッグ＆ドロップ</p>
                <p className="text-sm text-gray-500">
                  または クリックしてファイルを選択
                </p>
              </>
            )}
            <p className="text-xs text-gray-400 mt-2">
              対応フォーマット: JPG, PNG, WebP, HEIC, AVIF, GIF
            </p>
          </div>
        </div>

        {/* 選択したファイル表示 */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                アップロードしたファイル ({files.length})
              </h3>
              <Button variant="outline" size="sm" onClick={clearFiles}>
                すべて削除
              </Button>
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileType className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={getFileTypeColor(file.type)}
                        >
                          {file.type.split('/')[1].toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 変換先フォーマット選択 */}
        <div className="space-y-2">
          <label className="font-medium">変換先フォーマット:</label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue placeholder="フォーマットを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="avif">AVIF</SelectItem>
              <SelectItem value="gif">GIF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 変換ボタン */}
        <Button
          onClick={handleConvert}
          className="w-full"
          disabled={loading || files.length === 0}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              変換中...
            </>
          ) : (
            '変換する'
          )}
        </Button>

        {/* 進捗バー */}
        {loading && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-xs text-center text-gray-500">
              {progress}% 完了
            </p>
          </div>
        )}
      </CardContent>

      {/* 変換結果表示 */}
      {convertedFiles.length > 0 && (
        <CardFooter className="flex flex-col">
          <Separator className="my-4" />
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                変換されたファイル ({convertedFiles.length})
              </h3>
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
              {convertedFiles.map((file, index) => (
                <div
                  key={index}
                  className="p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileType className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800"
                        >
                          {format.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={file.url} download={file.name}>
                      ダウンロード
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
