export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'thumb'

export interface FingerHint {
  id: FingerId
  label: string
}

const FINGERS: Record<FingerId, FingerHint> = {
  'left-pinky': { id: 'left-pinky', label: 'Left pinky finger' },
  'left-ring': { id: 'left-ring', label: 'Left ring finger' },
  'left-middle': { id: 'left-middle', label: 'Left middle finger' },
  'left-index': { id: 'left-index', label: 'Left index finger' },
  'right-index': { id: 'right-index', label: 'Right index finger' },
  'right-middle': { id: 'right-middle', label: 'Right middle finger' },
  'right-ring': { id: 'right-ring', label: 'Right ring finger' },
  'right-pinky': { id: 'right-pinky', label: 'Right pinky finger' },
  thumb: { id: 'thumb', label: 'Either thumb' },
}

/** Home-row finger for each key. Keys above and below use the finger that rests on that home key. */
const KEY_FINGERS: Record<string, FingerId> = {
  q: 'left-pinky',
  a: 'left-pinky',
  z: 'left-pinky',
  w: 'left-ring',
  s: 'left-ring',
  x: 'left-ring',
  e: 'left-middle',
  d: 'left-middle',
  c: 'left-middle',
  r: 'left-index',
  t: 'left-index',
  f: 'left-index',
  g: 'left-index',
  v: 'left-index',
  b: 'left-index',
  y: 'right-index',
  u: 'right-index',
  h: 'right-index',
  j: 'right-index',
  n: 'right-index',
  m: 'right-index',
  i: 'right-middle',
  k: 'right-middle',
  ',': 'right-middle',
  o: 'right-ring',
  l: 'right-ring',
  '.': 'right-ring',
  p: 'right-pinky',
  "'": 'right-pinky',
  '?': 'right-pinky',
  ' ': 'thumb',
}

export function fingerFor(char: string): FingerHint | null {
  const id = KEY_FINGERS[char.toLowerCase()]
  if (!id) return null
  return FINGERS[id]
}
