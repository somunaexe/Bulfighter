import { forwardRef } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/utils.js'

// shadcn/ui's Select shape (Radix primitives for the accessible behavior -
// keyboard nav, focus handling, portal/positioning), styled with this
// site's existing select look (border-black-300, bg-transparent) and
// animated open/close via Framer Motion instead of Radix's default CSS
// data-state animation, since forceMount + AnimatePresence is what lets
// an exit transition play before the content actually unmounts.
const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const ChevronDownIcon = (props) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12" {...props}>
        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)
const CheckIcon = (props) => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12" {...props}>
        <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const SelectTrigger = forwardRef(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            'inline-flex items-center justify-between gap-2 px-2 py-1 rounded border border-black-300 bg-transparent text-white-800 text-sm',
            'focus:outline-none focus:border-[rgb(var(--theme-accent))] data-[placeholder]:text-white-600',
            className
        )}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon>
            <ChevronDownIcon />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

const SelectContent = forwardRef(({ className, children, position = 'popper', ...props }, ref) => (
    <SelectPrimitive.Portal>
        <AnimatePresence>
            <SelectPrimitive.Content
                ref={ref}
                asChild
                forceMount
                position={position}
                sideOffset={4}
                className={cn(position === 'popper' && 'min-w-[var(--radix-select-trigger-width)]')}
                {...props}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className={cn(
                        'z-50 overflow-hidden rounded-md border border-black-300 bg-black-500 text-white-800 shadow-lg p-1',
                        className
                    )}
                >
                    <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
                </motion.div>
            </SelectPrimitive.Content>
        </AnimatePresence>
    </SelectPrimitive.Portal>
))
SelectContent.displayName = 'SelectContent'

const SelectItem = forwardRef(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex items-center gap-2 rounded px-2 py-1.5 text-sm cursor-pointer select-none',
            'data-[highlighted]:bg-[rgb(var(--theme-accent))] data-[highlighted]:text-white data-[highlighted]:outline-none',
            className
        )}
        {...props}
    >
        <span className="w-3">
            <SelectPrimitive.ItemIndicator>
                <CheckIcon />
            </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
))
SelectItem.displayName = 'SelectItem'

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem }
