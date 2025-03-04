// src/components/images/compress/CompressedFileList.tsx
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, AlertCircle, Download } from 'lucide-react'
import type { CompressedFileListProps } from '@/types/compress'

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function CompressedFileList({
  compressedFiles,
  clearFiles,
}: CompressedFileListProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Check className="h-5 w-5 text-green-500" />
        <h3 className="font-medium">圧縮完了</h3>
      </div>
      <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
        {compressedFiles.map((file, index) => {
          const isError = file.url.startsWith('error:')
          const savingsPercent = isError
            ? 0
            : Math.round((1 - file.compressedSize / file.originalSize) * 100)

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
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.originalSize)} →{' '}
                        {formatFileSize(file.compressedSize)}
                      </span>
                      <Badge
                        variant="outline"
                        className={`${
                          savingsPercent > 30
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {savingsPercent > 0
                          ? `-${savingsPercent}%`
                          : '変更なし'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {!isError && (
                <Button variant="outline" size="sm" asChild>
                  <a href={file.url} download={file.originalName}>
                    <Download className="h-4 w-4 mr-1" />
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
