// components/convert/FormatSelector.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

type FormatSelectorProps = {
  format: string
  formatHistory: string[]
  onFormatChange: (format: string) => void
  disabled?: boolean
}

export default function FormatSelector({
  format,
  formatHistory,
  onFormatChange,
  disabled,
}: FormatSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="font-medium">変換先フォーマット:</label>
      <Select value={format} onValueChange={onFormatChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="フォーマットを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="jpeg">JPEG</SelectItem>
          <SelectItem value="png">PNG</SelectItem>
          <SelectItem value="webp">WebP</SelectItem>
          <SelectItem value="avif">AVIF</SelectItem>

          {formatHistory.length > 0 && (
            <>
              <Separator />
              <div className="px-2 py-1 text-xs text-gray-500">
                最近の変換先
              </div>
              {formatHistory
                .filter(
                  (historyFormat) =>
                    !['jpeg', 'png', 'webp', 'avif'].includes(historyFormat)
                )
                .map((historyFormat) => (
                  <SelectItem key={historyFormat} value={historyFormat}>
                    {historyFormat.toUpperCase()}
                  </SelectItem>
                ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
