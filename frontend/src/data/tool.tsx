import type React from 'react'

export interface Tool {
  id: number
  categoryId: number
  name: string
  description: string
  iconName: string
  slug: string
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
    iconName: 'Image',
    slug: 'image-resize',
    url: '/tool/image-resize',
    bg: '#FFF3F3',
    text: '#C62828',
  },
  {
    id: 2,
    categoryId: 1,
    name: '画像圧縮',
    description: '画像の容量を軽量化',
    iconName: 'FileArchive',
    slug: 'image-compress',
    url: '/tool/image-compress',
    bg: '#F3E5F5',
    text: '#6A1B9A',
  },
  {
    id: 3,
    categoryId: 1,
    name: '画像フォーマット変換',
    description: 'JPEG, PNG, WebP 変換',
    iconName: 'RefreshCw',
    slug: 'image-convert',
    url: '/tool/image-convert',
    bg: '#E8F5E9',
    text: '#2E7D32',
  },
  {
    id: 4,
    categoryId: 2,
    name: 'JSONフォーマット',
    description: 'JSONデータを整形',
    iconName: 'FileArchive',
    slug: 'json-format',
    url: '/tool/json-format',
    bg: '#E8F4FD',
    text: '#1565C0',
  },
  {
    id: 5,
    categoryId: 6,
    name: 'パスワード生成',
    description: 'パスワードを自動生成',
    iconName: 'Key',
    slug: 'generate-password',
    url: '/tool/generate-password',
    bg: '#FFFDE7',
    text: '#F9A825',
  },
  {
    id: 6,
    categoryId: 4,
    name: 'ZIP圧縮',
    description: 'ファイルをZIPに圧縮',
    iconName: 'FileArchive',
    slug: 'zip-compress',
    url: '/tool/zip-compress',
    bg: '#E8F5E9',
    text: '#2E7D32',
  },
  {
    id: 7,
    categoryId: 5,
    name: 'PDF変換',
    description: 'ドキュメントをPDFに変換',
    iconName: 'RefreshCw',
    slug: 'pdf-convert',
    url: '/tool/pdf-convert',
    bg: '#F3E5F5',
    text: '#6A1B9A',
  },
  {
    id: 8,
    categoryId: 6,
    name: 'TODOリスト',
    description: 'シンプルなタスク管理ツール',
    iconName: 'CheckSquare',
    slug: 'todo-list',
    url: '/tool/todo-list',
    bg: '#E0F7FA',
    text: '#00838F',
  },
]
