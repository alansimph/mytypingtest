export const KEYBOARD_ROWS: readonly (readonly string[])[] = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

export const PUNCTUATION_KEYS = ['.', ',', '?', "'"] as const

export function keyName(char: string): string {
  if (char === '.') return 'Period'
  if (char === ',') return 'Comma'
  if (char === '?') return 'Question mark'
  if (char === "'") return 'Apostrophe'
  if (char === ' ') return 'Space'
  return `Key ${char}`
}
