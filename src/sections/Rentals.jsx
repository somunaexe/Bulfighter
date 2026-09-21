import { useMemo, useState } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import { navLinks } from '../constants/index.js'
import { EQUIPMENT_CATALOG, RENTAL_POLICY } from '../constants/rentals.js'
import { submitRentalRequest } from '../api/equipmentRentals.js'

const MS_PER_DAY = 1000 * 60 * 60 * 24

// Groups the flat catalog array into { category: [items] } for rendering
// as separate labeled sections, in whatever order categories first appear
// in EQUIPMENT_CATALOG - so reordering/adding a category there is enough,
// nothing here needs to change.
const groupByCategory = (items) => {
    const groups = new Map()
    for (const item of items) {
        if (!groups.has(item.category)) groups.set(item.category, [])
        groups.get(item.category).push(item)
    }
    return groups
}

// How many days a start/end date pair covers, floored at the policy's
// minimum - used both for the live quote below and for the actual
// submitted request.
const rentalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    const diff = Math.ceil((new Date(endDate) - new Date(startDate)) / MS_PER_DAY)
    return Math.max(RENTAL_POLICY.minimumRentalDays, diff)
}

// Whole weeks at the item's weekly rate plus any remaining days at the
// daily rate - e.g. 9 days = 1 week + 2 days, not 9x the daily rate.
const itemCost = (item, days) => {
    const weeks = Math.floor(days / 7)
    const remainder = days % 7
    return weeks * item.weeklyRate + remainder * item.dailyRate
}

const money = (amount) => `$${amount.toFixed(2)}`

const EquipmentCard = ({ item, selected, onToggle }) => (
    <label
        className={`
            flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors
            ${selected ? 'border-[rgb(var(--theme-accent))] bg-black-300' : 'border-black-500 bg-black-300/50 hover:bg-black-300'}
        `}
    >
        <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle(item.id)}
            className="mt-1 w-5 h-5 shrink-0 accent-[rgb(var(--theme-accent))]"
        />
        <div>
            <p className="font-semibold text-white-800">{item.name}</p>
            <p className="text-white-600 text-sm mt-1">{item.description}</p>
            <p className="text-white-800 text-sm font-semibold mt-2">
                {money(item.dailyRate)}/day &middot; {money(item.weeklyRate)}/week
            </p>
        </div>
    </label>
)

const PolicyItem = ({ title, children }) => (
    <div>
        <p className="font-semibold text-white-800">{title}</p>
        <div className="text-white-600 mt-1 space-y-1">{children}</div>
    </div>
)

const Rentals = () => {
    const [selectedIds, setSelectedIds] = useState(() => new Set())
    const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', startDate: '', endDate: '', notes: '' })
    const [agreedToPolicy, setAgreedToPolicy] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState(null)

    const categories = useMemo(() => groupByCategory(EQUIPMENT_CATALOG), [])
    const selectedItems = EQUIPMENT_CATALOG.filter((item) => selectedIds.has(item.id))
    const days = rentalDays(form.startDate, form.endDate)
    const subtotal = days > 0 ? selectedItems.reduce((sum, item) => sum + itemCost(item, days), 0) : 0
    const deposit = subtotal * (RENTAL_POLICY.depositPercent / 100)

    const toggleItem = (id) => {
        setSelectedIds((current) => {
            const next = new Set(current)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const handleChange = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }))

    const canSubmit = selectedItems.length > 0
        && form.fullName && form.email && form.phoneNumber && form.startDate && form.endDate
        && days > 0 && agreedToPolicy && !submitting

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!canSubmit) return

        setSubmitting(true)
        setResult(null)
        try {
            const data = await submitRentalRequest({
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phoneNumber: form.phoneNumber.trim(),
                equipmentIds: [...selectedIds],
                startDate: form.startDate,
                endDate: form.endDate,
                notes: form.notes.trim(),
                agreedToPolicy,
            })
            setResult({ ok: true, message: data.message || 'Request submitted!' })
            setSelectedIds(new Set())
            setForm({ fullName: '', email: '', phoneNumber: '', startDate: '', endDate: '', notes: '' })
            setAgreedToPolicy(false)
        } catch {
            setResult({ ok: false, message: "Something went wrong submitting your request. Please try again or email us directly." })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="max-w-7xl mx-auto min-h-screen flex flex-col">
            <Navbar navLinks={navLinks} />

            {/* flex-1: same sticky-footer-on-short-pages pattern used on
                every other page - see Footer.jsx's own comments for why. */}
            <section className="c-space pt-24 pb-16 flex-1">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="head-text text-3xl sm:text-4xl">Rent Studio Equipment</h1>
                    <p className="text-white-600 mt-4 text-lg">
                        Cameras, lighting, audio, and grip gear available to rent for your own shoots. Select what you
                        need below, then submit a request - we&apos;ll confirm availability and follow up to arrange
                        pickup and payment.
                    </p>
                </div>

                {/* Catalog, grouped by category */}
                <div className="space-y-10">
                    {[...categories.entries()].map(([category, items]) => (
                        <div key={category}>
                            <h2 className="text-2xl font-semibold text-white-800 mb-4">{category}</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {items.map((item) => (
                                    <EquipmentCard
                                        key={item.id}
                                        item={item}
                                        selected={selectedIds.has(item.id)}
                                        onToggle={toggleItem}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Policies - id="rental-policy" so the form's checkbox below
                    can link straight to it instead of duplicating this text
                    or opening a separate modal, since it's already right
                    here on the same page. */}
                <div id="rental-policy" className="surface-card p-6 sm:p-8 mt-12 scroll-mt-24">
                    <h2 className="text-2xl font-semibold text-white-800 mb-4">Rental Policies</h2>
                    <div className="space-y-4">
                        <PolicyItem title="Rates">
                            <p>Daily and weekly rates are listed with each item above. Renting for 7+ days automatically applies the cheaper weekly rate for those days.</p>
                        </PolicyItem>

                        <PolicyItem title="Security deposit">
                            <p>
                                A refundable deposit of <b className="text-white-800">{RENTAL_POLICY.depositPercent}% of your rental subtotal</b> is
                                required to confirm a booking. It&apos;s held until the equipment is returned and checked, and refunded
                                within 3 business days if everything comes back on time and undamaged.
                            </p>
                        </PolicyItem>

                        <PolicyItem title="Cancellations & refunds">
                            <ul className="list-disc list-outside pl-5 space-y-1">
                                {RENTAL_POLICY.cancellationTiers.map((tier) => (
                                    <li key={tier.hoursBeforePickup}>
                                        {tier.refundPercent}% refund if cancelled {tier.hoursBeforePickup > 0 ? `${tier.hoursBeforePickup}+ hours before pickup` : 'less than 24 hours before pickup, or for a no-show'}
                                    </li>
                                ))}
                            </ul>
                        </PolicyItem>

                        <PolicyItem title="Late returns">
                            <p>Equipment returned late is charged {Math.round(RENTAL_POLICY.lateFeeMultiplier * 100)}% of the daily rate, per item, per day late.</p>
                        </PolicyItem>

                        <PolicyItem title="Damage & loss">
                            <p>
                                Your deposit covers minor damage up to its value. Repair or replacement costs beyond the deposit
                                amount are the renter&apos;s responsibility. Please inspect equipment at pickup and report any
                                pre-existing damage immediately.
                            </p>
                        </PolicyItem>

                        <PolicyItem title="Pickup requirements">
                            <p>A valid government-issued ID and a signed rental agreement are required at pickup. Equipment must be returned in the condition it was issued, at the agreed time.</p>
                        </PolicyItem>

                        <PolicyItem title="Questions?">
                            <p>Reach out anytime at <a href={`mailto:${RENTAL_POLICY.contactEmail}`} className="link-accent">{RENTAL_POLICY.contactEmail}</a>.</p>
                        </PolicyItem>
                    </div>
                </div>

                {/* Request form */}
                <div className="surface-card p-6 sm:p-8 mt-8">
                    <h2 className="text-2xl font-semibold text-white-800 mb-6">Request to Rent</h2>

                    {result && (
                        <p className={`mb-6 font-semibold ${result.ok ? 'text-green-500' : 'text-red-500'}`}>{result.message}</p>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                        <div>
                            <p className="field-label mb-2">Selected equipment</p>
                            {selectedItems.length === 0 ? (
                                <p className="text-white-600">None yet - tick items above to add them to your request.</p>
                            ) : (
                                <ul className="text-white-600 list-disc list-outside pl-5">
                                    {selectedItems.map((item) => <li key={item.id}>{item.name}</li>)}
                                </ul>
                            )}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <label className="space-y-3">
                                <p className="field-label">Full Name <span className="text-red-500">*</span></p>
                                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required
                                    className="field-input" placeholder="ex., John Doe"
                                />
                            </label>

                            <label className="space-y-3">
                                <p className="field-label">Email address <span className="text-red-500">*</span></p>
                                <input type="email" name="email" value={form.email} onChange={handleChange} required
                                    className="field-input" placeholder="ex., johndoe@gmail.com"
                                />
                            </label>

                            <label className="space-y-3">
                                <p className="field-label">Phone Number <span className="text-red-500">*</span></p>
                                <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required
                                    className="field-input" placeholder="ex., +44 1234 1234"
                                />
                            </label>

                            <div />

                            <label className="space-y-3">
                                <p className="field-label">Pickup date <span className="text-red-500">*</span></p>
                                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="field-input" />
                            </label>

                            <label className="space-y-3">
                                <p className="field-label">Return date <span className="text-red-500">*</span></p>
                                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required className="field-input" />
                            </label>
                        </div>

                        <label className="space-y-3">
                            <p className="field-label">Notes</p>
                            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                                className="field-input" placeholder="Anything else we should know?"
                            />
                        </label>

                        {/* Live quote - only appears once there's enough info to compute one */}
                        {selectedItems.length > 0 && days > 0 && (
                            <div className="rounded-lg border border-black-500 p-4 space-y-1">
                                <p className="text-white-600">Estimated rental ({days} day{days === 1 ? '' : 's'}): <span className="text-white-800 font-semibold">{money(subtotal)}</span></p>
                                <p className="text-white-600">Deposit due to confirm ({RENTAL_POLICY.depositPercent}%): <span className="text-white-800 font-semibold">{money(deposit)}</span></p>
                                <p className="text-white-500 text-sm">Final total is confirmed when we follow up - this is an estimate based on the rates above.</p>
                            </div>
                        )}

                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={agreedToPolicy}
                                onChange={(e) => setAgreedToPolicy(e.target.checked)}
                                required
                                className="mt-1 w-5 h-5 shrink-0 accent-[rgb(var(--theme-accent))]"
                            />
                            <span className="text-white-600">
                                I have read and agree to the <a href="#rental-policy" className="link-accent">rental policies</a> above,
                                including the deposit, cancellation, and late/damage fee terms. <span className="text-red-500">*</span>
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="field-btn hover:bg-[rgb(var(--theme-accent))] disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            {submitting ? 'Sending...' : 'Submit Request'}
                            <img src="/assets/arrow-up.png" alt="" className="field-btn_arrow" />
                        </button>
                    </form>
                </div>
            </section>

            <Footer />
        </main>
    )
}

export default Rentals
