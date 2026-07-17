const variants = {
  default:
    'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300',
  primary:
    'bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400',
  success:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  warning:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  danger:
    'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  accent:
    'bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-400',
}

const dotColors = {
  default: 'bg-surface-400',
  primary: 'bg-primary-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  accent: 'bg-accent-500',
}

function Badge({
  variant = 'default',
  dot = false,
  className = '',
  children,
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-2.5 py-0.5
        text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  )
}

export default Badge
