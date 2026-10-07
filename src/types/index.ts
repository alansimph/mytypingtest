export type LevelId = 'beginner' | 'intermediate' | 'expert'

export interface Lesson {
  id: string
  levelId: LevelId
  title: string
  prompts: readonly string[]
}

export interface Progress {
  completedLessonIds: string[]
}

export interface Settings {
  soundEnabled: boolean
}
