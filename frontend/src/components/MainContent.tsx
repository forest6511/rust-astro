// src/components/MainContent.tsx
import { useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { selectedCategoryStore } from '@/stores/categoryStore'
import { getCategoryById, getToolsByCategory } from '@/lib/data-utils'

interface MainContentProps {
  initialCategoryId?: number | null
}

const MainContent: React.FC<MainContentProps> = ({
  initialCategoryId = null,
}) => {
  const selectedCategory = useStore(selectedCategoryStore)

  // 初期値の設定 (SSRとクライアント状態の同期)
  useEffect(() => {
    if (
      initialCategoryId !== undefined &&
      initialCategoryId !== selectedCategory
    ) {
      selectedCategoryStore.set(initialCategoryId)
    }
  }, [initialCategoryId])

  // カテゴリに基づいてツールをフィルタリング
  const filteredTools = getToolsByCategory(selectedCategory)
  const currentCategory = getCategoryById(selectedCategory)?.name || 'すべて'

  return (
    <>
      <h2 id="category-title" className="text-xl font-semibold mb-4">
        {currentCategory}
      </h2>
      {filteredTools.length === 0 ? (
        <p className="text-center py-8 text-gray-500">
          このカテゴリにはツールがありません。
        </p>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          role="list"
          aria-label={`${currentCategory}カテゴリのツール`}
        >
          {filteredTools.map((tool) => (
            <a
              key={tool.id}
              href={tool.url}
              className="block tool-item"
              data-category-id={tool.categoryId}
              aria-label={`${tool.name}: ${tool.description}`}
              role="listitem"
            >
              <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
                <div className="flex flex-col items-center h-full">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-full mb-2"
                    style={{
                      backgroundColor: tool.bg,
                      color: tool.text,
                    }}
                    aria-hidden="true"
                  >
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-1 text-center">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center flex-grow">
                    {tool.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  )
}

export default MainContent
