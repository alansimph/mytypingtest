import type { ReactNode } from 'react'
import { Button } from './Button.tsx'

interface ScreenHeaderProps {
  title: string
  onBack?: () => void
  backLabel?: string
  action?: ReactNode
}

export function ScreenHeader({
  title,
  onBack,
  backLabel = 'Back',
  action,
}: ScreenHeaderProps) {
  return (
    <header className="screen-header">
      <div className="screen-header__row">
        {onBack ? (
          <Button variant="ghost" onClick={onBack}>
            {backLabel}
          </Button>
        ) : (
          <span />
        )}
        {action}
      </div>
      <h1>{title}</h1>
    </header>
  )
}
