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
  {
    id: 'master',
    step: 4,
    title: 'Master',
    summary: 'Type a long paragraph. Speed earns more stars.',
    opensAfter: 'expert',
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

export function isLevelComplete(levelId: LevelId, progress: Progress): boolean {
  const lessons = lessonsFor(levelId)
  if (lessons.length === 0) return false
  return lessons.every((lesson) => progress.lessons[lesson.id] !== undefined)
}

export function isLevelUnlocked(levelId: LevelId, progress: Progress): boolean {
  const level = getLevel(levelId)
  if (!level) return false
  if (!level.opensAfter) return true
  return isLevelComplete(level.opensAfter, progress)
}

export function nextLevelAfter(levelId: LevelId): Level | undefined {
  const index = LEVELS.findIndex((level) => level.id === levelId)
  if (index < 0) return undefined
  return LEVELS[index + 1]
}

export function levelProgressLabel(levelId: LevelId, progress: Progress): string | null {
  const lessons = lessonsFor(levelId)
  if (lessons.length === 0) return null
  const done = lessons.filter((lesson) => progress.lessons[lesson.id] !== undefined).length
  if (done === 0) return null
  if (done === lessons.length) return `All ${lessons.length} lessons finished`
  return `${done} of ${lessons.length} lessons`
}

export function progressNoun(levelId: LevelId): string {
  if (levelId === 'intermediate') return 'Word'
  if (levelId === 'expert') return 'Sentence'
  if (levelId === 'master') return 'Paragraph'
  return 'Letter'
}

export function lessonCountLabel(levelId: LevelId, count: number): string {
  const unit =
    levelId === 'intermediate' || levelId === 'master'
      ? 'word'
      : levelId === 'expert'
        ? 'sentence'
        : 'key'
  const name = count === 1 ? unit : `${unit}s`
  return `${count} ${name}`
}

export function lockTextFor(levelId: LevelId): string | null {
  const level = getLevel(levelId)
  if (!level?.opensAfter) return null
  const previous = getLevel(level.opensAfter)
  const name = previous?.title ?? 'the earlier level'
  return `Finish ${name} first.`
}
