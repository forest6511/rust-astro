// src/components/MainContent.tsx
import { useEffect } from 'react'
import { selectedCategoryStore } from '@/stores/categoryStore'

interface MainContentProps {
  initialCategoryId?: number | null
}

// このコンポーネントはクライアントサイドの状態管理のみを担当
const MainContent: React.FC<MainContentProps> = ({
  initialCategoryId = null,
}) => {
  // 初期カテゴリIDをストアに設定
  useEffect(() => {
    if (initialCategoryId !== undefined) {
      selectedCategoryStore.set(initialCategoryId)
    }
  }, [initialCategoryId])

  // 表示は不要（サーバーサイドで生成済み）
  return null
}

export default MainContent
