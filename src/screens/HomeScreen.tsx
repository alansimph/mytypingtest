import { LevelCard } from '../components/LevelCard.tsx'
import { MenuButton } from '../components/IconButtons.tsx'
import {
  LEVELS,
  isLevelUnlocked,
  levelProgressLabel,
  lockTextFor,
} from '../models/levels.ts'
import type { LevelId, Progress } from '../types/index.ts'

interface HomeScreenProps {
  progress: Progress
  onOpenLevel: (levelId: LevelId) => void
  onOpenSettings: () => void
}

export function HomeScreen({ progress, onOpenLevel, onOpenSettings }: HomeScreenProps) {
  return (
    <div className="stack">
      <header className="home-header">
        <h1>TypingCapy</h1>
        <MenuButton onClick={onOpenSettings} />
      </header>
      <section className="stack" aria-labelledby="levels-heading">
        <h2 id="levels-heading">Choose a level</h2>
        <ul className="level-list">
          {LEVELS.map((level) => {
            const unlocked = isLevelUnlocked(level.id, progress)
            return (
              <li key={level.id}>
                <LevelCard
                  step={level.step}
                  title={level.title}
                  summary={levelProgressLabel(level.id, progress) ?? level.summary}
                  tone={level.id}
                  unlocked={unlocked}
                  lockText={unlocked ? null : lockTextFor(level.id)}
                  onStart={unlocked ? () => onOpenLevel(level.id) : undefined}
                />
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
