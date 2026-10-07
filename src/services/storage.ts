import type { Progress, Settings } from '../types/index.ts'

const SETTINGS_KEY = 'myTypingTest.settings'
const PROGRESS_KEY = 'myTypingTest.progress'

const defaultSettings: Settings = {
  soundEnabled: true,
}

const emptyProgress: Progress = {
  completedLessonIds: [],
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

function isProgress(value: unknown): value is Progress {
  if (typeof value !== 'object' || value === null) return false
  if (!('completedLessonIds' in value)) return false
  const ids = value.completedLessonIds
  return Array.isArray(ids) && ids.every((id) => typeof id === 'string')
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
  return isProgress(stored) ? stored : emptyProgress
}
