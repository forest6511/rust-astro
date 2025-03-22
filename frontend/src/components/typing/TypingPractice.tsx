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
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// キーボードレイアウトの型定義
type OSType = 'WINDOWS' | 'MAC';
type KeyboardType = 'US' | 'JP';
type PracticeType = 'HOME_ROW' | 'TOP_ROW' | 'BOTTOM_ROW' | 'MIXED' | 'NUMBERS' | 'SYMBOLS' | 'JAPANESE_MIXED' | 'PROGRAMMING' | 'PUNCTUATION';

// キーボードレイアウトの定義
const KEYBOARD_LAYOUTS: Record<KeyboardType, Record<OSType, string[][]>> = {
  US: {
    WINDOWS: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
      ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
      ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl']
    ],
    MAC: [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Delete'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
      ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Return'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
      ['fn', 'ctrl', 'opt', 'cmd', 'Space', 'cmd', 'opt', 'ctrl']
    ]
  },
  JP: {
    WINDOWS: [
      ['半角/全角', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '^', '\\', 'Backspace'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '@', '[', 'Enter'],
      ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ':', ']'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '\\', 'Shift'],
      ['Ctrl', 'Win', 'Alt', '無変換', 'Space', '変換', 'カタカナ', 'Alt', 'Menu', 'Ctrl']
    ],
    MAC: [
      ['英数', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '^', '\\', 'Delete'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '@', '[', 'Return'],
      ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ':', ']'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '\\', 'Shift'],
      ['fn', 'ctrl', 'opt', 'cmd', 'Space', 'cmd', 'opt', 'ctrl']
    ]
  }
}

// 練習用のテキストセット
const PRACTICE_TEXTS: Record<PracticeType, string[]> = {
  HOME_ROW: [
    "asdf jkl; asdf jkl; asdf jkl;",
    "asdfjkl; asdfjkl; asdfjkl;",
    "a;sldkfj a;sldkfj a;sldkfj",
    "dad sad lad fad jak ask all",
    "as la da fa ja ka sa ;a a; l;",
  ],
  TOP_ROW: [
    "qwer tyui qwer tyui qwer tyui",
    "qwertyui qwertyui qwertyui",
    "quit wet pet rye top yip ire",
    "require property quiet type",
    "we were tyre your quiet pie",
  ],
  BOTTOM_ROW: [
    "zxcv bnm, zxcv bnm, zxcv bnm,",
    "zxcvbnm, zxcvbnm, zxcvbnm,",
    "zoo box cat van bin man cool",
    "zoom extra vibe next combo",
    "zebra mixer choice vibrant",
  ],
  MIXED: [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "Sphinx of black quartz, judge my vow.",
    "Amazingly few discotheques provide jukeboxes.",
  ],
  NUMBERS: [
    "1234 5678 1234 5678 1234 5678",
    "12345678 12345678 12345678",
    "19 28 37 46 55 64 73 82 91",
    "123 456 789 123 456 789",
    "2021 1984 3456 7890 1234",
  ],
  SYMBOLS: [
    "!@#$ %^&* !@#$ %^&* !@#$ %^&*",
    "!@#$%^&* !@#$%^&* !@#$%^&*",
    "a@b#c$d% e^f&g*h( i)j_k+",
    "!? [] {} () <> :: ;; --",
    "a-b_c:d;e\"f'g\\h|i/j*k+l",
  ],
  JAPANESE_MIXED: [
    "こんにちは、Hello123!世界へようこそ。",
    "私の電話番号は090-1234-5678です。",
    "メールアドレス: example@mail.co.jp",
    "今日は2025年3月23日(日)です。",
    "プログラミング言語：JavaScript、Python、C#、Ruby",
  ],
  PROGRAMMING: [
    "const array = [1, 2, 3].map(x => x * 2);",
    "if (condition) { return true; } else { return false; }",
    "function hello() { console.log('Hello, world!'); }",
    "import React, { useState } from 'react';",
    "SELECT * FROM users WHERE age > 18 ORDER BY name;",
  ],
  PUNCTUATION: [
    "Hello, world! How are you today? I'm fine, thank you.",
    "Please check the website (https://example.com) for more info.",
    "Items needed: eggs, milk, bread, cheese, and apples.",
    "The password is: P@ssw0rd! Keep it secret.",
    "\"To be, or not to be,\" that is the question.",
  ]
}

interface KeyboardDisplayProps {
  layout: string[][];
  highlight: string;
}

export default function TypingPractice() {
  const [os, setOs] = useState<OSType>('WINDOWS');
  const [keyboardType, setKeyboardType] = useState<KeyboardType>('US');
  const [practiceType, setPracticeType] = useState<PracticeType>('HOME_ROW');
  const [currentText, setCurrentText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [keyHighlight, setKeyHighlight] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState({ wpm: 0, accuracy: 0, time: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  // キーボードレイアウトの取得
  const getCurrentKeyboard = () => KEYBOARD_LAYOUTS[keyboardType][os];

  // 練習タイプに基づいてランダムなテキストを取得
  const getRandomPracticeText = () => {
    const texts = PRACTICE_TEXTS[practiceType];
    return texts[Math.floor(Math.random() * texts.length)];
  }

  // 練習の開始
  const startPractice = () => {
    setCurrentText(getRandomPracticeText());
    setTypedText('');
    setMistakes(0);
    setTime(0);
    setWpm(0);
    setAccuracy(100);
    setIsStarted(true);

    if (timerRef.current) clearInterval(timerRef.current);

    // setIntervalの型を正しく扱うため、window明示的に指定
    timerRef.current = window.setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  // 練習の終了
  const endPractice = () => {
    setIsStarted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 結果をセットしてモーダルを表示
    setResult({
      wpm,
      accuracy,
      time
    });
    setShowResultModal(true);
  }

  // WPMと精度の計算
  useEffect(() => {
    if (isStarted && typedText.length > 0) {
      // WPM計算 (1分あたりの単語数、1単語=5文字として計算)
      const minutes = time / 60;
      if (minutes > 0) {
        const words = typedText.length / 5;
        setWpm(Math.round(words / minutes));
      }

      // 精度計算
      const totalChars = typedText.length;
      const errorRate = mistakes / totalChars;
      setAccuracy(Math.round((1 - errorRate) * 100));
    }
  }, [time, typedText, mistakes, isStarted]);

  // 入力処理
  const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isStarted) return;

    const key = e.key;

    // 次に打つべき文字
    const nextChar = currentText[typedText.length];

    // バックスペースの処理
    if (key === 'Backspace') {
      if (typedText.length > 0) {
        setTypedText(prev => prev.slice(0, -1));
      }
      return;
    }

    // 1文字だけの入力を処理
    if (key.length === 1) {
      // 文字をハイライト表示
      setKeyHighlight(key.toLowerCase());
      setTimeout(() => setKeyHighlight(''), 200);

      // 入力文字の処理
      setTypedText(prev => prev + key);

      // ミスの確認
      if (key !== nextChar) {
        setMistakes(prev => prev + 1);
      }

      // 終了判定
      if (typedText.length + 1 >= currentText.length) {
        endPractice();
      }
    }
  }

  // キーボード表示コンポーネント
  const KeyboardDisplay = ({ layout, highlight }: KeyboardDisplayProps) => {
    return (
      <div className="keyboard-container mt-4 mb-6">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-1 flex-wrap">
            {row.map((key, keyIndex) => {
              const isHighlighted = highlight && key.toLowerCase() === highlight.toLowerCase();
              // キーの幅を調整
              const keyWidth =
                key === 'Space' ? 'w-32 md:w-48' :
                  key === 'cmd' ? 'w-12' :
                    key === 'opt' ? 'w-12' :
                      key === 'ctrl' ? 'w-12' :
                        ['Backspace', 'Tab', 'Caps', 'Enter', 'Return', 'Shift', 'Delete'].includes(key) ? 'w-16' :
                          key.length > 1 ? 'w-12' : 'w-10';

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
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // useEffectでクリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
          <label className="block text-sm font-medium mb-2">キーボード配列:</label>
          <Select value={keyboardType} onValueChange={(value: KeyboardType) => setKeyboardType(value)}>
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
          <Select value={practiceType} onValueChange={(value: PracticeType) => setPracticeType(value)}>
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
        disabled={isStarted}
      >
        練習開始
      </Button>

      {isStarted && (
        <div className="text-right mb-2">
          <Badge variant="outline" className="mr-2">{wpm} WPM</Badge>
          <Badge variant="outline" className="mr-2">{accuracy}% 正確性</Badge>
          <Badge variant="outline">{time}秒</Badge>
        </div>
      )}

      <div className="mb-6 bg-gray-50 p-4 rounded-lg border shadow-sm">
        {isStarted ? (
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

            <input
              ref={inputRef}
              type="text"
              className="opacity-0 absolute"
              autoFocus
              value={typedText}
              onChange={() => {}} // 実際の入力はkeydownイベントで処理
              onKeyDown={handleTyping}
            />
            <p className="text-sm text-gray-500 text-center">
              入力してください（入力欄は非表示になっています）
            </p>
          </>
        ) : (
          <p className="text-center py-8 text-gray-500">
            「練習開始」ボタンをクリックしてタイピング練習を始めてください
          </p>
        )}
      </div>

      <KeyboardDisplay
        layout={getCurrentKeyboard()}
        highlight={keyHighlight}
      />

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">使い方</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>OS、キーボード配列、練習タイプを選択</li>
          <li>「練習開始」ボタンをクリック</li>
          <li>表示されたテキストを入力</li>
          <li>キーボードには次に押すべきキーがハイライト表示されます</li>
          <li>テキストをすべて入力すると練習が終了し、結果が表示されます</li>
        </ol>
      </div>

      {/* 結果表示モーダル */}
      <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
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
            <Button onClick={() => {
              setShowResultModal(false);
              startPractice(); // 新しい練習を開始
            }}>
              もう一度練習する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}