// components/images/imageConvert.tsx
import { useState, useCallback, useEffect } from 'react'
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
import { Loader2, Upload, FileType, X, AlertCircle, Check } from 'lucide-react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { convertImages } from '@/lib/api.ts'

type ConvertedFile = {
  originalName: string
  name: string
  url: string
  size: number
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ImageConverter() {
  const [files, setFiles] = useState<File[]>([])
  const [format, setFormat] = useState('webp')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([])
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // ファイルサイズチェック
    const oversizedFiles = acceptedFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setError(`ファイルサイズが10MBを超えています: ${oversizedFiles.map(f => f.name).join(', ')}`);
      acceptedFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);
    }

    if (rejectedFiles.length > 0) {
      setError('サポートされていないファイル形式は選択できません');
    }

    if (loading) {
      setError('変換中は新しいファイルをアップロードできません');
      return;
    }

    // 変換元と変換先が同じファイルをチェック
    const sameFormatFiles = acceptedFiles.filter(file => {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (format === 'jpeg' && (fileExt === 'jpg' || fileExt === 'jpeg')) return true;
      return fileExt === format;
    });

    if (sameFormatFiles.length > 0) {
      setError(`変換元と変換先が同じフォーマットです: ${sameFormatFiles.map(f => f.name).join(', ')}`);
      acceptedFiles = acceptedFiles.filter(file => {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (format === 'jpeg' && (fileExt === 'jpg' || fileExt === 'jpeg')) return false;
        return fileExt !== format;
      });
    }

    if (acceptedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    }
  }, [format, loading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic'],
      'image/avif': ['.avif'],
    },
    multiple: true,
    onDrop,
    disabled: loading,
    maxSize: MAX_FILE_SIZE,
  })

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }

  const clearFiles = () => {
    setFiles([]);
    setConvertedFiles([]);
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
    return 'bg-gray-100 text-gray-800'
  }

  const convertFile = async (file: File) => {
    try {
      console.log(`変換開始: ${file.name} -> ${format}形式`);
      // 1ファイルずつ変換
      const result = await convertImages([file], format);
      console.log(`変換完了: ${file.name}`);
      return result.files[0];
    } catch (error) {
      console.error('Conversion error:', error);
      throw error;
    }
  }

  // ファイルが追加されたら自動的に変換開始
  useEffect(() => {
    const processFiles = async () => {
      if (files.length === 0 || loading) return;

      setLoading(true);
      setError(null);
      setProgress(0);

      console.log(`${files.length}個のファイルを処理開始`);

      const convertedFilesArray: ConvertedFile[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          // 1ファイルずつ処理
          const file = files[i];
          console.log(`ファイル ${i+1}/${files.length} 処理中: ${file.name}`);

          const convertedFile = await convertFile(file);
          convertedFilesArray.push(convertedFile);

          // プログレス更新
          const newProgress = Math.round(((i + 1) / files.length) * 100);
          setProgress(newProgress);
          setConvertedFiles([...convertedFilesArray]);

          console.log(`進捗: ${newProgress}%`);
        }

        console.log('全ファイル処理完了');
      } catch (error) {
        console.error('Conversion process error:', error);
        setError('変換中にエラーが発生しました。もう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };

    processFiles();
  }, [files]);

  // 変換先フォーマット変更時にエラーをクリア
  useEffect(() => {
    setError(null);
  }, [format]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">画像フォーマット変換</CardTitle>
        <CardDescription>
          JPG、PNG、WebP、HEIC、AVIF形式の画像を別のフォーマットに変換できます
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* エラーメッセージ */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 変換先フォーマット選択 */}
        <div className="space-y-2">
          <label className="font-medium">変換先フォーマット:</label>
          <Select value={format} onValueChange={setFormat} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="フォーマットを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="avif">AVIF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ファイルアップロード */}
        <div
          {...getRootProps()}
          className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-gray-400" />
            {isDragActive ? (
              <p className="text-primary font-medium">
                ファイルをドロップしてアップロード
              </p>
            ) : loading ? (
              <p className="font-medium text-gray-500">変換中はファイルをアップロードできません</p>
            ) : (
              <>
                <p className="font-medium">画像をドラッグ＆ドロップ</p>
                <p className="text-sm text-gray-500">
                  または クリックしてファイルを選択
                </p>
              </>
            )}
            <p className="text-xs text-gray-400 mt-2">
              対応フォーマット: JPG, PNG, WebP, HEIC, AVIF (10MB以下)
            </p>
          </div>
        </div>

        {/* 進捗バー */}
        {loading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="font-medium">変換中...</p>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-gray-500">
              {progress}% 完了
            </p>
          </div>
        )}

        {/* 変換結果表示 */}
        {convertedFiles.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Check className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">
                変換完了
              </h3>
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
              {convertedFiles.map((file, index) => {
                const isError = file.url.startsWith('error:');

                return (
                  <div
                    key={index}
                    className={`p-3 flex items-center justify-between ${isError ? 'bg-red-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* サムネイル表示部分 */}
                      {isError ? (
                        <AlertCircle className="h-12 w-12 text-red-500" />
                      ) : (
                        <div className="h-12 w-12 border rounded overflow-hidden flex-shrink-0">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">
                          {file.originalName}
                        </p>
                        {isError ? (
                          <p className="text-xs text-red-600 mt-1">{file.url.substring(6)}</p>
                        ) : (
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
                        )}
                      </div>
                    </div>

                    {!isError && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={file.url} download={file.name}>
                          ダウンロード
                        </a>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={clearFiles}
                className="w-full max-w-xs"
              >
                クリア
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}