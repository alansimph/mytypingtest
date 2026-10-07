import assert from 'node:assert/strict'
import { applyKey, createAttempt, starsFor } from '../src/services/lessonEngine.ts'

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

console.log('lesson engine ok')
