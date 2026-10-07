import { useState } from 'react'
import { loadSettings, saveSettings } from '../services/storage.ts'
import type { Settings } from '../types/index.ts'

export function useSettings(): {
  settings: Settings
  setSoundEnabled: (soundEnabled: boolean) => void
} {
  const [settings, setSettings] = useState(loadSettings)

  const setSoundEnabled = (soundEnabled: boolean) => {
    setSettings((current) => {
      const next = { ...current, soundEnabled }
      saveSettings(next)
      return next
    })
  }

  return { settings, setSoundEnabled }
}
