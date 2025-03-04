// src/components/images/compress/FileDropzone.tsx
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'

type FileDropzoneProps = {
  onDrop: (acceptedFiles: File[], rejectedFiles: any[]) => void
  loading: boolean
}

export default function FileDropzone({ onDrop, loading }: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    disabled: loading,
    maxSize: 10 * 1024 * 1024, // 20MB
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm font-medium">画像をドラッグ＆ドロップ</p>
      <p className="text-xs text-gray-500 mt-1">
        または クリックしてファイルを選択
      </p>
      <p className="text-xs text-gray-500 mt-3">
        対応フォーマット: JPG, PNG, WebP (10MB以下)
      </p>
    </div>
  )
}
