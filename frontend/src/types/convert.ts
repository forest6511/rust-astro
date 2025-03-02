// types/convert.ts
export interface ConvertedFile {
  originalName: string
  name: string
  url: string
  size: number
}

export interface ConvertedFileListProps {
  convertedFiles: ConvertedFile[]
  format: string
  clearFiles: () => void
}
