import type { ReactNode } from 'react'
import { Button } from './Button.tsx'
import { BackIconButton, HomeIconButton } from './IconButtons.tsx'

interface ScreenHeaderProps {
  title: string
  onBack?: () => void
  backLabel?: string
  action?: ReactNode
  titleInRow?: boolean
  homeIcon?: boolean
  lessonsIcon?: boolean
}

export function ScreenHeader({
  title,
  onBack,
  backLabel = 'Back',
  action,
  titleInRow = false,
  homeIcon = false,
  lessonsIcon = false,
}: ScreenHeaderProps) {
  const back = onBack ? (
    homeIcon ? (
      <HomeIconButton onClick={onBack} />
    ) : lessonsIcon ? (
      <BackIconButton onClick={onBack} />
    ) : (
      <Button variant="ghost" onClick={onBack}>
        {backLabel}
      </Button>
    )
  ) : (
    <span />
  )

  if (titleInRow) {
    return (
      <header className="level-bar">
        {back}
        <h1>{title}</h1>
        {action ?? <span />}
      </header>
    )
  }

  return (
    <header className="screen-header">
      <div className="screen-header__row">
        {back}
        {action}
      </div>
      <h1>{title}</h1>
    </header>
  )
}
