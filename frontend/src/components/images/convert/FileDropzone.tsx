// components/convert/FileDropzone.tsx
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'

type FileDropzoneProps = {
  onDrop: (acceptedFiles: File[], rejectedFiles: any[]) => void
  loading: boolean
}

export default function FileDropzone({ onDrop, loading }: FileDropzoneProps) {
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
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
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
          <p className="font-medium text-gray-500">
            変換中はファイルをアップロードできません
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
          対応フォーマット: JPG, PNG, WebP, HEIC, AVIF (10MB以下)
        </p>
      </div>
    </div>
  )
}
