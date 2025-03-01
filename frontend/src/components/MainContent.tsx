// src/components/MainContent.tsx
import { useEffect } from 'react'
import { selectedCategoryStore } from '@/stores/categoryStore'

interface MainContentProps {
  initialCategoryId?: number | null
}

// このコンポーネントはクライアントサイドの状態初期化のみを担当
const MainContent: React.FC<MainContentProps> = ({
  initialCategoryId = null,
}) => {
  useEffect(() => {
    if (initialCategoryId !== undefined) {
      selectedCategoryStore.set(initialCategoryId)
    }
  }, [initialCategoryId])

  // 実際の表示はサーバーサイドで行うため、何も表示しない
  return null
}

export default MainContent
