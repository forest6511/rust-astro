// src/components/json/JsonFormatter.tsx
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CopyIcon, CheckIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// インデントオプションの定義
type IndentOption = {
  id: string
  label: string
  value: string | null
  spaces: number | null
}

const indentOptions: IndentOption[] = [
  { id: 'tab', label: 'TAB', value: '\t', spaces: null },
  { id: 'space2', label: '半角空白 2個', value: '  ', spaces: 2 },
  { id: 'space4', label: '半角空白 4個', value: '    ', spaces: 4 },
  { id: 'space6', label: '半角空白 6個', value: '      ', spaces: 6 },
  { id: 'space8', label: '半角空白 8個', value: '        ', spaces: 8 },
  { id: 'fullspace2', label: '全角空白 2個', value: '　　', spaces: null },
  { id: 'underscore4', label: 'アンダーバー 4個', value: '____', spaces: null },
  { id: 'noindent', label: '改行・ｲﾝﾃﾞﾝﾄなし', value: '', spaces: 0 },
  { id: 'compact', label: '改行・ｲﾝﾃﾞﾝﾄ・空白なし', value: null, spaces: null },
]

// タブサイズオプションの定義
const tabSizeOptions = [2, 4, 6, 8]

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [indentType, setIndentType] = useState<string>('space2')
  const [tabSize, setTabSize] = useState<number>(4)
  const outputRef = useRef<HTMLPreElement>(null)

  const formatJson = () => {
    if (!input.trim()) {
      setError('JSONデータを入力してください')
      setOutput('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      let formatted: string

      const selectedIndent = indentOptions.find((opt) => opt.id === indentType)

      if (selectedIndent?.id === 'compact') {
        // 改行・インデント・空白なし
        formatted = JSON.stringify(parsed)
      } else if (selectedIndent?.id === 'noindent') {
        // 改行あり、インデントなし
        formatted = JSON.stringify(parsed, null, '')
      } else {
        // 通常の整形（インデント付き）
        formatted = JSON.stringify(parsed, null, selectedIndent?.value || 2)
      }

      setOutput(formatted)
      setError(null)
    } catch (e) {
      if (e instanceof Error) {
        setError(`JSONの形式が正しくありません: ${e.message}`)
      } else {
        setError('JSONの形式が正しくありません')
      }
      setOutput('')
    }
  }

  const handleMinify = () => {
    if (!input.trim()) {
      setError('JSONデータを入力してください')
      setOutput('')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError(null)
    } catch (e) {
      if (e instanceof Error) {
        setError(`JSONの形式が正しくありません: ${e.message}`)
      } else {
        setError('JSONの形式が正しくありません')
      }
      setOutput('')
    }
  }

  const copyToClipboard = () => {
    if (output && navigator.clipboard) {
      navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    setError(null)
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label htmlFor="json-input" className="block text-sm font-medium mb-2">
          JSONデータを入力:
        </label>
        <Textarea
          id="json-input"
          value={input}
          onChange={handleInputChange}
          placeholder='{"example": "ここにJSONを入力してください", "array": [1, 2, 3]}'
          className="min-h-[200px] font-mono text-sm"
        />
      </div>

      {/* 整形オプション */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-2">
            インデントと改行の設定:
          </label>
          <Select
            value={indentType}
            onValueChange={(value) => setIndentType(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="インデントタイプを選択" />
            </SelectTrigger>
            <SelectContent>
              {indentOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            タブ文字の表示サイズ:
          </label>
          <Select
            value={tabSize.toString()}
            onValueChange={(value) => setTabSize(Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="タブサイズを選択" />
            </SelectTrigger>
            <SelectContent>
              {tabSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}文字
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={formatJson} className="bg-blue-600 hover:bg-blue-700">
          整形する
        </Button>
        <Button onClick={handleMinify} variant="outline">
          圧縮する
        </Button>
        {input && (
          <Button
            onClick={() => setInput('')}
            variant="outline"
            className="ml-auto"
          >
            クリア
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {output && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">整形結果:</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="text-gray-500 hover:text-gray-700"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4 mr-1" /> コピーしました
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4 mr-1" /> コピー
                </>
              )}
            </Button>
          </div>
          <div className="border rounded-md bg-gray-50 p-4 overflow-auto max-h-[400px]">
            <pre
              ref={outputRef}
              className="text-sm font-mono whitespace-pre"
              style={{ tabSize: tabSize }}
            >
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
