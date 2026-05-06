import type { Booking } from "../types"
import { getBookingNights } from "../actions"
import { formatDate, parseLocalDate } from "@/utils/dateUtils"

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  confirmed:    { bg: "#EFF6FF", text: "#2563eb", label: "Confirmed"    },
  checked_in:   { bg: "#F0FDF4", text: "#16a34a", label: "Checked In"   },
  checked_out:  { bg: "#FAF5FF", text: "#9333ea", label: "Checked Out"  },
  cancelled:    { bg: "#FEF2F2", text: "#dc2626", label: "Cancelled"    },
}

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  const nights = getBookingNights(booking)
  const style  = STATUS_STYLES[booking.status]

  return (
    <div
      className="rounded-xl border p-4 space-y-3 transition-shadow hover:shadow-sm"
      style={{
        borderColor:     "var(--color-border-default)",
        backgroundColor: "var(--color-bg-surface)",
      }}
    >
      {/* Top row — guest name + status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-600 text-sm leading-tight">
            {booking.guestName}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {booking.id} · {booking.source}
          </p>
        </div>
        <span
          className="shrink-0 text-xs font-600 px-2 py-0.5 rounded-full"
          style={{ backgroundColor: style.bg, color: style.text }}
        >
          {style.label}
        </span>
      </div>

      {/* Room info */}
      <div className="flex items-center gap-3 text-xs"
           style={{ color: "var(--color-text-secondary)" }}>
        <span className="font-500">
          Room {booking.roomNumber}
        </span>
        <span
          className="px-1.5 py-0.5 rounded text-xs font-500"
          style={{
            backgroundColor: "var(--color-bg-panel)",
            color: "var(--color-text-muted)",
          }}
        >
          {booking.roomType}
        </span>
        <span className="ml-auto font-500">
          {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
        </span>
      </div>

      {/* Dates row */}
      <div
        className="grid grid-cols-3 gap-2 pt-2 border-t text-xs"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        <div>
          <p style={{ color: "var(--color-text-muted)" }} className="mb-0.5">
            Check-in
          </p>
          <p className="font-500">
            {formatDate(parseLocalDate(booking.checkIn))}
          </p>
        </div>
        <div>
          <p style={{ color: "var(--color-text-muted)" }} className="mb-0.5">
            Check-out
          </p>
          <p className="font-500">
            {formatDate(parseLocalDate(booking.checkOut))}
          </p>
        </div>
        <div>
          <p style={{ color: "var(--color-text-muted)" }} className="mb-0.5">
            Nights
          </p>
          <p className="font-600" style={{ color: "var(--color-brand-accent)" }}>
            {nights}
          </p>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right">
        <span className="text-sm font-700" style={{ color: "var(--color-text-primary)" }}>
          ₹{booking.totalAmount.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  )
}