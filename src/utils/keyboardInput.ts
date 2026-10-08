export function letterFromKeyboardEvent(event: KeyboardEvent): string | null {
  if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return null
  if (event.key.length !== 1) return null
  return event.key
}
