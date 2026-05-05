import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]

interface CalendarHeaderProps {
  year:      number
  month:     number
  onPrev:    () => void
  onNext:    () => void
  onToday:   () => void
}

export function CalendarHeader({
  year, month, onPrev, onNext, onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <CalendarDays size={22} style={{ color: "var(--color-brand-accent)" }} />
        <h2 className="text-2xl font-700 tracking-tight"
            style={{ color: "var(--color-text-primary)" }}>
          {MONTH_NAMES[month]}{" "}
          <span style={{ color: "var(--color-text-muted)" }}>{year}</span>
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="px-3 py-1.5 rounded-lg text-sm font-500 border transition-all
                     hover:border-[--color-brand-accent] hover:text-[--color-brand-accent]"
          style={{
            borderColor: "var(--color-border-default)",
            color:       "var(--color-text-secondary)",
          }}
        >
          Today
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            aria-label="Previous month"
            className="p-2 rounded-lg border transition-all hover:bg-[--color-bg-panel]"
            style={{ borderColor: "var(--color-border-default)" }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onNext}
            aria-label="Next month"
            className="p-2 rounded-lg border transition-all hover:bg-[--color-bg-panel]"
            style={{ borderColor: "var(--color-border-default)" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}