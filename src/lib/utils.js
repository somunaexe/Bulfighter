import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// shadcn/ui's standard class-merging helper: clsx resolves conditional
// classes, tailwind-merge then drops earlier conflicting Tailwind classes
// instead of leaving both in the string (e.g. a caller's own `px-6`
// overriding a variant's `px-4` instead of fighting it at the same
// specificity).
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}
