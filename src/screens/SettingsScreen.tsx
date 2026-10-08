import { ScreenHeader } from '../components/ScreenHeader.tsx'
import { Switch } from '../components/Switch.tsx'

interface SettingsScreenProps {
  soundEnabled: boolean
  onSoundEnabled: (soundEnabled: boolean) => void
  onHome: () => void
}

export function SettingsScreen({
  soundEnabled,
  onSoundEnabled,
  onHome,
}: SettingsScreenProps) {
  return (
    <div className="stack">
      <ScreenHeader title="Settings" onBack={onHome} backLabel="Home" />
      <section className="panel">
        <Switch
          checked={soundEnabled}
          label="Sound effects"
          description="Plays a short sound for each key, and a tune when a lesson ends."
          onChange={onSoundEnabled}
        />
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
