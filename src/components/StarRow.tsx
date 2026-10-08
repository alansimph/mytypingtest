interface StarRowProps {
  filled: number
  total?: number
  celebrate?: boolean
  compact?: boolean
}

export function StarRow({ filled, total = 3, celebrate = false, compact = false }: StarRowProps) {
  return (
    <div className={compact ? 'star-row star-row--compact' : 'star-row'}>
      {Array.from({ length: total }, (_, index) => {
        const isFilled = index < filled
        const pop = celebrate && isFilled
        return (
          <svg
            key={index}
            className={pop ? 'star star--filled star--pop' : isFilled ? 'star star--filled' : 'star star--empty'}
            style={pop ? { animationDelay: `${index * 0.12}s` } : undefined}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2.6 14.7 8.2l6.2.8-4.5 4.3 1.1 6.1L12 16.5 6.5 19.4l1.1-6.1L3.1 9l6.2-.8L12 2.6z" />
          </svg>
        )
      })}
    </div>
  )
}
