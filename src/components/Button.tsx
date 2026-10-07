import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = className
    ? `button button--${variant} ${className}`
    : `button button--${variant}`

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
