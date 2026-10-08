export type LevelId = 'beginner' | 'intermediate' | 'expert' | 'master'

export type StarCount = 1 | 2 | 3

export interface Lesson {
  id: string
  levelId: LevelId
  title: string
  prompts: readonly string[]
  /** When true, capitals must be typed with Shift. Beginner letters ignore case. */
  matchCase: boolean
}

export interface LessonRecord {
  stars: StarCount
}

export interface Progress {
  lessons: Record<string, LessonRecord>
}

export interface Settings {
  soundEnabled: boolean
}
