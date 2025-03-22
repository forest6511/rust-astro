// src/components/typing/KeyboardDisplay.tsx
import React from 'react'

interface KeyboardDisplayProps {
  layout: string[][]
  highlight: string
}

export const KeyboardDisplay: React.FC<KeyboardDisplayProps> = ({
  layout,
  highlight,
}) => {
  return (
    <div className="keyboard-container mt-4 mb-6">
      {layout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center gap-1 mb-1 flex-wrap"
        >
          {row.map((key, keyIndex) => {
            const isHighlighted =
              highlight && key.toLowerCase() === highlight.toLowerCase()
            const keyWidth =
              key === 'Space'
                ? 'w-32 md:w-48'
                : key === 'cmd'
                  ? 'w-12'
                  : key === 'opt'
                    ? 'w-12'
                    : key === 'ctrl'
                      ? 'w-12'
                      : [
                            'Backspace',
                            'Tab',
                            'Caps',
                            'Enter',
                            'Return',
                            'Shift',
                            'Delete',
                          ].includes(key)
                        ? 'w-16'
                        : key.length > 1
                          ? 'w-12'
                          : 'w-10'

            return (
              <div
                key={`${rowIndex}-${keyIndex}`}
                className={`
                ${keyWidth} h-10 flex items-center justify-center rounded 
                border border-gray-300 bg-gray-100 text-sm 
                ${isHighlighted ? 'bg-blue-500 text-white' : ''}
              `}
              >
                {key}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
