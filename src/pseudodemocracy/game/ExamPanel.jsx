import { useState } from 'react'
import { V } from '../psdData.js'
import { writeExam, submitExamAnswers, revealExam } from '../gameEngine.js'

const emptyQuestion = () => ({ text: '', options: ['', ''], correct: 0 })

const WriteExamForm = ({ roomCode, round, leaderUid }) => {
    const [questions, setQuestions] = useState(Array.from({ length: V.examQuestions }, emptyQuestion))
    const [busy, setBusy] = useState(false)

    const updateQuestion = (i, patch) => {
        setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)))
    }
    const updateOption = (qIndex, oIndex, text) => {
        setQuestions((qs) =>
            qs.map((q, idx) => (idx === qIndex ? { ...q, options: q.options.map((o, j) => (j === oIndex ? text : o)) } : q))
        )
    }

    const canSubmit = questions.every((q) => q.text.trim() && q.options.every((o) => o.trim()))

    const handleSubmit = async () => {
        setBusy(true)
        try {
            await writeExam(
                roomCode,
                round,
                leaderUid,
                questions.map((q) => ({ text: q.text, options: q.options })),
                questions.map((q) => q.correct)
            )
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-1">Write the exam</p>
            <p className="text-white-600 text-sm mb-4">
                At least {V.examQuestions} questions, {V.examOptions}+ options each. Your answer key is sealed until
                you reveal it - nobody else can see it, not even in the database.
            </p>
            {questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-4 pb-4 border-b border-black-300">
                    <input
                        type="text"
                        placeholder={`Question ${qIndex + 1}`}
                        value={q.text}
                        onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                        className="w-full mb-2 px-3 py-2 rounded-md bg-transparent border border-black-300"
                    />
                    {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2 mb-1">
                            <input
                                type="radio"
                                checked={q.correct === oIndex}
                                onChange={() => updateQuestion(qIndex, { correct: oIndex })}
                            />
                            <input
                                type="text"
                                placeholder={`Option ${oIndex + 1}`}
                                value={opt}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                className="flex-1 px-3 py-1 rounded-md bg-transparent border border-black-300"
                            />
                        </div>
                    ))}
                    <button
                        onClick={() => updateQuestion(qIndex, { options: [...q.options, ''] })}
                        className="text-sm text-[rgb(var(--theme-accent))]"
                    >
                        + add option
                    </button>
                </div>
            ))}
            <div className="flex gap-4">
                <button
                    onClick={() => setQuestions((qs) => [...qs, emptyQuestion()])}
                    className="field-btn"
                >
                    + Add question
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || busy}
                    className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors disabled:opacity-50"
                >
                    Seal exam
                </button>
            </div>
        </div>
    )
}

const TakeExamForm = ({ roomCode, round, roundState, me }) => {
    const [answers, setAnswers] = useState(roundState.answers?.[me.uid] || [])
    const submitted = Boolean(roundState.answers?.[me.uid])

    const select = (qIndex, oIndex) => {
        const next = [...answers]
        next[qIndex] = oIndex
        setAnswers(next)
    }

    const handleSubmit = async () => {
        await submitExamAnswers(roomCode, round, me.uid, answers)
    }

    return (
        <div className="surface-card p-6 mb-6">
            <p className="font-semibold text-white-800 mb-4">Exam</p>
            {roundState.questions.map((q, qIndex) => (
                <div key={qIndex} className="mb-4">
                    <p className="text-white-800 mb-2">{q.text}</p>
                    {q.options.map((opt, oIndex) => (
                        <label key={oIndex} className="flex items-center gap-2 mb-1 text-white-600">
                            <input
                                type="radio"
                                disabled={submitted}
                                checked={answers[qIndex] === oIndex}
                                onChange={() => select(qIndex, oIndex)}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            ))}
            {submitted ? (
                <p className="text-white-600">Answers submitted - waiting for the Leader to reveal the key.</p>
            ) : (
                <button
                    onClick={handleSubmit}
                    disabled={answers.length !== roundState.questions.length}
                    className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors disabled:opacity-50"
                >
                    Submit answers
                </button>
            )}
        </div>
    )
}

const ExamPanel = ({ roomCode, round, roundState, me, players, isLeader }) => {
    const [busy, setBusy] = useState(false)

    if (!roundState.questions || roundState.questions.length === 0) {
        return isLeader ? (
            <WriteExamForm roomCode={roomCode} round={round} leaderUid={me.uid} />
        ) : (
            <div className="surface-card p-6 mb-6 text-center text-white-600">Waiting for the Leader to write the exam...</div>
        )
    }

    if (isLeader) {
        const answered = Object.keys(roundState.answers || {}).length
        const total = players.filter((p) => p.uid !== me.uid && !p.eliminated).length
        return (
            <div className="surface-card p-6 mb-6 text-center">
                <p className="text-white-600">{answered} / {total} players have answered.</p>
                <button
                    onClick={async () => {
                        setBusy(true)
                        try {
                            await revealExam(roomCode, round, players)
                        } finally {
                            setBusy(false)
                        }
                    }}
                    disabled={busy}
                    className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors mt-3 disabled:opacity-50"
                >
                    Reveal answer key
                </button>
            </div>
        )
    }

    return <TakeExamForm roomCode={roomCode} round={round} roundState={roundState} me={me} />
}

export default ExamPanel
