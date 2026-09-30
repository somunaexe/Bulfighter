// Spawns N bot.js processes to fill (or stress-test) a Pseudodemocracy
// room without opening any browser tabs for them.
//
// Usage: node run-bots.js <roomCode> <count>
// Example: node run-bots.js RG2Y 5
//
// Create the room yourself in a real browser first (as the host, so
// you're the one actually watching/testing), get its 4-letter code, then
// run this to fill the rest of the seats. Ctrl+C stops every bot at once.
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const [, , roomCode, countArg] = process.argv
const count = Number(countArg)

if (!roomCode || !count || count < 1) {
    console.error('Usage: node run-bots.js <roomCode> <count>')
    process.exit(1)
}

const children = []
for (let i = 1; i <= count; i++) {
    const name = `Bot ${i}`
    const child = spawn('node', [join(__dirname, 'bot.js'), roomCode, name], { stdio: 'inherit' })
    children.push(child)
}

process.on('SIGINT', () => {
    for (const c of children) c.kill()
    process.exit(0)
})
