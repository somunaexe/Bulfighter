import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CURRENT_CASTING_TOPICS, ONBOARDING_CONTACT_EMAIL } from '../constants/onboarding.js'

// A section heading + its body, styled consistently so adding a new
// section is just adding another <Section> below - no new CSS needed.
const Section = ({ title, children }) => (
    <div className="mt-6 first:mt-0">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-white-500 border-b border-black-500 pb-1 mb-2">
            {title}
        </h4>
        <div className="text-white-600 space-y-2">{children}</div>
    </div>
)

// Plain bullet list - just an array of strings in, so a section's list can
// grow/shrink without touching any markup.
const List = ({ items }) => (
    <ul className="list-disc list-outside pl-5 space-y-1">
        {items.map((item) => (
            <li key={item}>{item}</li>
        ))}
    </ul>
)

const OnboardingModal = ({ isOpen, onClose }) => {
    const [mounted, setMounted] = useState(false)
    const [visible, setVisible] = useState(false)

    // Same open/close pattern as CastModal.jsx: mount immediately, then flip
    // visible true a frame later so the browser has an "invisible" state to
    // transition from - without the frame delay there'd be nothing to
    // animate from and it would just snap open instantly.
    useEffect(() => {
        if (isOpen) {
            setMounted(true)
            const raf = requestAnimationFrame(() => setVisible(true))
            return () => cancelAnimationFrame(raf)
        }

        setVisible(false)
        const timeout = setTimeout(() => setMounted(false), 200)
        return () => clearTimeout(timeout)
    }, [isOpen])

    useEffect(() => {
        if (!mounted) return

        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose()
        }
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeyDown)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [mounted, onClose])

    if (!mounted) return null

    // Rendered into document.body via a portal rather than in place: this
    // component gets used wherever a page happens to want it, and "fixed"
    // positioning silently stops meaning "relative to the viewport" if ANY
    // ancestor has a transform/filter/backdrop-filter/will-change set (here,
    // it's Contact.jsx's own backdrop-blur-md wrapper) - the element becomes
    // fixed relative to THAT ancestor instead, which is exactly what was
    // sending the close button to a seemingly random offset. Portaling to
    // document.body sidesteps the problem entirely, regardless of what
    // ancestors this ends up nested under in the future.
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
            />

            <div
                className={`
                    relative w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col
                    surface-card transition-all duration-200
                    ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
            >
                {/* Sibling of the scrollable div below, not a child of it - a
                    close button INSIDE a scrolling container scrolls away
                    with it (see the ConfirmModal.jsx fix for the same bug).
                    Given a dark semi-transparent backdrop (rather than the
                    plain icon CastModal/ConfirmModal use) since it needs to
                    stay legible sitting over the cover photo below, not just
                    a plain card background. */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
                >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round">
                        <path d="M6 6l12 12M6 18L18 6" />
                    </svg>
                </button>

                {/* flex-1 min-h-0: fills the leftover space inside the
                    max-h-[85vh] card and is what lets overflow-y-auto below
                    actually kick in instead of the card just growing taller
                    than the screen - see ConfirmModal.jsx for the same
                    reasoning written out in more detail. */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    {/* No padding on the scroll container itself, so this
                        image - as its first, un-padded child - naturally
                        spans the full card width and sits flush against the
                        rounded top corners with no extra work needed.
                        (Tried getting the same result by keeping padding on
                        this div and cancelling it just for the image with a
                        calc()-based negative-margin trick - w-[calc(100%+4rem)]
                        - but Tailwind's arbitrary-value handling silently
                        drops the required space in "calc(100% + 4rem)" from
                        the generated CSS selector, so the rule never
                        actually matched the element. Moving the padding onto
                        a wrapper around just the text below, instead of
                        fighting that, sidesteps the whole problem.)
                        w-full h-auto (no object-cover) keeps the photo's own
                        aspect ratio uncropped, since it's a group shot -
                        forcing it into a fixed-height banner would cut
                        people off at the edges. */}
                    <img
                        src="/assets/onboarding-cover.jpg"
                        alt="Cast members seated at a table filming a Bulfighter episode"
                        className="w-full h-auto block"
                    />

                    <div className="p-6 sm:p-8">
                    <h3 className="head-text text-2xl">Contributor Information Sheet</h3>
                    <p className="text-white-500 text-sm mt-1">Everything you need to know before we film</p>

                    <p className="text-white-600 mt-4">
                        This sheet tells you everything you need to know before we film, so you&apos;re 100% clear on how
                        things work. This isn&apos;t a legal contract, but a form of transparency - please read it carefully.
                    </p>

                    <Section title="What's the show about?">
                        <p>
                            This is a social video series where real people <b className="text-white-800">rank or match
                            people to items from creative topics</b>, like:
                        </p>
                        <List items={CURRENT_CASTING_TOPICS} />
                        <p className="italic">
                            If you applied for one of the topics above and don&apos;t get casted for it, you&apos;ll be
                            casted for another - so rest assured, everyone will be on YouTube.
                        </p>
                        <p className="italic">
                            <b className="not-italic text-white-800">Note:</b> jokes may be made by or toward the panel or
                            contestants - all in good fun and for entertainment. Please don&apos;t take anything
                            personally, everyone is here to have a laugh and enjoy the show!
                        </p>
                        <p className="font-semibold text-white-800 pt-2">Contestants will earn:</p>
                        <List items={['Exposure from the video', 'Food and drinks will be served too']} />
                    </Section>

                    <Section title="What will I be doing?">
                        <List items={[
                            'Be filmed with other participants using phones and microphones',
                            'Share or react to creative content (e.g. screenshots, outfits, etc.)',
                            'Possibly be matched or ranked in some way based on what you shared',
                            'Ask or answer creative questions',
                        ]}
                        />
                    </Section>

                    <Section title="How will my info be used?">
                        <p>By joining the show, you agree to allow us to:</p>
                        <List items={[
                            'Record and edit your image, voice, and content',
                            'Publish the final video and clips on YouTube, Instagram, TikTok, and possibly in future brand deals, events, or compilations',
                            'Use short clips, screenshots, or quotes for trailers, promos, or teasers',
                        ]}
                        />
                    </Section>

                    <Section title="Are you under 18?">
                        <p>A <b className="text-white-800">parent/legal guardian</b> will need to come with you on the day and sign on your consent form.</p>
                    </Section>

                    <Section title="Privacy & safety">
                        <List items={[
                            'Your first name or nickname may appear on screen',
                            'No personal or sensitive data (full name, phone number, etc.) will be shown',
                        ]}
                        />
                    </Section>

                    <Section title="Questions or concerns?">
                        <p>
                            You can reach out anytime at:{' '}
                            <a href={`mailto:${ONBOARDING_CONTACT_EMAIL}`} className="link-accent">{ONBOARDING_CONTACT_EMAIL}</a>
                        </p>
                        <p className="italic">
                            Please note: once the video is edited and posted, we may not be able to remove full segments
                            or clips unless there&apos;s a legal, safety, or serious privacy concern.
                        </p>
                    </Section>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default OnboardingModal
