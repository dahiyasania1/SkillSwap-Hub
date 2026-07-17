import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    text: 'text-emerald-800 dark:text-emerald-200',
    iconColor: 'text-emerald-500',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50 dark:bg-red-500/10',
    border: 'border-red-200 dark:border-red-500/20',
    text: 'text-red-800 dark:text-red-200',
    iconColor: 'text-red-500',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20',
    text: 'text-blue-800 dark:text-blue-200',
    iconColor: 'text-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20',
    text: 'text-amber-800 dark:text-amber-200',
    iconColor: 'text-amber-500',
  },
}

function Toast({ type = 'success', message, onClose, className = '' }) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        flex items-start gap-3 p-4
        rounded-xl shadow-lg
        border
        min-w-[300px] max-w-sm
        ${config.bg}
        ${config.border}
        ${className}
      `}
    >
      <Icon size={20} className={`${config.iconColor} mt-0.5 shrink-0`} />

      <p className={`text-sm font-medium flex-1 ${config.text}`}>
        {message}
      </p>

      {onClose && (
        <button
          onClick={onClose}
          className={`p-0.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer ${config.text}`}
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  )
}

export default Toast
