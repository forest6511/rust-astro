// src/components/CategoryFilter.tsx
import type React from 'react'
import { useStore } from '@nanostores/react'
import { Button } from './ui/button'
import type { Category } from '@/data/category'
import { selectedCategoryStore } from '@/stores/categoryStore'
import { mobileMenuStore } from '@/stores/mobileMenuStore'

export interface CategoryFilterProps {
  categories: Category[]
  className?: string
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  className = '',
}) => {
  const selectedCategory = useStore(selectedCategoryStore)

  const handleCategorySelect = (categoryId: number | null) => {
    selectedCategoryStore.set(categoryId);

    // URLを更新して実際にナビゲーションする
    if (typeof window !== 'undefined') {
      const path = categoryId === null ? '/category/all' : `/category/${categoryId}`;
      // 現在と同じカテゴリの場合はナビゲーションしない
      if (window.location.pathname !== path) {
        window.location.href = path; // 実際のナビゲーション
      }
    }

    // モバイルメニューを閉じる
    mobileMenuStore.set(false);
  }

  return (
    <aside className={`${className}`} aria-label="カテゴリフィルター">
      <div className="hidden sm:block p-4">
        <h2 className="text-lg font-semibold mb-2">カテゴリ</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <div
          className="space-y-1 p-4 pt-0"
          role="group"
          aria-label="カテゴリ選択"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'ghost'}
              className="w-full justify-start text-sm py-2 px-3 h-auto"
              onClick={() =>
                handleCategorySelect(category.id === 0 ? null : category.id)
              }
              style={{
                backgroundColor:
                  selectedCategory === category.id ? category.bg : undefined,
                color:
                  selectedCategory === category.id ? category.text : undefined,
              }}
              data-category-id={category.id}
              aria-pressed={selectedCategory === category.id}
              aria-label={`カテゴリ: ${category.name}`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default CategoryFilter
