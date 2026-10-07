import { useEffect, useState } from 'react'
import { HomeScreen } from './screens/HomeScreen.tsx'
import { LessonCompleteScreen } from './screens/LessonCompleteScreen.tsx'
import { LessonScreen } from './screens/LessonScreen.tsx'
import { PlayScreen } from './screens/PlayScreen.tsx'
import { SettingsScreen } from './screens/SettingsScreen.tsx'
import type { AppView } from './navigation/types.ts'
import { getLesson, getLevel, nextLessonAfter } from './models/levels.ts'
import { useSettings } from './hooks/useSettings.ts'
import { loadProgress } from './services/storage.ts'

export function App() {
  const [view, setView] = useState<AppView>({ name: 'home' })
  const [progress] = useState(loadProgress)
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

  return (
    <main className="app">
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
          onComplete={(stars) =>
            setView({
              name: 'lesson-complete',
              levelId: view.levelId,
              result: { lessonId: view.lessonId, stars },
            })
          }
        />
      ) : null}
      {view.name === 'lesson-complete' ? (
        <LessonCompleteScreen
          stars={view.result.stars}
          lessonTitle={getLesson(view.result.lessonId)?.title ?? 'Lesson'}
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
