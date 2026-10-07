import type { Lesson } from '../types/index.ts'

function beginner(id: string, title: string, letters: string): Lesson {
  return {
    id: `beginner-${id}`,
    levelId: 'beginner',
    title,
    prompts: [...letters],
  }
}

/**
 * TODO: Add Intermediate word lessons and Expert sentence lessons.
 * Beginner stays on single letters. Later levels stay locked until these lessons are finished and saved.
 */
export const LESSONS: readonly Lesson[] = [
  beginner('a', 'The A key', 'AAAA'),
  beginner('s', 'The S key', 'SSSS'),
  beginner('as', 'A and S', 'ASASSA'),
  beginner('df', 'D and F', 'DDFFDF'),
  beginner('jk', 'J and K', 'JJKKJK'),
  beginner('l', 'The L key', 'LLLKLK'),
  beginner('gh', 'G and H', 'GHGHGH'),
  beginner('home', 'The home row', 'ASDFGHJKLFJDK'),
  beginner('qwe', 'Q, W, and E', 'QWEQWE'),
  beginner('rty', 'R, T, and Y', 'RTYRTY'),
  beginner('uiop', 'U, I, O, and P', 'UIOPUI'),
  beginner('zxc', 'Z, X, and C', 'ZXCZXC'),
  beginner('vbnm', 'V, B, N, and M', 'VBNMVB'),
  beginner('mix', 'Mix the letters', 'AQLZPMWSK'),
]
