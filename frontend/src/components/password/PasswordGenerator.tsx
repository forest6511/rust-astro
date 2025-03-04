// src/components/password/PasswordGenerator.tsx
import { useState, useEffect } from 'react'
import { Copy, CheckIcon, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'

type PasswordOptions = {
  length: number
  includeLowercase: boolean
  includeUppercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export default function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 8,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: true,
  })

  const [passwords, setPasswords] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<number | null>(null)

  useEffect(() => {
    generatePasswords()
  }, [])

  const generatePasswords = () => {
    try {
      setError(null)

      // 最低1つのオプションが選択されているか確認
      if (
        !options.includeLowercase &&
        !options.includeUppercase &&
        !options.includeNumbers &&
        !options.includeSymbols
      ) {
        setError('少なくとも1つの文字タイプを選択してください')
        return
      }

      const lowercase = 'abcdefghijklmnopqrstuvwxyz'
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const numbers = '0123456789'
      const symbols = '!@#$%^&*()_+[]{}|;:,.<>?'

      let chars = ''
      if (options.includeLowercase) chars += lowercase
      if (options.includeUppercase) chars += uppercase
      if (options.includeNumbers) chars += numbers
      if (options.includeSymbols) chars += symbols

      const generatedPasswords = []
      for (let i = 0; i < 10; i++) {
        let password = ''
        for (let j = 0; j < options.length; j++) {
          const randomIndex = Math.floor(Math.random() * chars.length)
          password += chars[randomIndex]
        }

        // 選択された各文字タイプが少なくとも1文字含まれているか確認
        if (
          (options.includeLowercase && !/[a-z]/.test(password)) ||
          (options.includeUppercase && !/[A-Z]/.test(password)) ||
          (options.includeNumbers && !/\d/.test(password)) ||
          (options.includeSymbols &&
            !/[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(password))
        ) {
          // 条件を満たさない場合は再生成
          i--
          continue
        }

        generatedPasswords.push(password)
      }

      setPasswords(generatedPasswords)
    } catch (e) {
      setError('パスワードの生成中にエラーが発生しました')
    }
  }

  const handleLengthChange = (value: number[]) => {
    setOptions((prev) => ({ ...prev, length: value[0] }))
  }

  const copyToClipboard = (index: number) => {
    if (passwords[index] && navigator.clipboard) {
      navigator.clipboard.writeText(passwords[index])
      setCopied(index)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return { text: '弱い', color: 'text-red-500' }
    if (password.length < 12) return { text: '普通', color: 'text-yellow-500' }
    if (password.length < 16) return { text: '強い', color: 'text-green-500' }
    return { text: '非常に強い', color: 'text-emerald-600' }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-2">
            パスワードの長さ: {options.length}文字
          </label>
          <Slider
            value={[options.length]}
            min={4}
            max={32}
            step={1}
            onValueChange={handleLengthChange}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>4</span>
            <span>12</span>
            <span>24</span>
            <span>32</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium">含める文字:</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={options.includeLowercase}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({
                    ...prev,
                    includeLowercase: checked === true,
                  }))
                }
              />
              <label
                htmlFor="lowercase"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                小文字 (a-z)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={options.includeUppercase}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({
                    ...prev,
                    includeUppercase: checked === true,
                  }))
                }
              />
              <label
                htmlFor="uppercase"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                大文字 (A-Z)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={options.includeNumbers}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({
                    ...prev,
                    includeNumbers: checked === true,
                  }))
                }
              />
              <label
                htmlFor="numbers"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                数字 (0-9)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={options.includeSymbols}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({
                    ...prev,
                    includeSymbols: checked === true,
                  }))
                }
              />
              <label
                htmlFor="symbols"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                記号 (!@#$%^&*...)
              </label>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={generatePasswords}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        パスワードを生成
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3 mt-6">
        <h3 className="font-medium">生成されたパスワード:</h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {passwords.map((password, index) => {
            const strength = getPasswordStrength(password)
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
              >
                <div>
                  <p className="font-mono text-base">{password}</p>
                  <p className={`text-xs ${strength.color}`}>
                    強度: {strength.text}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(index)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {copied === index ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
