import { Button } from '../components/Button.tsx'
import { ScreenHeader } from '../components/ScreenHeader.tsx'
import { StarRow } from '../components/StarRow.tsx'
import type { StarCount } from '../services/lessonEngine.ts'

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

interface LessonCompleteScreenProps {
  stars: StarCount
  lessonTitle: string
  onBack: () => void
  onAgain: () => void
  onNext: (() => void) | null
}

export function LessonCompleteScreen({
  stars,
  lessonTitle,
  onBack,
  onAgain,
  onNext,
}: LessonCompleteScreenProps) {
  const cheer = cheers[stars]
  const starLabel = stars === 1 ? '1 star' : `${stars} stars`

  return (
    <div className="stack">
      <ScreenHeader title="Stars" onBack={onBack} backLabel="Lessons" />
      <section className="panel reward" aria-labelledby="reward-heading">
        <StarRow filled={stars} />
        <p className="reward__score">{starLabel}</p>
        <h2 id="reward-heading">{cheer.title}</h2>
        <p>{cheer.detail}</p>
        <p className="note">{lessonTitle}</p>
        <div className="reward__actions">
          <Button onClick={onNext ?? onBack}>{onNext ? 'Next lesson' : 'All lessons'}</Button>
          <Button variant="secondary" onClick={onAgain}>
            Try again
          </Button>
        </div>
      </section>
    </div>
  )
}
