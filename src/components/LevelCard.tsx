import type { LevelId } from '../types/index.ts'

interface LevelCardProps {
  step: number
  title: string
  summary: string
  tone: LevelId
  unlocked: boolean
  lockText: string | null
  onStart?: () => void
}

export function LevelCard({
  step,
  title,
  summary,
  tone,
  unlocked,
  lockText,
  onStart,
}: LevelCardProps) {
  const className = unlocked
    ? `level-card level-card--${tone}`
    : `level-card level-card--locked level-card--${tone}`

  const body = (
    <>
      <span className="level-card__badge">{step}</span>
      <span className="level-card__title">{title}</span>
      <span className="level-card__summary">{summary}</span>
      <span className="level-card__action">{unlocked ? 'Start' : 'Locked'}</span>
      {lockText ? <span className="level-card__lock">{lockText}</span> : null}
    </>
  )

  if (!unlocked) {
    return <article className={className}>{body}</article>
  }

  return (
    <button type="button" className={className} onClick={onStart}>
      {body}
    </button>
  )
}
