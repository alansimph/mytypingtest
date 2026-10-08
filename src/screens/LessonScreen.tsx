import { EmptyState } from '../components/EmptyState.tsx'
import { ErrorMessage } from '../components/ErrorMessage.tsx'
import { MenuButton } from '../components/IconButtons.tsx'
import { ScreenHeader } from '../components/ScreenHeader.tsx'
import { StarRow } from '../components/StarRow.tsx'
import {
  getLevel,
  isLevelUnlocked,
  lessonCountLabel,
  lessonsFor,
  lockTextFor,
} from '../models/levels.ts'
import { promptWordCount, starLabel } from '../services/lessonEngine.ts'
import type { LevelId, Progress } from '../types/index.ts'

const comingSoon: Record<LevelId, string> = {
  beginner: 'Beginner will ask you to press one key at a time.',
  intermediate: 'Intermediate will ask you to type short words.',
  expert: 'Expert will ask you to type sentences and punctuation.',
  master: 'Master will ask you to type a long paragraph.',
}

interface LessonScreenProps {
  levelId: LevelId
  progress: Progress
  onHome: () => void
  onPlay: (lessonId: string) => void
  onOpenSettings: () => void
}

export function LessonScreen({
  levelId,
  progress,
  onHome,
  onPlay,
  onOpenSettings,
}: LessonScreenProps) {
  const level = getLevel(levelId)

  if (!level) {
    return (
      <div className="stack">
        <ScreenHeader
          title="Lesson"
          onBack={onHome}
          homeIcon
          titleInRow
          action={<MenuButton onClick={onOpenSettings} />}
        />
        <ErrorMessage message="That level is not in the game." />
      </div>
    )
  }

  if (!isLevelUnlocked(level.id, progress)) {
    return (
      <div className="stack">
        <ScreenHeader
          title={level.title}
          onBack={onHome}
          homeIcon
          titleInRow
          action={<MenuButton onClick={onOpenSettings} />}
        />
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
        <ScreenHeader
          title={level.title}
          onBack={onHome}
          homeIcon
          titleInRow
          action={<MenuButton onClick={onOpenSettings} />}
        />
        <EmptyState title="Not ready yet" message={comingSoon[level.id]} />
      </div>
    )
  }

  return (
    <div className="stack">
      <ScreenHeader
        title={level.title}
        onBack={onHome}
        homeIcon
        titleInRow
        action={<MenuButton onClick={onOpenSettings} />}
      />
      <p className="note">
        {level.id === 'beginner'
          ? 'Press one key at a time. The glowing key is the one to find.'
          : level.id === 'intermediate'
            ? 'Type each word. The glowing key is the next letter.'
            : level.id === 'master'
              ? 'Type the whole paragraph. 40 words a minute earns 2 stars. 60 earns 3.'
              : 'Type each sentence. The glowing key is the next one.'}
      </p>
      <ul className="lesson-list">
        {lessons.map((lesson, index) => {
          const stars = progress.lessons[lesson.id]?.stars
          const count =
            lesson.levelId === 'master' ? promptWordCount(lesson.prompts) : lesson.prompts.length
          const size = lessonCountLabel(lesson.levelId, count)
          return (
            <li key={lesson.id}>
              <button type="button" className="lesson-row" onClick={() => onPlay(lesson.id)}>
                <span className="lesson-row__index">{index + 1}</span>
                <span className="lesson-row__copy">
                  <span className="lesson-row__title">{lesson.title}</span>
                  <span className="lesson-row__meta">
                    <span>{size}</span>
                    {stars ? (
                      <span className="lesson-row__stars">
                        <StarRow filled={stars} compact />
                        <span className="visually-hidden">{starLabel(stars)}</span>
                      </span>
                    ) : null}
                  </span>
                </span>
                <span className="lesson-row__action">{stars ? 'Again' : 'Start'}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
