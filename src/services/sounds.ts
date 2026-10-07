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

export function playFeedback(kind: 'correct' | 'wrong'): void {
  try {
    const ctx = getContext()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      void ctx.resume().then(() => tone(ctx, kind)).catch((error: unknown) => {
        console.warn('Could not play a sound.', error)
      })
      return
    }
    tone(ctx, kind)
  } catch (error) {
    console.warn('Could not play a sound.', error)
  }
}
