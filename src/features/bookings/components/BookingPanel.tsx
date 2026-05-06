import { motion, AnimatePresence } from "framer-motion"
import type { Booking, DateRange } from "../types"
import { BookingCard } from "./BookingCard"
import { EmptyState } from "./EmptyState"
import { formatDate } from "@/utils/dateUtils"
import { X } from "lucide-react"

interface BookingPanelProps {
  bookings:      Booking[]
  selectedRange: DateRange | null
  onClear:       () => void
}

export function BookingPanel({ bookings, selectedRange, onClear }: BookingPanelProps) {
  const rangeLabel = selectedRange
    ? toDateKey(selectedRange.start) === toDateKey(selectedRange.end)
      ? formatDate(selectedRange.start)
      : `${formatDate(selectedRange.start)} → ${formatDate(selectedRange.end)}`
    : null

  return (
    <aside
      className="rounded-2xl border flex flex-col overflow-hidden"
      style={{
        borderColor:     "var(--color-border-default)",
        backgroundColor: "var(--color-bg-panel)",
        minHeight:       480,
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        <div>
          <h3 className="font-600 text-sm">Bookings</h3>
          {rangeLabel && (
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {rangeLabel}
            </p>
          )}
        </div>
        {selectedRange && (
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg hover:bg-[--color-bg-surface] transition-colors"
            aria-label="Clear selection"
          >
            <X size={14} style={{ color: "var(--color-text-muted)" }} />
          </button>
        )}
      </div>

      {/* Panel body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence mode="wait">
          {bookings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EmptyState />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <p
                className="text-xs font-500 px-1 pb-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                {bookings.length} {bookings.length === 1 ? "booking" : "bookings"} found
              </p>
              {bookings.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}

// inline helper — avoids importing toDateKey separately just for the label
function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}