import { useEffect, useRef } from 'react'
import { Button } from '../components/Button.tsx'
import { MenuButton } from '../components/IconButtons.tsx'
import { ScreenHeader } from '../components/ScreenHeader.tsx'
import { StarCelebration } from '../components/StarCelebration.tsx'
import { StarRow } from '../components/StarRow.tsx'
import { durationLabel, speedLabel, starLabel, type StarCount } from '../services/lessonEngine.ts'
import { playCelebration } from '../services/sounds.ts'

const cheers: Record<StarCount, { title: string; detail: string }> = {
  3: {
    title: 'You found every key!',
    detail: 'Every press was right.',
  },
  2: {
    title: 'Nice work!',
    detail: 'You found most of the keys.',
  },
  1: {
    title: 'You finished the lesson!',
    detail: 'Play it again to earn more stars.',
  },
}

const speedCheers: Record<StarCount, { title: string; detail: string }> = {
  3: {
    title: 'So fast!',
    detail: 'That was 60 words a minute or more.',
  },
  2: {
    title: 'Nice speed!',
    detail: 'That was 40 words a minute or more.',
  },
  1: {
    title: 'You finished the paragraph!',
    detail: 'Play it again and type a little faster for more stars.',
  },
}

interface LessonCompleteScreenProps {
  stars: StarCount
  seconds: number
  wordsPerMinute: number | null
  bestStars: StarCount
  lessonTitle: string
  soundEnabled: boolean
  unlockedLevelTitle: string | null
  onBack: () => void
  onOpenSettings: () => void
  onAgain: () => void
  onNext: (() => void) | null
  onOpenUnlockedLevel: (() => void) | null
}

export function LessonCompleteScreen({
  stars,
  seconds,
  wordsPerMinute,
  bestStars,
  lessonTitle,
  soundEnabled,
  unlockedLevelTitle,
  onBack,
  onOpenSettings,
  onAgain,
  onNext,
  onOpenUnlockedLevel,
}: LessonCompleteScreenProps) {
  const cheer = wordsPerMinute === null ? cheers[stars] : speedCheers[stars]
  const headingRef = useRef<HTMLHeadingElement>(null)
  const primaryLabel = onNext
    ? 'Next lesson'
    : onOpenUnlockedLevel
      ? `Open ${unlockedLevelTitle ?? 'the next level'}`
      : 'All lessons'
  const onPrimary = onNext ?? onOpenUnlockedLevel ?? onBack

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!soundEnabled) return
    const id = window.setTimeout(() => playCelebration(stars), 0)
    return () => window.clearTimeout(id)
  }, [soundEnabled, stars])

  return (
    <div className="stack">
      <ScreenHeader
        title="Stars"
        onBack={onBack}
        backLabel="Lessons"
        lessonsIcon
        action={<MenuButton onClick={onOpenSettings} />}
      />
      <section className="panel reward" aria-labelledby="reward-heading">
        <div className="reward__stars">
          <StarCelebration stars={stars} />
          <StarRow filled={stars} celebrate />
        </div>
        <p className="reward__score">{starLabel(stars)}</p>
        <h2 id="reward-heading" ref={headingRef} tabIndex={-1}>
          {cheer.title}
        </h2>
        <p>{cheer.detail}</p>
        <p className="reward__time">{durationLabel(seconds)}</p>
        {wordsPerMinute === null ? null : (
          <p className="reward__time">{speedLabel(wordsPerMinute)}</p>
        )}
        {bestStars > stars ? <p>Your best is {starLabel(bestStars)}.</p> : null}
        <p className="note">{lessonTitle}</p>
        {unlockedLevelTitle ? (
          <p className="reward__unlock">{unlockedLevelTitle} is open.</p>
        ) : null}
        <div className="reward__actions">
          <Button onClick={onPrimary}>{primaryLabel}</Button>
          <Button variant="secondary" onClick={onAgain}>
            Try again
          </Button>
        </div>
      </section>
    </div>
  )
}
