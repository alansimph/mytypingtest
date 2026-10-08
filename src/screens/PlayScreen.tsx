import { useEffect, useRef, useState } from 'react'
import {
  Capybara,
  capybaraGiftCount,
  capybaraOopsCount,
  type CapybaraMood,
} from '../components/Capybara.tsx'
import { FingerHint } from '../components/FingerHint.tsx'
import { fingerFor } from '../constants/fingers.ts'
import { Keyboard } from '../components/Keyboard.tsx'
import { ErrorMessage } from '../components/ErrorMessage.tsx'
import { PromptLine } from '../components/PromptLine.tsx'
import { MenuButton } from '../components/IconButtons.tsx'
import { ScreenHeader } from '../components/ScreenHeader.tsx'
import { getLesson, progressNoun } from '../models/levels.ts'
import {
  applyKey,
  createAttempt,
  promptCharacterCount,
  showShift,
  spokenKey,
  starsFor,
  starsForSpeed,
  wordsPerMinute,
} from '../services/lessonEngine.ts'
import { playFeedback } from '../services/sounds.ts'
import { letterFromKeyboardEvent } from '../utils/keyboardInput.ts'

interface PlayScreenProps {
  lessonId: string
  soundEnabled: boolean
  onBack: () => void
  onOpenSettings: () => void
  onComplete: (stars: 1 | 2 | 3, seconds: number, wordsPerMinute: number | null) => void
}

export function PlayScreen({
  lessonId,
  soundEnabled,
  onBack,
  onOpenSettings,
  onComplete,
}: PlayScreenProps) {
  const lesson = getLesson(lessonId)
  const [attempt, setAttempt] = useState(createAttempt)
  const [shiftHint, setShiftHint] = useState<string | null>(null)
  const attemptRef = useRef(attempt)
  const onCompleteRef = useRef(onComplete)
  const completedRef = useRef(false)
  const startedAt = useRef(performance.now())
  const giftKind = useRef(0)
  const oopsKind = useRef(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [reaction, setReaction] = useState<{ mood: CapybaraMood; kind: number; id: number }>({
    mood: 'idle',
    kind: 0,
    id: 0,
  })
  onCompleteRef.current = onComplete

  const submit = (letter: string) => {
    if (!lesson) return
    const current = attemptRef.current
    if (current.finished) return
    const next = applyKey(current, lesson.prompts, letter, lesson.matchCase)
    if (next === current) return
    attemptRef.current = next
    setAttempt(next)
    setShiftHint(null)
    const correct = next.wrongCount === current.wrongCount
    if (correct) {
      const kind = giftKind.current % capybaraGiftCount
      giftKind.current += 1
      setReaction((previous) => ({ mood: 'gift', kind, id: previous.id + 1 }))
    } else {
      const kind = oopsKind.current % capybaraOopsCount
      oopsKind.current += 1
      setReaction((previous) => ({ mood: 'oops', kind, id: previous.id + 1 }))
    }
    if (!soundEnabled) return
    playFeedback(next.wrongCount === current.wrongCount ? 'correct' : 'wrong')
  }

  const submitRef = useRef(submit)
  submitRef.current = submit

  useEffect(() => {
    headingRef.current?.focus()
  }, [lessonId])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const letter = letterFromKeyboardEvent(event)
      if (!letter) return
      if (event.key === ' ') event.preventDefault()
      submitRef.current(letter)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!lesson || !attempt.finished || completedRef.current) return
    completedRef.current = true
    const seconds = (performance.now() - startedAt.current) / 1000
    const characters = promptCharacterCount(lesson.prompts)
    const rate = lesson.levelId === 'master' ? wordsPerMinute(characters, seconds) : null
    onCompleteRef.current(rate === null ? starsFor(characters, attempt.wrongCount) : starsForSpeed(rate), seconds, rate)
  }, [attempt.finished, attempt.wrongCount, lesson])

  if (!lesson || lesson.prompts.length === 0) {
    return (
      <div className="stack">
        <ScreenHeader
          title="Lesson"
          onBack={onBack}
          backLabel="Lessons"
          lessonsIcon
          titleInRow
          action={<MenuButton onClick={onOpenSettings} />}
        />
        <ErrorMessage message="That lesson is not in the game." />
      </div>
    )
  }

  const prompt =
    lesson.prompts[Math.min(attempt.promptIndex, lesson.prompts.length - 1)] ?? ''
  const charIndex = attempt.finished ? prompt.length : attempt.charIndex
  const target = prompt[charIndex] ?? ''
  const singleLetter = prompt.length === 1
  const position = Math.min(attempt.promptIndex + 1, lesson.prompts.length)
  const hint = attempt.hint ?? shiftHint ?? ''
  const finger = fingerFor(target)
  const spoken = finger ? `${spokenKey(target)}, ${finger.label}` : spokenKey(target)

  return (
    <div className={lesson.levelId === 'master' ? 'stack play play--master' : 'stack'}>
      <ScreenHeader
        title={lesson.title}
        onBack={onBack}
        backLabel="Lessons"
        lessonsIcon
        titleInRow
        action={<MenuButton onClick={onOpenSettings} />}
      />
      <section className="panel prompt" aria-labelledby="prompt-heading">
        <div className="prompt__copy">
          <h2 id="prompt-heading" ref={headingRef} tabIndex={-1}>
            {singleLetter ? 'Press this key' : 'Type this'}
          </h2>
          {singleLetter ? (
            <p className="prompt-letter">{target}</p>
          ) : (
            <PromptLine text={prompt} charIndex={charIndex} />
          )}
          <p className="visually-hidden" aria-live="polite">
            {spoken}
          </p>
          <div className="prompt__status">
            <FingerHint char={target} />
            <p className="note">
              {progressNoun(lesson.levelId)} {position} of {lesson.prompts.length}
            </p>
            <p className="hint" role="status">
              {hint}
            </p>
          </div>
        </div>
        <Capybara key={reaction.id} mood={reaction.mood} kind={reaction.kind} />
      </section>
      <Keyboard
        target={target}
        showShift={showShift(target, lesson.matchCase)}
        showExtras={lesson.levelId === 'expert' || lesson.levelId === 'master'}
        disabled={attempt.finished}
        onKey={submit}
        onShift={() => {
          if (showShift(target, lesson.matchCase)) {
            setShiftHint('Hold Shift, then press the glowing key.')
          }
        }}
      />
    </div>
  )
}
