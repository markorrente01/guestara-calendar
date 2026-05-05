import type { Booking } from "../types"
import { formatDate } from "@/utils/dateUtils"

interface DayTooltipProps {
  date:     Date
  bookings: Booking[]
  x:        number
  y:        number
}

export function DayTooltip({ date, bookings, x, y }: DayTooltipProps) {
  const occupied = bookings.length

  return (
    <div
      className="fixed z-50 pointer-events-none w-56 rounded-xl shadow-xl border p-3"
      style={{
        left:            x + 12,
        top:             y + 12,
        backgroundColor: "var(--color-bg-surface)",
        borderColor:     "var(--color-border-default)",
        color:           "var(--color-text-primary)",
      }}
    >
      <p className="text-xs font-600 mb-2" style={{ color: "var(--color-text-muted)" }}>
        {formatDate(date)}
      </p>

      <p className="text-sm font-600 mb-2">
        {occupied} / 10 rooms occupied
      </p>

      {bookings.length === 0 ? (
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          No active bookings
        </p>
      ) : (
        <ul className="space-y-1 max-h-40 overflow-y-auto">
          {bookings.map((b) => (
            <li key={b.id} className="flex items-center justify-between text-xs">
              <span className="font-500 truncate max-w-[100px]">{b.guestName}</span>
              <span
                className="ml-2 shrink-0 font-600"
                style={{ color: "var(--color-text-muted)" }}
              >
                Rm {b.roomNumber}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}