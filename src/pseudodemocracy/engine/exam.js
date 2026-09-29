// Exam pass/fail. passMarkPercent is a live, amendable value (Article 1:
// Exam Pass Mark) - callers read it from the room's current Constitution
// state, not from game_data.js directly, since a Leader may have amended it.
export function didPass(correctCount, totalQuestions, passMarkPercent) {
    if (totalQuestions === 0) return true // "if no exam is ready, everyone can vote and run"
    const percent = (correctCount / totalQuestions) * 100
    return percent > passMarkPercent
}

export function scoreAnswers(answers, answerKey) {
    let correct = 0
    for (let i = 0; i < answerKey.length; i++) {
        if (answers[i] === answerKey[i]) correct++
    }
    return correct
}
