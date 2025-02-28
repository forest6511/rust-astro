// Header.tsx
import type React from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mobileMenuStore } from '@/stores/mobileMenuStore'

interface HeaderProps {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const handleMenuClick = () => {
    mobileMenuStore.set(!mobileMenuStore.get())
  }

  return (
    <header className="w-full bg-white border-b shadow-md" role="banner">
      <div className="w-full px-4 flex items-center h-14">
        <Button
          variant="ghost"
          className="sm:hidden mr-2 -ml-2"
          onClick={handleMenuClick}
          aria-label="メニューを開く"
          aria-expanded={mobileMenuStore.get()}
          aria-controls="mobile-menu"
        >
          <Menu size={24} />
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </header>
  )
}

export default Header
