const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Avatar({
  src,
  alt = '',
  name,
  size = 'md',
  online,
  ring = false,
  className = '',
}) {
  const sizeClasses = sizes[size]

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`
          ${sizeClasses}
          rounded-full overflow-hidden
          flex items-center justify-center
          bg-gradient-to-br from-primary-400 to-accent-500
          ${ring ? 'ring-2 ring-white dark:ring-surface-900 ring-offset-2 ring-offset-white dark:ring-offset-surface-900' : ''}
        `}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-semibold text-white select-none">
            {getInitials(name)}
          </span>
        )}
      </div>

      {online !== undefined && (
        <span
          className={`
            absolute bottom-0 right-0
            w-3 h-3 rounded-full
            border-2 border-white dark:border-surface-900
            ${online ? 'bg-emerald-500' : 'bg-surface-300'}
          `}
        />
      )}
    </div>
  )
}

export default Avatar
