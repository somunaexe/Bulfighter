// MOCK DATA - placeholder equipment/rates for building the page's structure
// before real inventory numbers are ready. Replace freely; every field here
// is what the public Rentals page and the rental request Lambda expect, so
// adding/removing/editing an item is just editing this array - no other
// file needs to change.
export const EQUIPMENT_CATALOG = [
    {
        id: 'sony-fx3',
        category: 'Cameras',
        name: 'Sony FX3 Cinema Camera Kit',
        description: 'Full-frame cinema camera, includes 2 batteries, 128GB CFexpress card, and shoulder rig.',
        dailyRate: 80,
        weeklyRate: 450,
    },
    {
        id: 'canon-r5',
        category: 'Cameras',
        name: 'Canon EOS R5 Mirrorless Kit',
        description: 'Includes RF 24-70mm f/2.8 lens and 2 batteries.',
        dailyRate: 65,
        weeklyRate: 350,
    },
    {
        id: 'aputure-300d',
        category: 'Lighting',
        name: 'Aputure 300D II Light Kit',
        description: 'Two 300D II LEDs with stands and softboxes.',
        dailyRate: 50,
        weeklyRate: 280,
    },
    {
        id: 'godox-ad200pro',
        category: 'Lighting',
        name: 'Godox AD200Pro Flash Kit',
        description: 'Two strobes with light stands and modifiers.',
        dailyRate: 35,
        weeklyRate: 180,
    },
    {
        id: 'rode-wireless-go-ii',
        category: 'Audio',
        name: 'Rode Wireless GO II Dual Mic System',
        description: 'Two transmitters, one receiver - clips onto talent, no cables.',
        dailyRate: 25,
        weeklyRate: 120,
    },
    {
        id: 'zoom-h6',
        category: 'Audio',
        name: 'Zoom H6 Audio Recorder',
        description: '6-track handheld recorder with windscreen.',
        dailyRate: 20,
        weeklyRate: 100,
    },
    {
        id: 'dji-rs3-pro',
        category: 'Grip & Support',
        name: 'DJI RS 3 Pro Gimbal Stabilizer',
        description: '3-axis gimbal, supports payloads up to 4.5kg.',
        dailyRate: 40,
        weeklyRate: 220,
    },
    {
        id: 'manfrotto-tripod-slider',
        category: 'Grip & Support',
        name: 'Manfrotto Tripod & Slider Kit',
        description: 'Fluid head tripod plus a 1m camera slider.',
        dailyRate: 20,
        weeklyRate: 100,
    },
]

// MOCK DATA - placeholder policy numbers. These feed both the policy text
// on the page AND the values shown to a renter while filling the form, so
// changing a number here updates everywhere it's mentioned at once.
export const RENTAL_POLICY = {
    // Percentage of the rental subtotal charged as a refundable deposit,
    // held until the equipment is returned and checked.
    depositPercent: 30,

    // Cancellation refund tiers, checked in order against how far ahead of
    // the pickup date/time the renter cancels.
    cancellationTiers: [
        { hoursBeforePickup: 72, refundPercent: 100 },
        { hoursBeforePickup: 24, refundPercent: 50 },
        { hoursBeforePickup: 0, refundPercent: 0 },
    ],

    // Multiplier applied to an item's daily rate for each day it's returned
    // late (e.g. 1.5 = 150% of the normal daily rate, per item, per day).
    lateFeeMultiplier: 1.5,

    minimumRentalDays: 1,

    contactEmail: 'bulfighter.exe@gmail.com',
}
