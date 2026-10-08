import type { CSSProperties } from 'react'
import type { StarCount } from '../types/index.ts'

const bits = [
  { x: '-72px', y: '-28px', color: '#c48404', delay: '0.05s' },
  { x: '68px', y: '-32px', color: '#1d4fbf', delay: '0.1s' },
  { x: '-40px', y: '26px', color: '#0f7a4a', delay: '0.16s' },
  { x: '46px', y: '20px', color: '#6236c4', delay: '0.08s' },
  { x: '-88px', y: '2px', color: '#d46a1e', delay: '0.2s' },
  { x: '90px', y: '-6px', color: '#c43b73', delay: '0.14s' },
  { x: '-16px', y: '-44px', color: '#1f8a62', delay: '0.22s' },
  { x: '14px', y: '36px', color: '#2f62d0', delay: '0.18s' },
  { x: '-56px', y: '-40px', color: '#c48404', delay: '0.26s' },
  { x: '74px', y: '30px', color: '#0c7f86', delay: '0.12s' },
  { x: '4px', y: '-48px', color: '#b23b78', delay: '0.24s' },
  { x: '-6px', y: '42px', color: '#6b45c4', delay: '0.28s' },
]

interface StarCelebrationProps {
  stars: StarCount
}

export function StarCelebration({ stars }: StarCelebrationProps) {
  return (
    <div className="celebration" aria-hidden="true">
      {bits.slice(0, stars * 4).map((bit, index) => (
        <span
          key={index}
          className="celebration__bit"
          style={
            {
              '--x': bit.x,
              '--y': bit.y,
              '--bit': bit.color,
              animationDelay: bit.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
