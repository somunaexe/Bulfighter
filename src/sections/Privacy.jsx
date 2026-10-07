import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import { navLinks } from '../constants/index.js'
import { ONBOARDING_CONTACT_EMAIL } from '../constants/onboarding.js'

const Section = ({ title, children }) => (
    <div className="mt-8 first:mt-0">
        <h2 className="text-xl font-semibold text-white-800 mb-3">{title}</h2>
        <div className="text-white-600 space-y-3 leading-relaxed">{children}</div>
    </div>
)

// Mirrors exactly what OnboardingModal.jsx already tells applicants (same
// promises, same caveats) and exactly what Contact.jsx/ConsentForm.jsx
// actually collect - this page describes real data flows in the codebase,
// not generic placeholder legal text.
const Privacy = () => {
    return (
        <main className="max-w-7xl mx-auto min-h-screen flex flex-col">
            <Navbar navLinks={navLinks} />

            <section className="c-space pt-24 pb-16 flex-1">
                <div className="max-w-3xl mx-auto">
                    <h1 className="head-text text-3xl sm:text-4xl mb-2">Privacy Policy</h1>
                    <p className="text-white-500 text-sm mb-8">Last updated 7 October 2026</p>

                    <Section title="Who we are">
                        <p>
                            This policy covers Bulfighter (&quot;we&quot;, &quot;us&quot;), a social video series. For any
                            privacy question or request, contact us at{' '}
                            <a href={`mailto:${ONBOARDING_CONTACT_EMAIL}`} className="link-accent">{ONBOARDING_CONTACT_EMAIL}</a>.
                        </p>
                    </Section>

                    <Section title="What we collect">
                        <p>If you apply to join a show via our &quot;Join Us&quot; form, we collect:</p>
                        <ul className="list-disc list-outside pl-5 space-y-1">
                            <li>Your full name, preferred/display name, age, email address, phone number, and social media handle</li>
                            <li>Any allergies you tell us about, so we can cater food and drinks safely</li>
                            <li>Any screenshots or files you choose to upload for the topic you&apos;re applying for (e.g. a food order history or Spotify Wrapped)</li>
                        </ul>
                        <p>
                            If you&apos;re selected and complete the separate consent-to-shoot form, we collect the same
                            details again to confirm them, plus - if you&apos;re under 18 - your parent or legal
                            guardian&apos;s name, age, email, phone number, and allergies.
                        </p>
                        <p>
                            If you actually appear on camera, we record your image, voice, and whatever you share or say
                            during filming.
                        </p>
                        <p>
                            This site also remembers your light/dark theme preference in your browser&apos;s local
                            storage. We do not currently use analytics, advertising, or tracking cookies - if that ever
                            changes, we&apos;ll update this policy first.
                        </p>
                    </Section>

                    <Section title="How we use it">
                        <ul className="list-disc list-outside pl-5 space-y-1">
                            <li>To review applications and decide who to cast</li>
                            <li>To contact you about your application or casting</li>
                            <li>To accommodate allergies when food and drinks are served on the day</li>
                            <li>To verify a parent/guardian&apos;s consent when a participant is under 18</li>
                            <li>To record, edit, and publish the resulting video and clips</li>
                        </ul>
                    </Section>

                    <Section title="Our legal basis for processing">
                        <p>
                            We process your application and casting details on the basis of your consent. Allergy
                            information is health-related data, so we only collect and use it with your explicit
                            consent, and solely to keep you safe around food on set - never for any other purpose.
                        </p>
                    </Section>

                    <Section title="If you're under 18">
                        <p>
                            A parent or legal guardian must consent on your behalf and attend filming with you, bringing
                            photo ID to confirm their identity. We only ever show a minor&apos;s first name or nickname
                            on screen - never their full name, phone number, or other contact details.
                        </p>
                    </Section>

                    <Section title="Sharing and international transfers">
                        <p>
                            We don&apos;t sell personal data. Published content appears on YouTube, Instagram, and
                            TikTok, each governed by that platform&apos;s own privacy practices. Application and
                            consent data is stored using cloud infrastructure (Google Firebase) that may process data
                            outside the UK/EEA, under that provider&apos;s standard data-protection safeguards.
                        </p>
                    </Section>

                    <Section title="How long we keep it">
                        <p>
                            We keep application and consent details for as long as reasonably needed to run the casting
                            process, respond to you, and meet any legal obligations, then delete or anonymise them.
                            Published video content isn&apos;t on an automatic deletion schedule - see &quot;Your
                            rights&quot; below for what that means in practice.
                        </p>
                    </Section>

                    <Section title="Your rights">
                        <p>
                            You can ask us to access, correct, delete, or restrict your personal data, object to how
                            we&apos;re using it, or withdraw consent at any time, by emailing{' '}
                            <a href={`mailto:${ONBOARDING_CONTACT_EMAIL}`} className="link-accent">{ONBOARDING_CONTACT_EMAIL}</a>.
                            You can also complain to the UK Information Commissioner&apos;s Office (
                            <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="link-accent">ico.org.uk</a>
                            ).
                        </p>
                        <p>
                            One honest limit: once a video is edited and published, we may not be able to remove an
                            entire segment or clip unless there&apos;s a legal, safety, or serious privacy concern -
                            the same thing we tell every applicant before they&apos;re cast.
                        </p>
                    </Section>

                    <Section title="Security">
                        <p>
                            We take reasonable technical and organisational steps to protect your information, but no
                            method of storage or transmission is 100% secure.
                        </p>
                    </Section>

                    <Section title="Changes to this policy">
                        <p>
                            We may update this policy as the show or our practices change. We&apos;ll update the date
                            above whenever we do.
                        </p>
                    </Section>
                </div>
            </section>

            <Footer />
        </main>
    )
}

export default Privacy
