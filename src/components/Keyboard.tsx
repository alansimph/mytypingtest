import { KEYBOARD_ROWS } from '../constants/keyboard.ts'

interface KeyboardProps {
  target: string
  disabled?: boolean
  onKey: (letter: string) => void
}

const rowClass = ['keyboard__row keyboard__row--top', 'keyboard__row keyboard__row--home', 'keyboard__row keyboard__row--bottom']

export function Keyboard({ target, disabled = false, onKey }: KeyboardProps) {
  const normalizedTarget = target.toLowerCase()

  return (
    <div className="keyboard" role="group" aria-label="Keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={row.join('')} className={rowClass[rowIndex] ?? 'keyboard__row'}>
          {row.map((letter) => {
            const isTarget = letter.toLowerCase() === normalizedTarget
            return (
              <button
                key={letter}
                type="button"
                className={isTarget ? 'keycap keycap--target' : 'keycap'}
                aria-current={isTarget ? 'true' : undefined}
                aria-label={isTarget ? `Key ${letter}, press this key` : `Key ${letter}`}
                disabled={disabled}
                onClick={() => onKey(letter)}
              >
                {letter}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
