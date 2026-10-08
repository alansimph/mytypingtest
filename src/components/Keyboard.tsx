import { fingerFor } from '../constants/fingers.ts'
import { KEYBOARD_ROWS, PUNCTUATION_KEYS, keyName } from '../constants/keyboard.ts'

interface KeyboardProps {
  target: string
  showShift?: boolean
  showExtras?: boolean
  disabled?: boolean
  onKey: (letter: string) => void
  onShift?: () => void
}

const rowClass = [
  'keyboard__row keyboard__row--top',
  'keyboard__row keyboard__row--home',
  'keyboard__row keyboard__row--bottom',
]

function isLetter(char: string): boolean {
  return char.toLowerCase() !== char.toUpperCase()
}

function keycapClass(char: string, isTarget: boolean, extra?: string): string {
  const finger = fingerFor(char)
  const classes = ['keycap']
  if (finger) classes.push(`keycap--${finger.id}`)
  if (extra) classes.push(extra)
  if (isTarget) classes.push('keycap--target')
  return classes.join(' ')
}

function keyLabel(char: string, isTarget: boolean, shift: boolean): string {
  const name = keyName(char)
  const finger = fingerFor(char)?.label
  const parts = [name]
  if (finger) parts.push(finger)
  if (isTarget && shift) parts.push('hold Shift and press this key')
  else if (isTarget) parts.push('press this key')
  return parts.join(', ')
}

export function Keyboard({
  target,
  showShift = false,
  showExtras = false,
  disabled = false,
  onKey,
  onShift,
}: KeyboardProps) {
  return (
    <div className="keyboard" role="group" aria-label="Keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={row.join('')} className={rowClass[rowIndex] ?? 'keyboard__row'}>
          {row.map((letter) => {
            const isTarget = isLetter(target) && letter.toLowerCase() === target.toLowerCase()
            return (
              <button
                key={letter}
                type="button"
                className={keycapClass(letter, isTarget)}
                aria-current={isTarget ? 'true' : undefined}
                aria-label={keyLabel(letter, isTarget, showShift && isTarget)}
                disabled={disabled}
                onClick={() => onKey(isTarget ? target : letter)}
              >
                {letter}
              </button>
            )
          })}
        </div>
      ))}
      {showExtras ? (
        <div className="keyboard__row keyboard__row--extra">
          <button
            type="button"
            className={showShift ? 'keycap keycap--wide keycap--target' : 'keycap keycap--wide'}
            aria-current={showShift ? 'true' : undefined}
            aria-label={showShift ? 'Shift, hold this key' : 'Shift'}
            disabled={disabled}
            onClick={onShift}
          >
            Shift
          </button>
          <button
            type="button"
            className={keycapClass(' ', target === ' ', 'keycap--space')}
            aria-current={target === ' ' ? 'true' : undefined}
            aria-label={keyLabel(' ', target === ' ', false)}
            disabled={disabled}
            onClick={() => onKey(' ')}
          >
            Space
          </button>
          {PUNCTUATION_KEYS.map((mark) => {
            const isTarget = target === mark
            return (
              <button
                key={mark}
                type="button"
                className={keycapClass(mark, isTarget)}
                aria-current={isTarget ? 'true' : undefined}
                aria-label={keyLabel(mark, isTarget, showShift && isTarget)}
                disabled={disabled}
                onClick={() => onKey(mark)}
              >
                {mark}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
