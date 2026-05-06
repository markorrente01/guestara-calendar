import type { FilterState, RoomType, BookingStatus, BookingSource } from "../types"
import { ROOM_TYPES } from "@/constants/rooms"
import { BOOKING_SOURCES } from "@/constants/sources"

const STATUSES: BookingStatus[] = ["confirmed", "checked_in", "checked_out", "cancelled"]

const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed:   "Confirmed",
  checked_in:  "Checked In",
  checked_out: "Checked Out",
  cancelled:   "Cancelled",
}

interface FilterBarProps {
  filters:        FilterState
  onToggleRoom:   (t: RoomType) => void
  onToggleSource: (s: BookingSource) => void
  onToggleStatus: (s: BookingStatus) => void
  onClear:        () => void
}

interface ChipProps {
  label:     string
  active:    boolean
  onClick:   () => void
}

function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-full text-xs font-500 border transition-all"
      style={{
        backgroundColor: active ? "var(--color-brand-primary)" : "var(--color-bg-surface)",
        color:           active ? "#ffffff" : "var(--color-text-secondary)",
        borderColor:     active ? "var(--color-brand-primary)" : "var(--color-border-default)",
      }}
    >
      {label}
    </button>
  )
}

export function FilterBar({
  filters, onToggleRoom, onToggleSource, onToggleStatus, onClear,
}: FilterBarProps) {
  const hasActive =
    filters.roomTypes.length > 0 ||
    filters.sources.length > 0 ||
    filters.statuses.length > 0

  return (
    <div
      className="rounded-2xl border px-4 py-3 mb-4 space-y-3"
      style={{
        borderColor:     "var(--color-border-default)",
        backgroundColor: "var(--color-bg-panel)",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-600 uppercase tracking-wider"
           style={{ color: "var(--color-text-muted)" }}>
          Filters
        </p>
        {hasActive && (
          <button
            onClick={onClear}
            className="text-xs font-500 transition-colors"
            style={{ color: "var(--color-brand-accent)" }}
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-2">
        <FilterRow label="Room Type">
          {ROOM_TYPES.map((t) => (
            <Chip
              key={t}
              label={t}
              active={filters.roomTypes.includes(t)}
              onClick={() => onToggleRoom(t)}
            />
          ))}
        </FilterRow>

        <FilterRow label="Status">
          {STATUSES.map((s) => (
            <Chip
              key={s}
              label={STATUS_LABELS[s]}
              active={filters.statuses.includes(s)}
              onClick={() => onToggleStatus(s)}
            />
          ))}
        </FilterRow>

        <FilterRow label="Source">
          {BOOKING_SOURCES.map((s) => (
            <Chip
              key={s}
              label={s}
              active={filters.sources.includes(s)}
              onClick={() => onToggleSource(s)}
            />
          ))}
        </FilterRow>
      </div>
    </div>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span
        className="text-xs font-500 w-20 shrink-0"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </span>
      {children}
    </div>
  )
}