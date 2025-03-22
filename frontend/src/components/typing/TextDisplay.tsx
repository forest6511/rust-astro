// src/components/typing/TextDisplay.tsx
import React from 'react';
import { Progress } from '@/components/ui/progress.tsx';

interface TextDisplayProps {
  currentText: string;
  typedText: string;
  isStarted: boolean;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({
                                                          currentText,
                                                          typedText,
                                                          isStarted
                                                        }) => {
  if (!isStarted) {
    return (
      <p className="text-center py-8 text-gray-500">
        「練習開始」ボタンをクリックしてタイピング練習を始めてください
      </p>
    );
  }

  return (
    <>
      <div className="text-xl mb-4 font-mono">
        {currentText.split('').map((char, index) => {
          const isCurrent = index === typedText.length;
          const isTyped = index < typedText.length;
          const isCorrect = isTyped && typedText[index] === char;

          return (
            <span
              key={index}
              className={`${
                isCurrent ? 'bg-blue-200 border-b-2 border-blue-500' :
                  isTyped ? (isCorrect ? 'text-green-600' : 'text-red-600 bg-red-100') : ''
              }`}
            >
              {char}
            </span>
          );
        })}
      </div>

      <Progress
        value={(typedText.length / currentText.length) * 100}
        className="mb-2"
      />

      <p className="text-sm text-gray-500 text-center">
        入力してください（入力欄は非表示になっています）
      </p>
    </>
  );
};