import { useEffect, useRef, useState } from 'react'
import { Keyboard } from '../components/Keyboard.tsx'
import { ErrorMessage } from '../components/ErrorMessage.tsx'
import { ScreenHeader } from '../components/ScreenHeader.tsx'
import { getLesson } from '../models/levels.ts'
import {
  applyKey,
  createAttempt,
  starsFor,
} from '../services/lessonEngine.ts'
import { playFeedback } from '../services/sounds.ts'
import { letterFromKeyboardEvent } from '../utils/keyboardInput.ts'

interface PlayScreenProps {
  lessonId: string
  soundEnabled: boolean
  onBack: () => void
  onComplete: (stars: 1 | 2 | 3) => void
}

export function PlayScreen({
  lessonId,
  soundEnabled,
  onBack,
  onComplete,
}: PlayScreenProps) {
  const lesson = getLesson(lessonId)
  const [attempt, setAttempt] = useState(createAttempt)
  const attemptRef = useRef(attempt)
  const onCompleteRef = useRef(onComplete)
  const completedRef = useRef(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  onCompleteRef.current = onComplete

  const submit = (letter: string) => {
    if (!lesson) return
    const current = attemptRef.current
    if (current.finished) return
    const next = applyKey(current, lesson.prompts, letter)
    if (next === current) return
    attemptRef.current = next
    setAttempt(next)
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
    onCompleteRef.current(starsFor(lesson.prompts.length, attempt.wrongCount))
  }, [attempt.finished, attempt.wrongCount, lesson])

  if (!lesson || lesson.prompts.length === 0) {
    return (
      <div className="stack">
        <ScreenHeader title="Lesson" onBack={onBack} backLabel="Lessons" />
        <ErrorMessage message="That lesson is not in the game." />
      </div>
    )
  }

  const letter =
    lesson.prompts[Math.min(attempt.promptIndex, lesson.prompts.length - 1)] ?? ''
  const position = Math.min(attempt.promptIndex + 1, lesson.prompts.length)

  return (
    <div className="stack">
      <ScreenHeader
        title={lesson.title}
        onBack={onBack}
        backLabel="Lessons"
      />
      <section className="panel prompt" aria-labelledby="prompt-heading">
        <h2 id="prompt-heading" ref={headingRef} tabIndex={-1}>
          Press this key
        </h2>
        <p className="prompt-letter" aria-live="polite">
          {letter}
        </p>
        <p className="note">
          Letter {position} of {lesson.prompts.length}
        </p>
        <p className="hint" role="status">
          {attempt.hint ?? ''}
        </p>
      </section>
      <Keyboard target={letter} disabled={attempt.finished} onKey={submit} />
    </div>
  )
}
