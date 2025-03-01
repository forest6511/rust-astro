// src/stores/categoryStore.ts
import { atom } from 'nanostores'

// ローカルストレージから初期値を取得
const getInitialValue = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('selectedCategory')
    return saved ? Number(saved) : null
  }
  return null
}

export const selectedCategoryStore = atom<number | null>(getInitialValue())

// 値が変更されたらローカルストレージに保存
selectedCategoryStore.subscribe((value) => {
  if (typeof window !== 'undefined') {
    if (value === null) {
      localStorage.removeItem('selectedCategory')
    } else {
      localStorage.setItem('selectedCategory', value.toString())
    }
  }
})
