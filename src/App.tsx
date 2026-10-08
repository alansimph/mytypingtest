import { useEffect, useState } from 'react'
import { HomeScreen } from './screens/HomeScreen.tsx'
import { LessonCompleteScreen } from './screens/LessonCompleteScreen.tsx'
import { LessonScreen } from './screens/LessonScreen.tsx'
import { PlayScreen } from './screens/PlayScreen.tsx'
import { SettingsScreen } from './screens/SettingsScreen.tsx'
import type { AppView } from './navigation/types.ts'
import {
  getLesson,
  getLevel,
  isLevelComplete,
  nextLessonAfter,
  nextLevelAfter,
} from './models/levels.ts'
import { withLessonResult } from './models/progress.ts'
import { useSettings } from './hooks/useSettings.ts'
import { loadProgress, saveProgress } from './services/storage.ts'
import type { LevelId, Progress } from './types/index.ts'

function unlockedLevelTitle(levelId: LevelId, progress: Progress): string | null {
  if (!isLevelComplete(levelId, progress)) return null
  return nextLevelAfter(levelId)?.title ?? null
}

export function App() {
  const [view, setView] = useState<AppView>({ name: 'home' })
  const [progress, setProgress] = useState(loadProgress)
  const { settings, setSoundEnabled } = useSettings()

  useEffect(() => {
    if (view.name === 'home') {
      document.title = 'myTypingTest'
      return
    }
    if (view.name === 'settings') {
      document.title = 'Settings · myTypingTest'
      return
    }
    if (view.name === 'lesson-complete') {
      document.title = 'Stars · myTypingTest'
      return
    }
    if (view.name === 'play') {
      const lesson = getLesson(view.lessonId)
      document.title = `${lesson?.title ?? 'Lesson'} · myTypingTest`
      return
    }
    const level = getLevel(view.levelId)
    document.title = `${level?.title ?? 'Lesson'} · myTypingTest`
  }, [view])

  const wideLesson = view.name === 'play' && getLesson(view.lessonId)?.levelId === 'master'

  return (
    <main className={wideLesson ? 'app app--wide' : 'app'}>
      {view.name === 'home' ? (
        <HomeScreen
          progress={progress}
          onOpenLevel={(levelId) => setView({ name: 'lesson', levelId })}
          onOpenSettings={() => setView({ name: 'settings' })}
        />
      ) : null}
      {view.name === 'lesson' ? (
        <LessonScreen
          levelId={view.levelId}
          progress={progress}
          onHome={() => setView({ name: 'home' })}
          onPlay={(lessonId) => setView({ name: 'play', levelId: view.levelId, lessonId })}
        />
      ) : null}
      {view.name === 'play' ? (
        <PlayScreen
          lessonId={view.lessonId}
          soundEnabled={settings.soundEnabled}
          onBack={() => setView({ name: 'lesson', levelId: view.levelId })}
          onComplete={(stars, seconds, wordsPerMinute) => {
            const lessonId = view.lessonId
            setProgress((current) => {
              const next = withLessonResult(current, lessonId, stars)
              if (next !== current) saveProgress(next)
              return next
            })
            setView({
              name: 'lesson-complete',
              levelId: view.levelId,
              result: { lessonId, stars, seconds, wordsPerMinute },
            })
          }}
        />
      ) : null}
      {view.name === 'lesson-complete' ? (
        <LessonCompleteScreen
          stars={view.result.stars}
          seconds={view.result.seconds}
          wordsPerMinute={view.result.wordsPerMinute}
          bestStars={progress.lessons[view.result.lessonId]?.stars ?? view.result.stars}
          soundEnabled={settings.soundEnabled}
          lessonTitle={getLesson(view.result.lessonId)?.title ?? 'Lesson'}
          unlockedLevelTitle={unlockedLevelTitle(view.levelId, progress)}
          onBack={() => setView({ name: 'lesson', levelId: view.levelId })}
          onAgain={() =>
            setView({ name: 'play', levelId: view.levelId, lessonId: view.result.lessonId })
          }
          onNext={
            nextLessonAfter(view.result.lessonId)
              ? () => {
                  const next = nextLessonAfter(view.result.lessonId)
                  if (!next) return
                  setView({ name: 'play', levelId: view.levelId, lessonId: next.id })
                }
              : null
          }
          onOpenUnlockedLevel={
            nextLessonAfter(view.result.lessonId) || !unlockedLevelTitle(view.levelId, progress)
              ? null
              : () => {
                  const nextLevel = nextLevelAfter(view.levelId)
                  if (!nextLevel) return
                  setView({ name: 'lesson', levelId: nextLevel.id })
                }
          }
        />
      ) : null}
      {view.name === 'settings' ? (
        <SettingsScreen
          soundEnabled={settings.soundEnabled}
          onSoundEnabled={setSoundEnabled}
          onHome={() => setView({ name: 'home' })}
        />
      ) : null}
    </main>
  )
}
