// src/lib/data-utils.ts
import { categories, type Category } from '@/data/category'
import { tools, type Tool } from '@/data/tool'

// すべてのカテゴリを表すオブジェクト
const allCategory: Category = {
  id: 0,
  name: 'すべて',
  bg: '#FFFFFF',
  text: '#000000',
  slug: 'all',
  description: 'すべてのツールカテゴリを表示します',
  keywords: ['ツール', 'すべて', 'コレクション', 'オンラインツール'],
}

// カテゴリ関連の関数
export function getCategoryById(id: number | null): Category | undefined {
  if (id === null || id === 0) return allCategory
  return categories.find((cat) => cat.id === id)
}

// スラッグからカテゴリを取得
export function getCategoryBySlug(slug: string): Category | undefined {
  if (slug === 'all') return allCategory
  return categories.find((cat) => cat.slug === slug)
}

// カテゴリIDからパスを取得
export function getCategoryPathById(categoryId: number | null): string {
  if (categoryId === null || categoryId === 0) return '/category/all'
  const category = getCategoryById(categoryId)
  return category ? `/category/${category.slug}` : '/category/all'
}

// スラッグからパスを取得
export function getCategoryPathBySlug(slug: string | null): string {
  return slug === null ? '/category/all' : `/category/${slug}`
}

// パスからカテゴリIDを取得
export function getCategoryIdFromPath(path: string): number | null {
  const match = path.match(/\/category\/(.+)$/)
  if (!match) return null

  const param = match[1]
  if (param === 'all') return null

  // まずスラッグで検索
  const categoryBySlug = getCategoryBySlug(param)
  if (categoryBySlug) return categoryBySlug.id

  // 数値と解釈できる場合はIDとして検索（後方互換性）
  if (/^\d+$/.test(param)) {
    const id = Number(param)
    const categoryById = getCategoryById(id)
    if (categoryById) return categoryById.id
  }

  return null
}

// ツール関連の関数
export function getToolsByCategory(categoryId: number | null): Tool[] {
  if (categoryId === null || categoryId === 0) return tools
  return tools.filter((tool) => tool.categoryId === categoryId)
}

// ページタイトルの生成
export function getPageTitle(categoryId: number | null): string {
  const category = getCategoryById(categoryId)
  return category
    ? `${category.name} - QuickToolify`
    : 'QuickToolify - 便利なツールコレクション'
}

// ページ説明の生成
export function getPageDescription(categoryId: number | null): string {
  const category = getCategoryById(categoryId)
  if (!category) {
    return 'QuickToolifyでは、様々なカテゴリの便利なツールを簡単に見つけることができます。'
  }

  return category.id === 0
    ? 'QuickToolifyでは、様々なカテゴリの便利なツールを簡単に見つけることができます。'
    : category.description
}

// ページキーワードの生成
export function getPageKeywords(categoryId: number | null): string {
  const category = getCategoryById(categoryId)
  if (!category || category.id === 0) {
    return 'ツール, オンラインツール, QuickToolify, ユーティリティ'
  }

  return category.keywords.join(', ')
}
