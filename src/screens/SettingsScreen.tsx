import { useState } from 'react'
import { Button } from '../components/Button.tsx'
import { MenuButton } from '../components/IconButtons.tsx'
import { ScreenHeader } from '../components/ScreenHeader.tsx'
import { Switch } from '../components/Switch.tsx'

interface SettingsScreenProps {
  soundEnabled: boolean
  onSoundEnabled: (soundEnabled: boolean) => void
  onHome: () => void
  onOpenSettings: () => void
  onResetLessons: () => void
}

export function SettingsScreen({
  soundEnabled,
  onSoundEnabled,
  onHome,
  onOpenSettings,
  onResetLessons,
}: SettingsScreenProps) {
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  return (
    <div className="stack">
      <ScreenHeader
        title="Settings"
        onBack={onHome}
        homeIcon
        titleInRow
        action={<MenuButton onClick={onOpenSettings} />}
      />
      <section className="panel">
        <Switch
          checked={soundEnabled}
          label="Sound effects"
          description="Plays a short sound for each key, and a tune when a lesson ends."
          onChange={onSoundEnabled}
        />
      </section>
      <section className="panel" aria-labelledby="reset-heading">
        <h2 id="reset-heading">Lessons</h2>
        <p className="note">Reset clears every star and locks the later levels again.</p>
        {confirmReset ? (
          <>
            <p>Reset all lessons?</p>
            <div className="settings-actions">
              <Button
                onClick={() => {
                  onResetLessons()
                  setConfirmReset(false)
                  setResetDone(true)
                }}
              >
                Yes
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setConfirmReset(false)
                }}
              >
                No
              </Button>
            </div>
          </>
        ) : (
          <div className="settings-actions">
            <Button
              variant="secondary"
              onClick={() => {
                setResetDone(false)
                setConfirmReset(true)
              }}
            >
              Reset
            </Button>
            {resetDone ? <p>All lessons are reset.</p> : null}
          </div>
        )}
      </section>
      <section className="panel">
        <h2>Keyboard</h2>
        <p className="note">
          Phones can open the app. A laptop or desktop is the better way to learn.
        </p>
      </section>
    </div>
  )
}
