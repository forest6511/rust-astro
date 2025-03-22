// src/components/typing/data/practice-texts.ts
import type { PracticeType } from '@/types/typing.ts'

export const PRACTICE_TEXTS: Record<PracticeType, string[]> = {
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
};