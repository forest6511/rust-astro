// src/components/typing/TypingPractice.tsx
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

import { KEYBOARD_LAYOUTS } from './data/keyboard-layouts'
import { PRACTICE_TEXTS } from './data/practice-texts'
import { KeyboardDisplay } from './KeyboardDisplay'
import { ResultModal } from './ResultModal'
import { TextDisplay } from './TextDisplay'
import type {
  KeyboardType,
  OSType,
  PracticeType,
  TypingResult,
} from '@/types/typing.ts'

export default function TypingPractice() {
  // 状態管理
  const [os, setOs] = useState<OSType>('WINDOWS')
  const [keyboardType, setKeyboardType] = useState<KeyboardType>('US')
  const [practiceType, setPracticeType] = useState<PracticeType>('HOME_ROW')
  const [currentText, setCurrentText] = useState('')
  const [typedText, setTypedText] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [time, setTime] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [keyHighlight, setKeyHighlight] = useState('')
  const [showResultModal, setShowResultModal] = useState(false)
  const [result, setResult] = useState<TypingResult>({
    wpm: 0,
    accuracy: 0,
    time: 0,
  })

  // refs
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<number | null>(null)

  // キーボードレイアウトの取得
  const getCurrentKeyboard = () => KEYBOARD_LAYOUTS[keyboardType][os]

  // 練習タイプに基づいてランダムなテキストを取得
  const getRandomPracticeText = () => {
    const texts = PRACTICE_TEXTS[practiceType]
    return texts[Math.floor(Math.random() * texts.length)]
  }

  // 練習の開始
  const startPractice = () => {
    // 既に開始していた場合は一度リセット
    if (isStarted) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    setCurrentText(getRandomPracticeText())
    setTypedText('')
    setMistakes(0)
    setTime(0)
    setWpm(0)
    setAccuracy(100)
    setIsStarted(true)
    setShowResultModal(false)

    timerRef.current = window.setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // 練習の終了
  const endPractice = () => {
    setIsStarted(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // 結果をセットしてモーダルを表示
    setResult({
      wpm,
      accuracy,
      time,
    })
    setShowResultModal(true)
  }

  // WPMと精度の計算
  useEffect(() => {
    if (isStarted && typedText.length > 0) {
      // WPM計算 (1分あたりの単語数、1単語=5文字として計算)
      const minutes = time / 60
      if (minutes > 0) {
        const words = typedText.length / 5
        setWpm(Math.round(words / minutes))
      }

      // 精度計算
      const totalChars = typedText.length
      const errorRate = mistakes / totalChars
      setAccuracy(Math.round((1 - errorRate) * 100))
    }
  }, [time, typedText, mistakes, isStarted])

  // 入力処理
  const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isStarted) return

    const key = e.key

    // 次に打つべき文字
    const nextChar = currentText[typedText.length]

    // バックスペースの処理
    if (key === 'Backspace') {
      if (typedText.length > 0) {
        setTypedText((prev) => prev.slice(0, -1))
      }
      return
    }

    // 1文字だけの入力を処理
    if (key.length === 1) {
      // 文字をハイライト表示
      setKeyHighlight(key.toLowerCase())
      setTimeout(() => setKeyHighlight(''), 200)

      // 入力文字の処理
      setTypedText((prev) => prev + key)

      // ミスの確認
      if (key !== nextChar) {
        setMistakes((prev) => prev + 1)
      }

      // 終了判定
      if (typedText.length + 1 >= currentText.length) {
        endPractice()
      }
    }
  }

  // useEffectでクリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ブラインドタッチ練習</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">OS選択:</label>
          <Select value={os} onValueChange={(value: OSType) => setOs(value)}>
            <SelectTrigger>
              <SelectValue placeholder="OSを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WINDOWS">Windows</SelectItem>
              <SelectItem value="MAC">Mac</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            キーボード配列:
          </label>
          <Select
            value={keyboardType}
            onValueChange={(value: KeyboardType) => setKeyboardType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="配列を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">US配列</SelectItem>
              <SelectItem value="JP">日本語配列</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">練習タイプ:</label>
          <Select
            value={practiceType}
            onValueChange={(value: PracticeType) => setPracticeType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="練習タイプを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOME_ROW">ホームポジション</SelectItem>
              <SelectItem value="TOP_ROW">上段</SelectItem>
              <SelectItem value="BOTTOM_ROW">下段</SelectItem>
              <SelectItem value="MIXED">英単語</SelectItem>
              <SelectItem value="NUMBERS">数字</SelectItem>
              <SelectItem value="SYMBOLS">記号</SelectItem>
              <SelectItem value="JAPANESE_MIXED">日本語混合</SelectItem>
              <SelectItem value="PROGRAMMING">プログラミング</SelectItem>
              <SelectItem value="PUNCTUATION">句読点練習</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={startPractice}
        className="mb-6 bg-blue-600 hover:bg-blue-700"
      >
        {isStarted ? '問題を変更' : '練習開始'}
      </Button>

      {isStarted && (
        <div className="text-right mb-2">
          <Badge variant="outline" className="mr-2">
            {wpm} WPM
          </Badge>
          <Badge variant="outline" className="mr-2">
            {accuracy}% 正確性
          </Badge>
          <Badge variant="outline">{time}秒</Badge>
        </div>
      )}

      <div className="mb-6 bg-gray-50 p-4 rounded-lg border shadow-sm">
        <TextDisplay
          currentText={currentText}
          typedText={typedText}
          isStarted={isStarted}
        />

        {/* 入力用の非表示フィールド */}
        {isStarted && (
          <input
            ref={inputRef}
            type="text"
            className="opacity-0 absolute"
            autoFocus
            value={typedText}
            onChange={() => {}} // 実際の入力はkeydownイベントで処理
            onKeyDown={handleTyping}
          />
        )}
      </div>

      <KeyboardDisplay layout={getCurrentKeyboard()} highlight={keyHighlight} />

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">使い方</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>OS、キーボード配列、練習タイプを選択</li>
          <li>「練習開始」ボタンをクリック</li>
          <li>表示されたテキストを入力</li>
          <li>キーボードには次に押すべきキーがハイライト表示されます</li>
          <li>テキストをすべて入力すると練習が終了し、結果が表示されます</li>
          <li>
            いつでも「問題を変更」をクリックして新しい問題に切り替えられます
          </li>
        </ol>
      </div>

      {/* 結果表示モーダル */}
      <ResultModal
        open={showResultModal}
        onOpenChange={setShowResultModal}
        result={result}
        onRetry={startPractice}
      />
    </div>
  )
}
