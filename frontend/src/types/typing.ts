// src/components/typing/typing.ts
export type OSType = 'WINDOWS' | 'MAC'
export type KeyboardType = 'US' | 'JP'
export type PracticeType =
  | 'HOME_ROW'
  | 'TOP_ROW'
  | 'BOTTOM_ROW'
  | 'MIXED'
  | 'NUMBERS'
  | 'SYMBOLS'
  | 'JAPANESE_MIXED'
  | 'PROGRAMMING'
  | 'PUNCTUATION'

export interface TypingResult {
  wpm: number
  accuracy: number
  time: number
}
