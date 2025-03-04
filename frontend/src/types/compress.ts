// src/types/compress.ts
export interface CompressedFile {
  originalName: string
  name: string
  url: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

export interface CompressedFileListProps {
  compressedFiles: CompressedFile[]
  clearFiles: () => void
}
