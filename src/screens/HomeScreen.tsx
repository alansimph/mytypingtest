import { LevelCard } from '../components/LevelCard.tsx'
import { Button } from '../components/Button.tsx'
import {
  LEVELS,
  isLevelUnlocked,
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
        <div>
          <h1>myTypingTest</h1>
          <p className="lede">Learn the keyboard, one step at a time.</p>
        </div>
        <Button variant="secondary" onClick={onOpenSettings}>
          Settings
        </Button>
      </header>
      <p className="note">A laptop or desktop keyboard works best.</p>
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
                  summary={level.summary}
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
