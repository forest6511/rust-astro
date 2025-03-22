// src/components/typing/data/keyboard-layouts.ts

import type { KeyboardType, OSType } from '@/types/typing.ts'

export const KEYBOARD_LAYOUTS: Record<KeyboardType, Record<OSType, string[][]>> = {
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
};