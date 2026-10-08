import type { StarCount } from '../services/lessonEngine.ts'
import type { LevelId } from '../types/index.ts'

/**
 * Home → Lesson list → Play → Stars
 * Home → Settings
 */
export interface LessonResult {
  lessonId: string
  stars: StarCount
  seconds: number
  wordsPerMinute: number | null
}

export type AppView =
  | { name: 'home' }
  | { name: 'lesson'; levelId: LevelId }
  | { name: 'play'; levelId: LevelId; lessonId: string }
  | { name: 'lesson-complete'; levelId: LevelId; result: LessonResult }
  | { name: 'settings' }
