// src/components/MainContent.tsx
import { useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { selectedCategoryStore } from '@/stores/categoryStore'

interface MainContentProps {
  initialCategoryId?: number | null;
}

const MainContent: React.FC<MainContentProps> = ({ initialCategoryId = null }) => {
  const selectedCategory = useStore(selectedCategoryStore)

  // 初期値の設定
  useEffect(() => {
    if (initialCategoryId !== undefined && initialCategoryId !== selectedCategory) {
      selectedCategoryStore.set(initialCategoryId);
    }
  }, [initialCategoryId]);

  // 実際のレンダリングコードは必要なくなるため、
  // カテゴリが変更された時の処理だけを行う空のコンポーネントとして機能
  return null;
}

export default MainContent