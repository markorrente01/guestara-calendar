interface SpinnerProps {
  size?: number
}

export function Spinner({ size = 24 }: SpinnerProps) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-t-transparent"
      style={{
        width:       size,
        height:      size,
        borderColor: "var(--color-brand-accent)",
        borderTopColor: "transparent",
      }}
    />
  )
}