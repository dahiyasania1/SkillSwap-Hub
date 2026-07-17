import { forwardRef } from 'react'

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const Card = forwardRef(function Card(
  {
    padding = 'md',
    hover = false,
    onClick,
    className = '',
    children,
    ...props
  },
  ref
) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      ref={ref}
      onClick={onClick}
      className={`
        bg-white dark:bg-surface-900
        rounded-2xl shadow-sm
        border border-surface-100 dark:border-surface-800
        ${hover ? 'card-hover' : ''}
        ${onClick ? 'cursor-pointer text-left w-full' : ''}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  )
})

export default Card
