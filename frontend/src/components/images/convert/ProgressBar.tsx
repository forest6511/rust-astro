// components/convert/ProgressBar.tsx
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'

type ProgressBarProps = {
  progress: number
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <p className="font-medium">変換中...</p>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-center text-gray-500">{progress}% 完了</p>
    </div>
  )
}
