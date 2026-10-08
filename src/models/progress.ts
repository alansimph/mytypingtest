import type { Progress, StarCount } from '../types/index.ts'

export function emptyProgress(): Progress {
  return { lessons: {} }
}

function starCount(value: unknown): StarCount | null {
  return value === 1 || value === 2 || value === 3 ? value : null
}

/**
 * Reads a saved progress object. A bad lesson record is skipped so one
 * broken entry does not throw away the rest of the stars.
 */
export function progressFromStored(value: unknown): Progress | null {
  if (typeof value !== 'object' || value === null || !('lessons' in value)) return null
  const lessons = value.lessons
  if (typeof lessons !== 'object' || lessons === null || Array.isArray(lessons)) return null
  const kept: Progress['lessons'] = {}
  for (const [id, record] of Object.entries(lessons)) {
    if (!id || typeof record !== 'object' || record === null || !('stars' in record)) continue
    const stars = starCount(record.stars)
    if (stars === null) continue
    kept[id] = { stars }
  }
  return { lessons: kept }
}

export function withLessonResult(
  progress: Progress,
  lessonId: string,
  stars: StarCount,
): Progress {
  const previous = progress.lessons[lessonId]?.stars
  if (previous !== undefined && previous >= stars) return progress
  return {
    lessons: {
      ...progress.lessons,
      [lessonId]: { stars },
    },
  }
}
