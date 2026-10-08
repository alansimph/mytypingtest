interface IconButtonProps {
  onClick: () => void
}

export function MenuButton({ onClick }: IconButtonProps) {
  return (
    <button type="button" className="icon-button" aria-label="Settings" onClick={onClick}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 7h16M4 12h16M4 17h16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

export function HomeIconButton({ onClick }: IconButtonProps) {
  return (
    <button type="button" className="icon-button" aria-label="Home" onClick={onClick}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4.5 11.2 12 5l7.5 6.2V19a1 1 0 0 1-1 1h-4.2v-5.2H9.7V20H5.5a1 1 0 0 1-1-1v-7.8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

export function BackIconButton({ onClick }: IconButtonProps) {
  return (
    <button type="button" className="icon-button" aria-label="Lessons" onClick={onClick}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M14.5 6 8.5 12l6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
