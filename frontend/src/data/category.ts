export interface Category {
  id: number
  name: string
  bg: string
  text: string
  slug: string // SEOに最適化されたURLスラッグ
  description: string // カテゴリーの詳細説明
  keywords: string[] // 関連キーワード
}

export const categories: Category[] = [
  {
    id: 1,
    name: '画像編集',
    bg: '#FFEBEE',
    text: '#D32F2F',
    slug: 'image-editing',
    description: '画像サイズ変更、圧縮、フォーマット変換などの画像編集ツール',
    keywords: ['画像編集', '画像変換', 'リサイズ', '圧縮'],
  },
  {
    id: 2,
    name: 'データ整形',
    bg: '#E3F2FD',
    text: '#1976D2',
    slug: 'json-formatter',
    description: 'テキスト・JSONデータを整形、検証、変換するツール',
    keywords: ['JSON', 'データ整形', 'フォーマッター', '構造化データ'],
  },
  {
    id: 3,
    name: '動画変換',
    bg: '#FFF9C4',
    text: '#FBC02D',
    slug: 'video-converter',
    description: '様々な動画フォーマット間の変換ツール',
    keywords: ['動画変換', 'MP4', '動画フォーマット', '変換'],
  },
  {
    id: 4,
    name: '圧縮ツール',
    bg: '#E8F5E9',
    text: '#388E3C',
    slug: 'compression-tools',
    description: 'ファイルサイズを縮小するための各種圧縮ツール',
    keywords: ['圧縮', 'ZIP', 'ファイル圧縮', '容量削減'],
  },
  {
    id: 5,
    name: 'ドキュメント変換',
    bg: '#F3E5F5',
    text: '#8E24AA',
    slug: 'document-converter',
    description: 'PDF、Word、Excel間のドキュメント形式変換ツール',
    keywords: ['ドキュメント変換', 'PDF', 'Word', 'Excel', '変換'],
  },
  {
    id: 6,
    name: '生産性ツール',
    bg: '#E0F7FA',
    text: '#00838F',
    slug: 'productivity-tools',
    description: 'タスク管理やメモ作成など、日常の生産性向上に役立つツール',
    keywords: ['生産性', 'タスク管理', 'TODOリスト', 'メモ', '時間管理'],
  },
]
