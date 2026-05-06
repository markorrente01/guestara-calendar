import { CalendarX } from "lucide-react"

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = "Select a date or drag a range to see bookings" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <CalendarX size={36} style={{ color: "var(--color-text-muted)" }} />
      <p
        className="text-sm text-center max-w-[200px] leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        {message}
      </p>
    </div>
  )
}