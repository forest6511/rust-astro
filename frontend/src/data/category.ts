export interface Category {
  id: number
  name: string
  bg: string
  text: string
}

export const categories: Category[] = [
  { id: 1, name: '画像編集', bg: '#FFEBEE', text: '#D32F2F' },
  { id: 2, name: 'JSON整形', bg: '#E3F2FD', text: '#1976D2' },
  { id: 3, name: '動画変換', bg: '#FFF9C4', text: '#FBC02D' },
  { id: 4, name: '圧縮ツール', bg: '#E8F5E9', text: '#388E3C' },
  { id: 5, name: 'ドキュメント変換', bg: '#F3E5F5', text: '#8E24AA' },
]
