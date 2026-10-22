import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import CookieNotice from '../components/CookieNotice.jsx'
import { navLinks } from '../constants/index.js'
import { ONBOARDING_CONTACT_EMAIL } from '../constants/onboarding.js'

const Section = ({ title, id, children }) => (
    <div id={id} className="mt-8 first:mt-0 scroll-mt-24">
        <h2 className="text-xl font-semibold text-white-800 mb-3">{title}</h2>
        <div className="text-white-600 space-y-3 leading-relaxed">{children}</div>
    </div>
)

// Reviewed by an external data-protection expert (see the project's internal
// edit notes) - this section structure and legal-basis language (contract /
// legitimate interests for casting and filming, consent only for separate
// optional uses like allergy data) reflects that review.
const Privacy = () => {
    return (
        <main className="max-w-7xl mx-auto min-h-screen flex flex-col">
            <Navbar navLinks={navLinks} />

            <section className="c-space pt-24 pb-16 flex-1">
                <div className="max-w-3xl mx-auto">
                    <h1 className="head-text text-3xl sm:text-4xl mb-2">Privacy Policy</h1>
                    <p className="text-white-500 text-sm mb-8">Last updated 21 October 2026</p>

                    <Section title="Who we are">
                        <p>
                            This policy covers Bulfighter (&quot;we&quot;, &quot;us&quot;), a social video series
                            trading under the name Bulfighter. We are the data controller responsible for how your
                            personal information is collected and used. For any privacy question or request, contact
                            us at{' '}
                            <a href={`mailto:${ONBOARDING_CONTACT_EMAIL}`} className="link-accent">{ONBOARDING_CONTACT_EMAIL}</a>.
                        </p>
                    </Section>

                    <Section title="What we collect">
                        <p>If you apply to join a show via our &quot;Join Us&quot; form, we collect:</p>
                        <ul className="list-disc list-outside pl-5 space-y-1">
                            <li>Your full name, preferred/display name, age, email address, phone number, and social media handle</li>
                            <li>Any screenshots or files you choose to upload for the topic you&apos;re applying for (e.g. a food order history or Spotify Wrapped)</li>
                        </ul>
                        <p>
                            Food order screenshots can contain more than we need - a home address, a partial card
                            number, other people&apos;s names. The form asks you to crop those out before uploading,
                            but please double-check your screenshots yourself before sending them; we only need the
                            order itself.
                        </p>
                        <p>
                            We only ask about allergies once you&apos;re selected, on the separate consent-to-shoot
                            form, so we can cater food and drinks safely - alongside confirming your other details
                            again, plus, if you&apos;re under 18, your parent or legal guardian&apos;s name, age,
                            email, phone number, and allergies.
                        </p>
                        <p>
                            If you actually appear on camera, we record your image, voice, and whatever you share or say
                            during filming.
                        </p>
                        <p>
                            This site also remembers your light/dark theme preference in your browser&apos;s local
                            storage. We do not use analytics, advertising, or tracking cookies of our own - if that
                            ever changes, we&apos;ll update this policy first. See &quot;Cookies and embedded
                            video&quot; below for the one piece of third-party content this site does load.
                        </p>
                    </Section>

                    <Section title="How and why we use your information">
                        <p>We use your information to organise, produce, and promote our videos.</p>
                        <p>
                            <strong>Applications and filming arrangements.</strong> We use your application
                            information to select participants, contact you about casting decisions, and organise
                            filming. We rely on our legitimate interests in managing applications and casting,
                            provided these do not outweigh your rights.
                        </p>
                        <p>
                            <strong>Participation and agreed use of footage.</strong> If you are selected, we use your
                            information to carry out our participation agreement with you (your signed
                            consent-to-shoot form). This includes recording, editing, and publishing your
                            contribution to the agreed video.
                        </p>
                        <p>
                            <strong>Optional uses.</strong> Where we ask for your consent to an additional, optional
                            use of your information - such as using your allergy information to cater food and
                            drinks safely - you can withdraw that consent at any time by contacting us.
                        </p>
                    </Section>

                    <Section title="Recording and publishing videos">
                        <p>
                            Before filming, we give selected participants a participation agreement
                            (consent-to-shoot form) explaining what taking part involves and how their recordings
                            will be used.
                        </p>
                        <p>
                            We may record your image, voice, and contributions, and edit them into videos, highlights,
                            and agreed promotional clips. These are typically published on YouTube and may also be
                            published on our other social media platforms. Where recording, editing, and publication
                            are necessary to carry out a valid participation agreement with you, we rely on that
                            agreement as our legal basis.
                        </p>
                        <p>
                            If you withdraw consent for a separate, optional use, we will stop that use. This does not
                            automatically end uses that were clearly identified from the outset as necessary to carry
                            out your participation agreement - your rights under data protection law still apply
                            regardless.
                        </p>
                        <p>
                            Once published, videos may be viewed, shared, or downloaded by others, including people
                            outside the UK. We cannot guarantee the removal of copies independently shared or
                            downloaded by other people.
                        </p>
                    </Section>

                    <Section title="If you're under 18">
                        <p>
                            If you are under 18, your parent or legal guardian must give permission for you to take
                            part, by signing a parental consent-to-shoot form. They must also attend filming with you
                            and bring photo ID to confirm their identity.
                        </p>
                        <p>
                            Before filming, we will explain to you and your parent or guardian what participation
                            involves and how your footage will be used.
                        </p>
                        <p>
                            We only ever show a minor&apos;s first name or nickname on screen - never their full name,
                            phone number, or other contact details. We take additional care with children&apos;s
                            personal information, considering their privacy and safety when recording, editing, and
                            publishing videos.
                        </p>
                    </Section>

                    <Section id="cookies" title="Cookies and embedded video">
                        <p>
                            This site does not set its own analytics, advertising, or tracking cookies. The only
                            cookie-setting third-party content is video: clip pages can embed YouTube videos, and
                            YouTube (owned by Google) may set its own cookies when a video actually loads and plays.
                        </p>
                        <ul className="list-disc list-outside pl-5 space-y-1">
                            <li>Videos don&apos;t load until you press play - simply visiting a page never triggers them.</li>
                            <li>We embed YouTube&apos;s privacy-enhanced domain (<code>youtube-nocookie.com</code>), which YouTube states won&apos;t store identifying cookies for views unless you interact with the player.</li>
                            <li>If you&apos;d rather avoid this entirely, don&apos;t press play on embedded videos - you can always watch the same video directly on YouTube instead.</li>
                        </ul>
                        <p>
                            Your light/dark theme choice is stored in your browser&apos;s local storage, not a cookie -
                            it never leaves your device and we never read it.
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
                            Published video content isn&apos;t on an automatic deletion schedule - see &quot;Requests
                            about published videos&quot; below for what that means in practice.
                        </p>
                    </Section>

                    <Section title="Your rights">
                        <p>
                            You have rights over your personal information under data protection law. Depending on
                            the circumstances, you can ask us to:
                        </p>
                        <ul className="list-disc list-outside pl-5 space-y-1">
                            <li>Give you access to your information.</li>
                            <li>Correct inaccurate information.</li>
                            <li>Delete information or restrict how we use it.</li>
                            <li>Stop certain uses of your information.</li>
                            <li>Provide certain information in a portable format.</li>
                        </ul>
                        <p>
                            Where we rely on consent, you can withdraw it at any time. This does not affect anything
                            we lawfully did before you withdrew it.
                        </p>
                        <p>
                            If you have any concern about how we use your personal information, or if you wish to
                            exercise your rights, please email{' '}
                            <a href={`mailto:${ONBOARDING_CONTACT_EMAIL}`} className="link-accent">{ONBOARDING_CONTACT_EMAIL}</a>.
                            You also have the right to complain to the UK Information Commissioner&apos;s Office at{' '}
                            <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="link-accent">ico.org.uk</a>.
                        </p>
                    </Section>

                    <Section title="Requests about published videos">
                        <p>
                            You can contact us to request that footage containing your personal information be
                            removed or changed.
                        </p>
                        <p>
                            We will consider your request under data protection law, taking account of your
                            circumstances, the reason we use the footage, and any applicable exemptions. These rights
                            are not absolute, so a request will not always result in removal.
                        </p>
                        <p>
                            We may be unable to retrieve copies independently shared or downloaded by others. However,
                            we will still consider your request and take any steps required by law for content under
                            our control.
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
            <CookieNotice />
        </main>
    )
}

export default Privacy
