// src/components/images/compress/QualitySelector.tsx
import { Slider } from '@/components/ui/slider'

type QualitySelectorProps = {
  quality: number
  onQualityChange: (quality: number) => void
  disabled?: boolean
}

export default function QualitySelector({
  quality,
  onQualityChange,
  disabled,
}: QualitySelectorProps) {
  // Image Magickで利用できる品質レベル
  const qualityPresets = [
    { value: 30, label: '高圧縮' },
    { value: 60, label: '標準' },
    { value: 80, label: '高品質' },
    { value: 95, label: '最高品質' },
  ]

  // 現在の品質に最も近いプリセットを取得
  const getNearestPresetLabel = (current: number) => {
    const preset = qualityPresets.find((p) => p.value === current)
    if (preset) return preset.label

    // 特定のプリセット値でない場合はカスタム表示
    return `カスタム (${current}%)`
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="font-medium">圧縮品質:</label>
        <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {getNearestPresetLabel(quality)}
        </span>
      </div>

      <Slider
        value={[quality]}
        min={1}
        max={100}
        step={1}
        onValueChange={(values) => onQualityChange(values[0])}
        disabled={disabled}
        className="my-6"
      />

      <div className="flex justify-between text-sm text-gray-500">
        <span>高圧縮</span>
        <span>高品質</span>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4">
        {qualityPresets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onQualityChange(preset.value)}
            disabled={disabled}
            className={`text-xs px-2 py-1 rounded border transition-colors ${
              quality === preset.value
                ? 'bg-blue-100 border-blue-300 text-blue-800'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
