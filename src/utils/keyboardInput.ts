export function letterFromKeyboardEvent(event: KeyboardEvent): string | null {
  if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return null
  if (event.key.length !== 1) return null
  if (
    event.key === ' ' &&
    event.target instanceof Element &&
    event.target.closest('button')
  ) {
    return null
  }
  return event.key
}
