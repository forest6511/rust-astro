// src/components/typing/ResultModal.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { TypingResult } from '@/types/typing.ts'

interface ResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: TypingResult;
  onRetry: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
                                                          open,
                                                          onOpenChange,
                                                          result,
                                                          onRetry
                                                        }) => {
  // 「もう一度練習する」ボタンのクリックハンドラ
  const handleRetryClick = () => {
    // まずモーダルを閉じる
    onOpenChange(false);

    // 少し遅延させてから練習を再開する（状態更新の順序を保証）
    setTimeout(() => {
      onRetry();
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>タイピング練習結果</DialogTitle>
          <DialogDescription>
            お疲れ様でした！タイピング練習の結果です。
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{result.wpm}</div>
            <div className="text-sm text-gray-500">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{result.accuracy}%</div>
            <div className="text-sm text-gray-500">正確性</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{result.time}</div>
            <div className="text-sm text-gray-500">秒</div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleRetryClick}>
            もう一度練習する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};