import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { motion } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'

// shadcn/ui's Button shape (cva variants + asChild via Slot), styled with
// this site's own tokens (field-btn's look, --theme-accent) instead of a
// separate shadcn color palette - there's only ever one button style
// system on this site. whileTap/whileHover are baked in here rather than
// added per-call-site, so every button that uses this component gets the
// same press feedback for free.
const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-black-500 text-white-800 hover:bg-[rgb(var(--theme-accent))] hover:text-white',
                outline: 'bg-transparent border border-black-300 text-white-800 hover:bg-[rgb(var(--theme-accent))] hover:text-white',
                destructive: 'bg-black-500 text-white-800 hover:bg-red-500 hover:text-white',
                accent: 'bg-[rgb(var(--theme-accent))] text-white',
            },
            size: {
                default: 'px-5 py-2 min-h-12',
                sm: 'px-3 py-1.5 min-h-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

const MotionSlot = motion.create(Slot)
const MotionButton = motion.create('button')

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? MotionSlot : MotionButton
    return (
        <Comp
            ref={ref}
            className={cn(buttonVariants({ variant, size }), className)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.12 }}
            {...props}
        />
    )
})
Button.displayName = 'Button'

export { Button, buttonVariants }
