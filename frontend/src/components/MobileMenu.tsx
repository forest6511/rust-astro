// MobileMenu.tsx
import type React from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { useStore } from '@nanostores/react'
import { mobileMenuStore } from '@/stores/mobileMenuStore'

interface MobileMenuProps {
  children: React.ReactNode
}

const MobileMenu: React.FC<MobileMenuProps> = ({ children }) => {
  const isOpen = useStore(mobileMenuStore)

  const handleClose = () => {
    mobileMenuStore.set(false)
  }

  return (
    <div
      id="mobile-menu"
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-label="カテゴリメニュー"
    >
      <nav
        className={`absolute left-0 top-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="モバイルナビゲーション"
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">カテゴリ</h2>
          <Button
            variant="ghost"
            onClick={handleClose}
            aria-label="メニューを閉じる"
          >
            <X size={24} />
          </Button>
        </div>
        <div className="overflow-y-auto h-full pb-16">{children}</div>
      </nav>
    </div>
  )
}

export default MobileMenu
