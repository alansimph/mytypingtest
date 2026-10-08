import { fingerFor } from '../constants/fingers.ts'

interface FingerHintProps {
  char: string
}

export function FingerHint({ char }: FingerHintProps) {
  const finger = fingerFor(char)
  if (!finger) return null

  return (
    <p className="finger-hint">
      <span className={`finger-hint__dot finger-hint__dot--${finger.id}`} aria-hidden="true" />
      {finger.label}
    </p>
  )
}
