interface CardProps {
  children:  React.ReactNode
  className?: string
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border p-4 ${className}`}
      style={{
        backgroundColor: "var(--color-bg-surface)",
        borderColor:     "var(--color-border-default)",
      }}
    >
      {children}
    </div>
  )
}