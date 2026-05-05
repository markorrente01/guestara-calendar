import type { Booking, DateRange, DragState, OccupancyMap } from "../types"
import { CalendarCell } from "./CalendarCell"
import { toDateKey, isDateInRange, normalizeDateRange } from "@/utils/dateUtils"

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

interface CalendarGridProps {
  grid:             Date[][]
  occupancyMap:     OccupancyMap
  bookings:         Booking[]
  selectedRange:    DateRange | null
  dragState:        DragState
  currentMonth:     number
  onCellMouseDown:  (date: Date) => void
  onCellMouseEnter: (date: Date) => void
}

export function CalendarGrid({
  grid, occupancyMap, bookings, selectedRange,
  dragState, currentMonth, onCellMouseDown, onCellMouseEnter,
}: CalendarGridProps) {

  // Live range shown while dragging
  const activeRange: DateRange | null = dragState.isDragging && dragState.dragStart && dragState.dragEnd
    ? normalizeDateRange(dragState.dragStart, dragState.dragEnd)
    : selectedRange

  return (
    <div className="rounded-2xl border overflow-hidden"
         style={{ borderColor: "var(--color-border-default)" }}>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7"
           style={{ backgroundColor: "var(--color-bg-panel)" }}>
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-600 tracking-wider uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar weeks */}
      <div className="grid gap-px"
           style={{ backgroundColor: "var(--color-border-default)" }}>
        {grid.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-px">
            {week.map((date) => {
              const key      = toDateKey(date)
              const occupancy = occupancyMap[key] ?? 0
              const isDimmed  = date.getMonth() !== currentMonth
              const isToday   = key === toDateKey(new Date())
              const isSelected = activeRange ? isDateInRange(date, activeRange) : false

              return (
                <CalendarCell
                  key={key}
                  date={date}
                  occupancy={occupancy}
                  isSelected={isSelected}
                  isDimmed={isDimmed}
                  isToday={isToday}
                  bookings={bookings}
                  onMouseDown={onCellMouseDown}
                  onMouseEnter={onCellMouseEnter}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}