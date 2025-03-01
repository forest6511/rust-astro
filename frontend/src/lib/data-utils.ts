// src/lib/data-utils.ts
import { categories, type Category } from '@/data/category'
import { tools, type Tool } from '@/data/tool'

// カテゴリ関連の関数
export function getCategoryById(id: number | null): Category | undefined {
  if (id === null)
    return { id: 0, name: 'すべて', bg: '#FFFFFF', text: '#000000' }
  return categories.find((cat) => cat.id === id)
}

// ツール関連の関数
export function getToolsByCategory(categoryId: number | null): Tool[] {
  if (categoryId === null) return tools
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
  return category && category.id !== 0
    ? `${category.name}カテゴリの便利なツールコレクション - QuickToolify`
    : 'QuickToolifyでは、様々なカテゴリの便利なツールを簡単に見つけることができます。'
}
