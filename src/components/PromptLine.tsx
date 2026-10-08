interface PromptLineProps {
  text: string
  charIndex: number
}

export function PromptLine({ text, charIndex }: PromptLineProps) {
  return (
    <p className="prompt-line" aria-hidden="true">
      {[...text].map((char, index) => {
        const state = index < charIndex ? 'done' : index === charIndex ? 'now' : 'wait'
        const space = char === ' ' ? ' prompt-char--space' : ''
        return (
          <span key={`${char}-${index}`} className={`prompt-char prompt-char--${state}${space}`}>
            {char === ' ' ? '\u00a0' : char}
          </span>
        )
      })}
    </p>
  )
}
