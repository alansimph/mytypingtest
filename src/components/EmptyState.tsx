import type { ReactNode } from 'react'

interface EmptyStateProps {
  title?: string
  message: string
  media?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, message, media, action }: EmptyStateProps) {
  return (
    <section className="empty-state">
      {media}
      {title ? <h2>{title}</h2> : null}
      <p>{message}</p>
      {action}
    </section>
  )
}
