export type StarCount = 1 | 2 | 3

export interface LessonAttempt {
  promptIndex: number
  wrongCount: number
  hint: string | null
  finished: boolean
}

export function createAttempt(): LessonAttempt {
  return {
    promptIndex: 0,
    wrongCount: 0,
    hint: null,
    finished: false,
  }
}

export function applyKey(
  attempt: LessonAttempt,
  prompts: readonly string[],
  key: string,
): LessonAttempt {
  if (attempt.finished) return attempt

  const target = prompts[attempt.promptIndex]
  if (!target) {
    return { ...attempt, finished: true }
  }

  if (key.toLowerCase() !== target.toLowerCase()) {
    return {
      ...attempt,
      wrongCount: attempt.wrongCount + 1,
      hint: 'Try the glowing key.',
    }
  }

  const promptIndex = attempt.promptIndex + 1
  return {
    promptIndex,
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
