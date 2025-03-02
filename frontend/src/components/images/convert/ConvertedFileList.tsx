// components/convert/ConvertedFileList.tsx
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, AlertCircle } from 'lucide-react'
import type { ConvertedFileListProps } from '@/types/convert.ts'

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getDownloadFileName = (
  originalName: string | undefined,
  format: string
) => {
  if (!originalName) return `converted_image.${format}`
  const nameWithoutExt = originalName.split('.').slice(0, -1).join('.')
  return `${nameWithoutExt || 'converted_image'}.${format}`
}

export default function ConvertedFileList({
  convertedFiles,
  format,
  clearFiles,
}: ConvertedFileListProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Check className="h-5 w-5 text-green-500" />
        <h3 className="font-medium">変換完了</h3>
      </div>
      <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
        {convertedFiles.map((file, index) => {
          const isError = file.url.startsWith('error:')
          const downloadFileName = getDownloadFileName(
            file.originalName,
            format
          )

          return (
            <div
              key={index}
              className={`p-3 flex items-center justify-between ${isError ? 'bg-red-50' : ''}`}
            >
              <div className="flex items-center gap-3">
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
                    <p className="text-xs text-red-600 mt-1">
                      {file.url.substring(6)}
                    </p>
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
                  <a href={file.url} download={downloadFileName}>
                    ダウンロード
                  </a>
                </Button>
              )}
            </div>
          )
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
  )
}
