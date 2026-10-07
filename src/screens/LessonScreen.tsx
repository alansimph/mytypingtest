import { EmptyState } from '../components/EmptyState.tsx'
import { ErrorMessage } from '../components/ErrorMessage.tsx'
import { ScreenHeader } from '../components/ScreenHeader.tsx'
import {
  getLevel,
  isLevelUnlocked,
  lessonsFor,
  lockTextFor,
} from '../models/levels.ts'
import type { LevelId, Progress } from '../types/index.ts'

const comingSoon: Record<LevelId, string> = {
  beginner: 'Beginner will ask you to press one key at a time.',
  intermediate: 'Intermediate will ask you to type short words.',
  expert: 'Expert will ask you to type sentences and punctuation.',
}

interface LessonScreenProps {
  levelId: LevelId
  progress: Progress
  onHome: () => void
  onPlay: (lessonId: string) => void
}

export function LessonScreen({
  levelId,
  progress,
  onHome,
  onPlay,
}: LessonScreenProps) {
  const level = getLevel(levelId)

  if (!level) {
    return (
      <div className="stack">
        <ScreenHeader title="Lesson" onBack={onHome} backLabel="Home" />
        <ErrorMessage message="That level is not in the game." />
      </div>
    )
  }

  if (!isLevelUnlocked(level.id, progress)) {
    return (
      <div className="stack">
        <ScreenHeader title={level.title} onBack={onHome} backLabel="Home" />
        <EmptyState
          title="Locked"
          message={lockTextFor(level.id) ?? 'Finish the earlier level first.'}
        />
      </div>
    )
  }

  const lessons = lessonsFor(level.id)
  if (lessons.length === 0) {
    return (
      <div className="stack">
        <ScreenHeader title={level.title} onBack={onHome} backLabel="Home" />
        <EmptyState title="Not ready yet" message={comingSoon[level.id]} />
      </div>
    )
  }

  return (
    <div className="stack">
      <ScreenHeader title={level.title} onBack={onHome} backLabel="Home" />
      <p className="note">Press one key at a time. The glowing key is the one to find.</p>
      <ul className="lesson-list">
        {lessons.map((lesson, index) => (
          <li key={lesson.id}>
            <button type="button" className="lesson-row" onClick={() => onPlay(lesson.id)}>
              <span className="lesson-row__index">{index + 1}</span>
              <span className="lesson-row__copy">
                <span className="lesson-row__title">{lesson.title}</span>
                <span className="lesson-row__meta">{lesson.prompts.length} keys</span>
              </span>
              <span className="lesson-row__action">Start</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
