import type { BookingStatus } from "@/features/calendar/types"

const STYLES: Record<BookingStatus, { bg: string; text: string; label: string }> = {
  confirmed:   { bg: "#EFF6FF", text: "#2563eb", label: "Confirmed"   },
  checked_in:  { bg: "#F0FDF4", text: "#16a34a", label: "Checked In"  },
  checked_out: { bg: "#FAF5FF", text: "#9333ea", label: "Checked Out" },
  cancelled:   { bg: "#FEF2F2", text: "#dc2626", label: "Cancelled"   },
}

interface BadgeProps {
  status: BookingStatus
}

export function Badge({ status }: BadgeProps) {
  const s = STYLES[status]
  return (
    <span
      className="inline-block text-xs font-600 px-2 py-0.5 rounded-full"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  )
}