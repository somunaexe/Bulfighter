import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import { navLinks } from '../constants/index.js'
import { V, fmt } from '../pseudodemocracy/psdData.js'
import { constitutionChapters } from '../pseudodemocracy/psdData.js'
import { parseHighlights } from '../pseudodemocracy/parseHighlights.js'

// Renders an article's text with its __word__ markers turned into styled
// spans instead of literal underscores - every number/word inside still
// comes straight from articles.js via parseHighlights, nothing here is
// retyped.
const HighlightedText = ({ text }) => (
    <>
        {parseHighlights(text).map((segment, index) => (
            segment.highlighted ? (
                <span
                    key={index}
                    className="font-semibold text-[rgb(var(--theme-accent))] underline decoration-dotted underline-offset-2"
                >
                    {segment.text}
                </span>
            ) : (
                <span key={index}>{segment.text}</span>
            )
        ))}
    </>
)

const Pseudodemocracy = () => {
    return (
        <main className="max-w-7xl mx-auto min-h-screen flex flex-col">
            <Navbar navLinks={navLinks} />

            <section className="c-space pt-24 pb-16 flex-1">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <h1 className="head-text text-3xl sm:text-4xl">Pseudodemocracy</h1>
                    <p className="text-white-600 mt-4 text-lg">
                        A satirical, Nigerian-themed political party game for {V.minPlayers}+ players. One player is
                        Leader at a time - everyone else maneuvers to take the seat. Most rounds as Leader wins.
                    </p>
                    <a
                        href="/assets/Pseudodemocracy_Rules.docx"
                        download
                        className="field-btn hover:bg-[rgb(var(--theme-accent))] hover:text-white transition-colors mt-4 mx-auto"
                    >
                        Download the full rulebook
                        <img src="/assets/arrow-up.png" alt="" className="field-btn_arrow" />
                    </a>
                </div>

                {/* A coming-soon marker rather than a broken/half-working game -
                    this page's job for now is to let people read the rules and
                    get a feel for it, per the site owner's own goal for this
                    page, while the full online multiplayer version (which needs
                    its own realtime backend) is built out separately. */}
                <div className="surface-card border-2 border-dashed border-[rgb(var(--theme-accent))] p-6 sm:p-8 mb-10 text-center">
                    <p className="font-semibold text-white-800">Play online is coming soon</p>
                    <p className="text-white-600 mt-1">For now, read the rules below or download the full handbook to get a feel for the game.</p>
                </div>

                {/* Quick-start summary - same idea as the "Quick-Start Summary"
                    page in the printed handbook (build_rulebook.js's
                    quickStart()), rewritten as prose for the web, but every
                    number below is read live from game_data.js via V - none of
                    it is retyped, so if a number changes there, it changes here
                    automatically the next time the site builds. */}
                <div className="surface-card p-6 sm:p-8 mb-10 space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-white-800 mb-2">Goal</h2>
                        <p className="text-white-600">
                            Most rounds as Leader wins. A term ended by a coup counts as only {V.coupedScore} round.
                            Ties are broken by (popularity + {Math.abs(V.popMin)}) &times; PSD - highest wins.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white-800 mb-2">Setup</h2>
                        <p className="text-white-600">
                            Each player starts with {fmt(V.startMoney)} PSD. Everything else goes to the treasury,
                            which also gives change for any payment.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white-800 mb-2">Each round is one term</h2>
                        <ol className="list-decimal list-outside pl-5 text-white-600 space-y-1">
                            <li>
                                <b className="text-white-800">Exam</b> - the Leader&apos;s {V.examQuestions}+ question test, sealed answer key.
                                Pass with more than {V.passMark}% to vote or run.
                            </li>
                            <li><b className="text-white-800">Vote</b> for the next Leader.</li>
                            <li><b className="text-white-800">Role draw</b> - Dictator, President or Commander.</li>
                            <li><b className="text-white-800">Inauguration</b> - the Leader may amend one Constitution article.</li>
                            <li>
                                <b className="text-white-800">Levy</b> (starts {V.levy.start} PSD, band {V.levy.bandLow}-{V.levy.bandHigh})
                                and {V.taxRate}% tax to the treasury.
                            </li>
                            <li><b className="text-white-800">Turns</b> - everyone plays once. Mid-term amendment once at least half have played.</li>
                            <li><b className="text-white-800">Farewell</b> amendment, then the term ends.</li>
                        </ol>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white-800 mb-2">Coups - any time</h2>
                        <p className="text-white-600">
                            {V.coupCost} PSD and a coup card, plus being at least {V.coupGap} points more popular than
                            the Leader. A successful coup stops the round immediately - the challenger starts the next
                            one from the beginning.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white-800 mb-2">Amending the Constitution</h2>
                        <p className="text-white-600">
                            Three windows per term (Inauguration, Mid-term, Farewell). Only the <span className="font-semibold text-[rgb(var(--theme-accent))]">highlighted</span> words
                            in an article can change, one word for one word. Everyone except the Leader votes right
                            after: +{V.amendVote} popularity per vote for, -{V.amendVote} per vote against. A failed
                            amendment (ungrammatical, or more than just the highlighted words changed) reverts and
                            costs the Leader {V.amendPenalty} PSD.
                        </p>
                    </div>
                </div>

                {/* Constitution, read live from articles.js */}
                <div>
                    <h2 className="text-2xl font-semibold text-white-800 mb-2">The Constitution</h2>
                    <p className="text-white-600 mb-6">
                        <span className="font-semibold text-[rgb(var(--theme-accent))]">Highlighted</span> words are
                        the ones a Leader can amend - everything else is locked for the rest of the game.
                    </p>

                    <div className="space-y-10">
                        {constitutionChapters.map((chapter) => (
                            <div key={chapter.chapter}>
                                <h3 className="text-xl font-semibold text-white-800 mb-4">{chapter.chapter}</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {chapter.articles.map(([name, text]) => (
                                        <div key={name} className="surface-card p-4">
                                            <p className="font-semibold text-white-800 mb-1">{name}</p>
                                            <p className="text-white-600"><HighlightedText text={text} /></p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

export default Pseudodemocracy
