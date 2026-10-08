import type { StarCount } from '../types/index.ts'

export type { StarCount }

export interface LessonAttempt {
  promptIndex: number
  charIndex: number
  wrongCount: number
  hint: string | null
  finished: boolean
}

export function createAttempt(): LessonAttempt {
  return {
    promptIndex: 0,
    charIndex: 0,
    wrongCount: 0,
    hint: null,
    finished: false,
  }
}

export function promptCharacterCount(prompts: readonly string[]): number {
  return prompts.reduce((total, prompt) => total + prompt.length, 0)
}

export function promptWordCount(prompts: readonly string[]): number {
  return prompts.reduce((total, prompt) => {
    const words = prompt.trim().split(/\s+/).filter((word) => word.length > 0)
    return total + words.length
  }, 0)
}

function isLetter(char: string): boolean {
  return char.toLowerCase() !== char.toUpperCase()
}

function keyMatches(key: string, target: string, matchCase: boolean): boolean {
  if (!matchCase && isLetter(target)) return key.toLowerCase() === target.toLowerCase()
  return key === target
}

export function showShift(target: string, matchCase: boolean): boolean {
  if (target === '?') return true
  if (!matchCase || !isLetter(target)) return false
  return target !== target.toLowerCase()
}

export function spokenKey(char: string): string {
  if (char === ' ') return 'space'
  if (char === '.') return 'period'
  if (char === ',') return 'comma'
  if (char === '?') return 'question mark'
  if (char === "'") return 'apostrophe'
  return char
}

export function applyKey(
  attempt: LessonAttempt,
  prompts: readonly string[],
  key: string,
  matchCase = false,
): LessonAttempt {
  if (attempt.finished) return attempt

  const prompt = prompts[attempt.promptIndex]
  if (!prompt) return { ...attempt, finished: true }

  const target = prompt[attempt.charIndex]
  if (!target) {
    const promptIndex = attempt.promptIndex + 1
    return {
      ...attempt,
      promptIndex,
      charIndex: 0,
      finished: promptIndex >= prompts.length,
    }
  }

  if (!keyMatches(key, target, matchCase)) {
    const missedShift = matchCase && isLetter(target) && key.toLowerCase() === target.toLowerCase()
    return {
      ...attempt,
      wrongCount: attempt.wrongCount + 1,
      hint: missedShift ? 'Hold Shift, then press the glowing key.' : 'Try the glowing key.',
    }
  }

  const charIndex = attempt.charIndex + 1
  if (charIndex < prompt.length) {
    return {
      ...attempt,
      charIndex,
      hint: null,
    }
  }

  const promptIndex = attempt.promptIndex + 1
  return {
    promptIndex,
    charIndex: 0,
    wrongCount: attempt.wrongCount,
    hint: null,
    finished: promptIndex >= prompts.length,
  }
}

export function starsFor(correct: number, wrong: number): StarCount {
  if (correct <= 0) return 1
  if (wrong === 0) return 3
  const accuracy = correct / (correct + wrong)
  if (accuracy >= 0.8) return 2
  return 1
}

/** Standard typing speed: five characters count as one word. */
export function wordsPerMinute(characters: number, seconds: number): number {
  if (characters <= 0 || seconds <= 0) return 0
  return characters / 5 / (seconds / 60)
}

/** Master stars: finishing is 1, 40 words a minute is 2, and 60 is 3. */
export function starsForSpeed(rate: number): StarCount {
  if (rate >= 60) return 3
  if (rate >= 40) return 2
  return 1
}

export function speedLabel(rate: number): string {
  const rounded = Math.max(0, Math.round(rate))
  return rounded === 1 ? '1 word a minute.' : `${rounded} words a minute.`
}

export function starLabel(stars: number): string {
  return stars === 1 ? '1 star' : `${stars} stars`
}

function unitLabel(count: number, singular: string, plural: string): string {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`
}

/** Whole seconds for the lesson just finished. A very short try still counts as one second. */
export function durationLabel(seconds: number): string {
  const total = Math.max(1, Math.round(seconds))
  const minutes = Math.floor(total / 60)
  const remainder = total % 60
  if (minutes === 0) return `That took ${unitLabel(total, 'second', 'seconds')}.`
  if (remainder === 0) return `That took ${unitLabel(minutes, 'minute', 'minutes')}.`
  return `That took ${unitLabel(minutes, 'minute', 'minutes')} and ${unitLabel(remainder, 'second', 'seconds')}.`
}
