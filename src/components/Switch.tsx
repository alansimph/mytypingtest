interface SwitchProps {
  checked: boolean
  label: string
  description: string
  onChange: (checked: boolean) => void
}

export function Switch({ checked, label, description, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={checked ? 'switch switch--on' : 'switch'}
      onClick={() => onChange(!checked)}
    >
      <span className="switch__text">
        <span className="switch__label">{label}</span>
        <span className="switch__description">{description}</span>
      </span>
      <span className="switch__state">{checked ? 'On' : 'Off'}</span>
      <span className="switch__track" aria-hidden="true">
        <span className="switch__thumb" />
      </span>
    </button>
  )
}
