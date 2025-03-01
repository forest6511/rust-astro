import type React from 'react'
import { Image, FileArchive, RefreshCw } from 'lucide-react'

export interface Tool {
  id: number
  categoryId: number
  name: string
  description: string
  icon: React.ReactNode
  url: string
  bg: string
  text: string
}

export const tools: Tool[] = [
  {
    id: 1,
    categoryId: 1,
    name: '画像リサイズ',
    description: '画像のサイズを変更',
    icon: <Image size={24} />,
    url: '/tool/image-resize',
    bg: '#FFF3F3',
    text: '#C62828',
  },
  {
    id: 2,
    categoryId: 1,
    name: '画像圧縮',
    description: '画像の容量を軽量化',
    icon: <FileArchive size={24} />,
    url: '/tool/image-compress',
    bg: '#F3E5F5',
    text: '#6A1B9A',
  },
  {
    id: 3,
    categoryId: 1,
    name: '画像フォーマット変換',
    description: 'JPEG, PNG, WebP 変換',
    icon: <RefreshCw size={24} />,
    url: '/tool/image-convert',
    bg: '#E8F5E9',
    text: '#2E7D32',
  },
  {
    id: 4,
    categoryId: 2,
    name: 'JSONフォーマット',
    description: 'JSONデータを整形',
    icon: <FileArchive size={24} />,
    url: '/tool/json-format',
    bg: '#E8F4FD',
    text: '#1565C0',
  },
  {
    id: 5,
    categoryId: 3,
    name: 'MP4変換',
    description: '動画をMP4形式に変換',
    icon: <RefreshCw size={24} />,
    url: '/tool/mp4-convert',
    bg: '#FFFDE7',
    text: '#F9A825',
  },
  {
    id: 6,
    categoryId: 4,
    name: 'ZIP圧縮',
    description: 'ファイルをZIPに圧縮',
    icon: <FileArchive size={24} />,
    url: '/tool/zip-compress',
    bg: '#E8F5E9',
    text: '#2E7D32',
  },
  {
    id: 7,
    categoryId: 5,
    name: 'PDF変換',
    description: 'ドキュメントをPDFに変換',
    icon: <RefreshCw size={24} />,
    url: '/tool/pdf-convert',
    bg: '#F3E5F5',
    text: '#6A1B9A',
  },
]
