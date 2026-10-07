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

const Terms = () => {
    return (
        <main className="max-w-7xl mx-auto min-h-screen flex flex-col">
            <Navbar navLinks={navLinks} />

            <section className="c-space pt-24 pb-16 flex-1">
                <div className="max-w-3xl mx-auto">
                    <h1 className="head-text text-3xl sm:text-4xl mb-2">Terms &amp; Conditions</h1>
                    <p className="text-white-500 text-sm mb-8">Last updated 7 October 2026</p>

                    <Section title="Agreement to these terms">
                        <p>
                            By using this site or applying to join Bulfighter, you agree to these terms. If you
                            don&apos;t agree, please don&apos;t use the site or submit an application.
                        </p>
                    </Section>

                    <Section title="What Bulfighter is">
                        <p>
                            Bulfighter is a social video series where real people are filmed taking part in creative
                            topics, published as videos and clips on YouTube, Instagram, and TikTok.
                        </p>
                    </Section>

                    <Section title="Who can apply">
                        <p>
                            Anyone can apply via the &quot;Join Us&quot; form. If you&apos;re under 18, a parent or
                            legal guardian must consent on your behalf and attend filming with you in person, bringing
                            photo ID to confirm their identity.
                        </p>
                    </Section>

                    <Section title="Applications and casting">
                        <p>
                            Submitting an application doesn&apos;t guarantee you&apos;ll be cast. We may cast you for a
                            different topic than the one you applied for. Giving false information on an application or
                            consent form - including misstating your age - may get you removed from consideration or
                            from an episode.
                        </p>
                    </Section>

                    <Section title="Content you appear in">
                        <p>
                            If you&apos;re cast, you agree that we may record your image, voice, and whatever you share
                            or say on the day, and edit and publish the result - including short clips, screenshots, or
                            quotes used for trailers, promos, or teasers - on YouTube, Instagram, TikTok, and in
                            connection with future brand deals, events, or compilations.
                        </p>
                        <p>
                            This is a condition of appearing on the show, confirmed when you complete the
                            consent-to-shoot form.
                        </p>
                    </Section>

                    <Section title="It's entertainment">
                        <p>
                            Bulfighter is entertainment. Jokes made by or toward the panel or contestants are all in
                            good fun and not intended as statements of fact about anyone. Participants are expected to
                            treat each other respectfully regardless.
                        </p>
                    </Section>

                    <Section title="Conduct">
                        <p>
                            We may decline to cast, or remove, anyone whose conduct is illegal, unsafe, or harassing
                            toward cast, crew, or other participants.
                        </p>
                    </Section>

                    <Section title="Ownership">
                        <p>
                            Bulfighter&apos;s name, branding, and published videos belong to us. You keep ownership of
                            anything you made before appearing on the show (e.g. your own social media posts), but the
                            license in &quot;Content you appear in&quot; above still applies to what we film and
                            publish.
                        </p>
                    </Section>

                    <Section title="No warranties">
                        <p>
                            This site and the show are provided &quot;as is&quot;, without warranties of any kind, to
                            the fullest extent the law allows.
                        </p>
                    </Section>

                    <Section title="Limitation of liability">
                        <p>
                            To the fullest extent the law allows, Bulfighter isn&apos;t liable for indirect or
                            consequential losses arising from your use of this site or participation in the show.
                            Nothing here limits liability that can&apos;t legally be limited, such as for death,
                            personal injury caused by negligence, or fraud.
                        </p>
                    </Section>

                    <Section title="Ending participation">
                        <p>
                            We can decline or withdraw a casting at any time, for any legitimate reason, including
                            before filming or before a video is published.
                        </p>
                    </Section>

                    <Section title="Governing law">
                        <p>
                            These terms are governed by the laws of England and Wales, and any dispute will be subject
                            to the exclusive jurisdiction of the courts of England and Wales.
                        </p>
                    </Section>

                    <Section title="Changes to these terms">
                        <p>
                            We may update these terms as the show or our practices change. We&apos;ll update the date
                            above whenever we do.
                        </p>
                    </Section>

                    <Section title="Contact">
                        <p>
                            Questions about these terms? Email us at{' '}
                            <a href={`mailto:${ONBOARDING_CONTACT_EMAIL}`} className="link-accent">{ONBOARDING_CONTACT_EMAIL}</a>.
                        </p>
                    </Section>
                </div>
            </section>

            <Footer />
        </main>
    )
}

export default Terms
