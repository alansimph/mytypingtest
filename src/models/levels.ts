import { LESSONS } from '../constants/lessons.ts'
import type { Lesson, LevelId, Progress } from '../types/index.ts'

export interface Level {
  id: LevelId
  step: number
  title: string
  summary: string
  opensAfter: LevelId | null
}

export const LEVELS: readonly Level[] = [
  {
    id: 'beginner',
    step: 1,
    title: 'Beginner',
    summary: 'Find one key at a time.',
    opensAfter: null,
  },
  {
    id: 'intermediate',
    step: 2,
    title: 'Intermediate',
    summary: 'Type short words.',
    opensAfter: 'beginner',
  },
  {
    id: 'expert',
    step: 3,
    title: 'Expert',
    summary: 'Type sentences and punctuation.',
    opensAfter: 'intermediate',
  },
]

export function getLevel(levelId: LevelId): Level | undefined {
  return LEVELS.find((level) => level.id === levelId)
}

export function lessonsFor(levelId: LevelId): readonly Lesson[] {
  return LESSONS.filter((lesson) => lesson.levelId === levelId)
}

export function getLesson(lessonId: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === lessonId)
}

export function nextLessonAfter(lessonId: string): Lesson | undefined {
  const current = getLesson(lessonId)
  if (!current) return undefined
  const levelLessons = lessonsFor(current.levelId)
  const index = levelLessons.findIndex((lesson) => lesson.id === lessonId)
  if (index < 0) return undefined
  return levelLessons[index + 1]
}

export function isLevelUnlocked(levelId: LevelId, progress: Progress): boolean {
  const level = getLevel(levelId)
  if (!level) return false
  if (!level.opensAfter) return true

  const required = lessonsFor(level.opensAfter)
  if (required.length === 0) return false

  return required.every((lesson) => progress.completedLessonIds.includes(lesson.id))
}

export function lockTextFor(levelId: LevelId): string | null {
  const level = getLevel(levelId)
  if (!level?.opensAfter) return null
  const previous = getLevel(level.opensAfter)
  const name = previous?.title ?? 'the earlier level'
  return `Finish ${name} first.`
}
