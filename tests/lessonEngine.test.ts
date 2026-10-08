import assert from 'node:assert/strict'
import { fingerFor } from '../src/constants/fingers.ts'
import { PUNCTUATION_KEYS } from '../src/constants/keyboard.ts'
import { LESSONS } from '../src/constants/lessons.ts'
import { isLevelComplete, isLevelUnlocked } from '../src/models/levels.ts'
import { emptyProgress, progressFromStored, withLessonResult } from '../src/models/progress.ts'
import {
  applyKey,
  createAttempt,
  durationLabel,
  promptCharacterCount,
  promptWordCount,
  showShift,
  speedLabel,
  starsFor,
  starsForSpeed,
  wordsPerMinute,
} from '../src/services/lessonEngine.ts'

const prompts = ['A', 'A', 'A', 'A']

function type(keys: string) {
  let attempt = createAttempt()
  for (const key of keys) {
    attempt = applyKey(attempt, prompts, key)
  }
  return attempt
}

const perfect = type('aaaa')
assert.equal(perfect.finished, true)
assert.equal(perfect.wrongCount, 0)
assert.equal(starsFor(prompts.length, perfect.wrongCount), 3)

const oneMiss = type('baaaa')
assert.equal(oneMiss.finished, true)
assert.equal(oneMiss.wrongCount, 1)
assert.equal(oneMiss.hint, null)
assert.equal(starsFor(prompts.length, oneMiss.wrongCount), 2)

const manyMisses = type('bbAAAA')
assert.equal(manyMisses.wrongCount, 2)
assert.equal(starsFor(prompts.length, manyMisses.wrongCount), 1)

const stuck = type('b')
assert.equal(stuck.finished, false)
assert.equal(stuck.promptIndex, 0)
assert.equal(stuck.hint, 'Try the glowing key.')

const shift = applyKey(createAttempt(), prompts, 'A')
assert.equal(shift.promptIndex, 1)
assert.equal(shift.hint, null)

const done = applyKey(perfect, prompts, 'Z')
assert.equal(done, perfect)

const beginnerLessons = LESSONS.filter((lesson) => lesson.levelId === 'beginner')
let progress = emptyProgress()
assert.equal(isLevelUnlocked('intermediate', progress), false)
assert.equal(isLevelUnlocked('expert', progress), false)

for (const lesson of beginnerLessons.slice(0, -1)) {
  progress = withLessonResult(progress, lesson.id, 3)
}
assert.equal(isLevelComplete('beginner', progress), false)
assert.equal(isLevelUnlocked('intermediate', progress), false)

const lastLesson = beginnerLessons[beginnerLessons.length - 1]
if (!lastLesson) throw new Error('Beginner lessons are missing.')
progress = withLessonResult(progress, lastLesson.id, 1)
assert.equal(isLevelComplete('beginner', progress), true)
assert.equal(isLevelUnlocked('intermediate', progress), true)
assert.equal(isLevelUnlocked('expert', progress), false)
assert.equal(progress.lessons[lastLesson.id]?.stars, 1)

const kept = withLessonResult(progress, lastLesson.id, 1)
assert.equal(kept, progress)

const raised = withLessonResult(progress, lastLesson.id, 2)
assert.equal(raised.lessons[lastLesson.id]?.stars, 2)
assert.equal(withLessonResult(raised, lastLesson.id, 1).lessons[lastLesson.id]?.stars, 2)

function typePrompt(prompts: readonly string[], keys: string, matchCase = false) {
  let attempt = createAttempt()
  for (const key of keys) {
    attempt = applyKey(attempt, prompts, key, matchCase)
  }
  return attempt
}

const word = typePrompt(['cat', 'dog'], 'catdog')
assert.equal(word.finished, true)
assert.equal(word.wrongCount, 0)
assert.equal(promptCharacterCount(['cat', 'dog']), 6)

const wordMiss = typePrompt(['cat'], 'cx')
assert.equal(wordMiss.finished, false)
assert.equal(wordMiss.charIndex, 1)
assert.equal(wordMiss.wrongCount, 1)
assert.equal(wordMiss.hint, 'Try the glowing key.')

const sentence = typePrompt(['a cat.'], 'a cat.')
assert.equal(sentence.finished, true)

const needsCapital = typePrompt(['The'], 't', true)
assert.equal(needsCapital.finished, false)
assert.equal(needsCapital.charIndex, 0)
assert.equal(needsCapital.hint, 'Hold Shift, then press the glowing key.')
assert.equal(showShift('T', true), true)
assert.equal(showShift('T', false), false)
assert.equal(showShift('?', false), true)

const capital = typePrompt(['The cat.'], 'The cat.', true)
assert.equal(capital.finished, true)
assert.equal(capital.wrongCount, 0)

const intermediateLessons = LESSONS.filter((lesson) => lesson.levelId === 'intermediate')
const expertLessons = LESSONS.filter((lesson) => lesson.levelId === 'expert')
assert.ok(intermediateLessons.length > 0)
assert.ok(expertLessons.length > 0)
for (const lesson of intermediateLessons) {
  progress = withLessonResult(progress, lesson.id, 3)
}
assert.equal(isLevelComplete('intermediate', progress), true)
assert.equal(isLevelUnlocked('expert', progress), true)
assert.equal(isLevelUnlocked('master', progress), false)

const masterLessons = LESSONS.filter((lesson) => lesson.levelId === 'master')
assert.ok(masterLessons.length > 0)
for (const lesson of masterLessons) {
  assert.equal(lesson.matchCase, true)
  assert.ok(promptWordCount(lesson.prompts) >= 50, `${lesson.id} needs at least 50 words`)
}

const typeable = new Set<string>([' ', ...PUNCTUATION_KEYS])
for (const lesson of [...expertLessons, ...masterLessons]) {
  for (const prompt of lesson.prompts) {
    for (const char of prompt) {
      const ok = typeable.has(char) || /[a-z]/i.test(char)
      assert.equal(ok, true, `${lesson.id} uses ${JSON.stringify(char)}`)
    }
  }
}

for (const lesson of expertLessons) {
  progress = withLessonResult(progress, lesson.id, 3)
}
assert.equal(isLevelComplete('expert', progress), true)
assert.equal(isLevelUnlocked('master', progress), true)
assert.equal(isLevelComplete('master', progress), false)

assert.equal(wordsPerMinute(50, 15), 40)
assert.equal(wordsPerMinute(50, 10), 60)
assert.equal(wordsPerMinute(50, 0), 0)
assert.equal(starsForSpeed(39.9), 1)
assert.equal(starsForSpeed(40), 2)
assert.equal(starsForSpeed(59.9), 2)
assert.equal(starsForSpeed(60), 3)
assert.equal(speedLabel(40), '40 words a minute.')
assert.equal(speedLabel(1), '1 word a minute.')

assert.equal(fingerFor('A')?.label, 'Left pinky finger')
assert.equal(fingerFor('s')?.id, 'left-ring')
assert.equal(fingerFor('F')?.id, 'left-index')
assert.equal(fingerFor('J')?.id, 'right-index')
assert.equal(fingerFor('c')?.id, fingerFor('D')?.id)
assert.equal(fingerFor(' ')?.label, 'Either thumb')
assert.equal(fingerFor('?')?.id, 'right-pinky')
assert.equal(fingerFor('1'), null)

assert.equal(durationLabel(0.2), 'That took 1 second.')
assert.equal(durationLabel(1), 'That took 1 second.')
assert.equal(durationLabel(8.4), 'That took 8 seconds.')
assert.equal(durationLabel(59.6), 'That took 1 minute.')
assert.equal(durationLabel(61), 'That took 1 minute and 1 second.')
assert.equal(durationLabel(125), 'That took 2 minutes and 5 seconds.')

const mixed = progressFromStored({
  lessons: {
    'beginner-a': { stars: 3 },
    broken: { stars: 9 },
    'beginner-s': { stars: 2, extra: true },
  },
})
assert.equal(mixed?.lessons['beginner-a']?.stars, 3)
assert.equal(mixed?.lessons['beginner-s']?.stars, 2)
assert.equal(mixed?.lessons.broken, undefined)
assert.deepEqual(progressFromStored({ lessons: {} }), emptyProgress())
assert.equal(progressFromStored({ completedLessonIds: ['beginner-a'] }), null)

console.log('lesson engine ok')
