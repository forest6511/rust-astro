// src/components/todo/TodoList.tsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2Icon, PlusIcon, CalendarIcon, TagIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Todo {
  id: string
  text: string
  completed: boolean
  dueDate: string | null
  category: string | null
}

// カテゴリのオプション
const categoryOptions = [
  { id: 'work', label: '仕事' },
  { id: 'personal', label: '個人' },
  { id: 'shopping', label: '買い物' },
  { id: 'study', label: '勉強' },
  { id: 'other', label: 'その他' },
]

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState<string | null>('none') // "none"を初期値に設定
  const [error, setError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false) // 詳細設定の表示切替

  // ローカルストレージからTODOを読み込む
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('todos')
      if (savedTodos) {
        try {
          setTodos(JSON.parse(savedTodos))
        } catch (e) {
          console.error('JSON解析エラー:', e)
          setError('保存されたTODOの読み込みに失敗しました')
        }
      }
    } catch (storageError) {
      console.error('ストレージアクセスエラー:', storageError)
      setError(
        'ローカルストレージにアクセスできません。プライベートブラウジングモードを使用しているか、Cookieが無効になっている可能性があります。'
      )
    }
  }, [])

  // TODOの変更をローカルストレージに保存
  useEffect(() => {
    try {
      if (todos.length > 0) {
        localStorage.setItem('todos', JSON.stringify(todos))
      }
    } catch (storageError) {
      console.error('ストレージ保存エラー:', storageError)
    }
  }, [todos])

  const addTodo = () => {
    if (!newTodo.trim()) {
      setError('タスクを入力してください')
      return
    }

    const newItem: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      dueDate: dueDate || null,
      category: category === 'none' ? null : category, // "none"の場合はnullに変換
    }

    setTodos([...todos, newItem])

    // 入力フォームのリセット
    setNewTodo('')
    setDueDate('')
    setCategory('none')
    setError(null)
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addTodo()
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (e) {
      return dateString
    }
  }

  const getCategoryLabel = (categoryId: string | null) => {
    if (!categoryId) return null
    return (
      categoryOptions.find((cat) => cat.id === categoryId)?.label || categoryId
    )
  }

  // 日付が過ぎているかチェック
  const isOverdue = (dateString: string | null) => {
    if (!dateString) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dueDate = new Date(dateString)
    dueDate.setHours(0, 0, 0, 0)

    return dueDate < today
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label htmlFor="todo-input" className="block text-sm font-medium mb-2">
          新しいタスク:
        </label>
        <div className="flex gap-2">
          <Input
            id="todo-input"
            value={newTodo}
            onChange={(e) => {
              setNewTodo(e.target.value)
              setError(null)
            }}
            onKeyPress={handleKeyPress}
            placeholder="タスクを入力してください"
            className="flex-1"
          />
          <Button onClick={addTodo} className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-1" /> 追加
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-gray-500 mt-2 text-sm"
        >
          {showAdvanced ? '詳細設定を隠す ▲' : '詳細設定を表示 ▼'}
        </Button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 border rounded-md bg-gray-50">
            <div>
              <label
                htmlFor="due-date"
                className="block text-sm font-medium mb-2"
              >
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                期限:
              </label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-2"
              >
                <TagIcon className="h-4 w-4 inline mr-1" />
                カテゴリ:
              </label>
              <Select value={category || 'none'} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">なし</SelectItem>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-md p-4">
        <h2 className="text-lg font-medium mb-4">タスク一覧</h2>

        {todos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">タスクがありません</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    id={`todo-${todo.id}`}
                  />
                  <div>
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`${todo.completed ? 'line-through text-gray-500' : ''}`}
                    >
                      {todo.text}
                    </label>

                    {(todo.dueDate || todo.category) && (
                      <div className="flex gap-2 text-xs mt-1">
                        {todo.dueDate && (
                          <span
                            className={`inline-flex items-center ${isOverdue(todo.dueDate) && !todo.completed ? 'text-red-500' : 'text-gray-500'}`}
                          >
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {formatDate(todo.dueDate)}
                          </span>
                        )}

                        {todo.category && (
                          <span className="inline-flex items-center text-gray-500">
                            <TagIcon className="h-3 w-3 mr-1" />
                            {getCategoryLabel(todo.category)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
