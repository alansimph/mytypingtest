import { emptyProgress, progressFromStored } from '../models/progress.ts'
import type { Progress, Settings } from '../types/index.ts'

const SETTINGS_KEY = 'myTypingTest.settings'
const PROGRESS_KEY = 'myTypingTest.progress'

const defaultSettings: Settings = {
  soundEnabled: true,
}

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as unknown
  } catch (error) {
    console.warn(`Could not read ${key}.`, error)
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Could not save ${key}.`, error)
  }
}

function isSettings(value: unknown): value is Settings {
  if (typeof value !== 'object' || value === null) return false
  if (!('soundEnabled' in value)) return false
  return typeof value.soundEnabled === 'boolean'
}

function legacyProgress(value: unknown): Progress | null {
  if (typeof value !== 'object' || value === null) return null
  if (!('completedLessonIds' in value)) return null
  const ids = value.completedLessonIds
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === 'string')) return null
  const lessons: Progress['lessons'] = {}
  for (const id of ids) lessons[id] = { stars: 1 }
  return { lessons }
}

export function loadSettings(): Settings {
  const stored = readJson(SETTINGS_KEY)
  return isSettings(stored) ? stored : defaultSettings
}

export function saveSettings(settings: Settings): void {
  writeJson(SETTINGS_KEY, settings)
}

export function loadProgress(): Progress {
  const stored = readJson(PROGRESS_KEY)
  return progressFromStored(stored) ?? legacyProgress(stored) ?? emptyProgress()
}

export function saveProgress(progress: Progress): void {
  writeJson(PROGRESS_KEY, progress)
}
