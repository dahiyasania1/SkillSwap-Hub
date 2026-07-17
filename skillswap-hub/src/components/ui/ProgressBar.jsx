import { motion } from 'framer-motion'

const sizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  color,
  label,
  showPercentage = false,
  className = '',
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-surface-500 dark:text-surface-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`
          w-full rounded-full overflow-hidden
          bg-surface-100 dark:bg-surface-800
          ${sizes[size]}
        `}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`
            h-full rounded-full
            ${color || 'bg-gradient-to-r from-primary-500 to-accent-500'}
          `}
        />
      </div>
    </div>
  )
}

export default ProgressBar
