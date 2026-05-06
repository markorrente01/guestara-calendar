interface TooltipProps {
  children: React.ReactNode
  x:        number
  y:        number
}

export function Tooltip({ children, x, y }: TooltipProps) {
  return (
    <div
      className="fixed z-50 pointer-events-none rounded-xl shadow-xl border p-3"
      style={{
        left:            x + 12,
        top:             y + 12,
        backgroundColor: "var(--color-bg-surface)",
        borderColor:     "var(--color-border-default)",
      }}
    >
      {children}
    </div>
  )
}