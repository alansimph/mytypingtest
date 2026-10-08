let audioContext: AudioContext | null = null

function getContext(): AudioContext | null {
  const AudioContextCtor = window.AudioContext
  if (!AudioContextCtor) return null
  if (!audioContext) audioContext = new AudioContextCtor()
  return audioContext
}

function tone(ctx: AudioContext, kind: 'correct' | 'wrong'): void {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const now = ctx.currentTime
  osc.type = 'sine'
  osc.frequency.value = kind === 'correct' ? 587 : 196
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(kind === 'correct' ? 0.07 : 0.04, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'correct' ? 0.18 : 0.12))
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.22)
}

const celebrationNotes: Record<1 | 2 | 3, readonly number[]> = {
  1: [523],
  2: [523, 659],
  3: [523, 659, 784],
}

function chime(ctx: AudioContext, stars: 1 | 2 | 3): void {
  const now = ctx.currentTime
  celebrationNotes[stars].forEach((frequency, index) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const start = now + index * 0.14
    osc.type = 'sine'
    osc.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.08, start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(start)
    osc.stop(start + 0.22)
  })
}

function play(sound: (ctx: AudioContext) => void): void {
  try {
    const ctx = getContext()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      void ctx.resume().then(() => sound(ctx)).catch((error: unknown) => {
        console.warn('Could not play a sound.', error)
      })
      return
    }
    sound(ctx)
  } catch (error) {
    console.warn('Could not play a sound.', error)
  }
}

export function playFeedback(kind: 'correct' | 'wrong'): void {
  play((ctx) => tone(ctx, kind))
}

export function playCelebration(stars: 1 | 2 | 3): void {
  play((ctx) => chime(ctx, stars))
}
