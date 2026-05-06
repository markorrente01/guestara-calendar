import type { DateRange, DragState, OccupancyMap } from "../types"
import type { BookingsByDateMap } from "../hooks/useOccupancy"
import { CalendarCell } from "./CalendarCell"
import { toDateKey, isDateInRange, normalizeDateRange } from "@/utils/dateUtils"

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

interface CalendarGridProps {
  grid:             Date[][]
  occupancyMap:     OccupancyMap
  bookingsByDate:   BookingsByDateMap
  selectedRange:    DateRange | null
  dragState:        DragState
  currentMonth:     number
  onCellMouseDown:  (date: Date) => void
  onCellMouseEnter: (date: Date) => void
}

export function CalendarGrid({
  grid, occupancyMap, bookingsByDate, selectedRange,
  dragState, currentMonth, onCellMouseDown, onCellMouseEnter,
}: CalendarGridProps) {

  const activeRange: DateRange | null =
    dragState.isDragging && dragState.dragStart && dragState.dragEnd
      ? normalizeDateRange(dragState.dragStart, dragState.dragEnd)
      : selectedRange

  return (
    <div className="rounded-2xl border overflow-hidden border-border-default">

      <div className="grid grid-cols-7 bg-bg-panel">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-600 tracking-wider uppercase text-text-muted"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid gap-px bg-border-default">
        {grid.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-px">
            {week.map((date) => {
              const key        = toDateKey(date)
              const occupancy  = occupancyMap[key]  ?? 0
              const cellBookings = bookingsByDate[key] ?? []
              const isDimmed   = date.getMonth() !== currentMonth
              const isToday    = key === toDateKey(new Date())
              const isSelected = activeRange ? isDateInRange(date, activeRange) : false

              return (
                <CalendarCell
                  key={key}
                  date={date}
                  occupancy={occupancy}
                  isSelected={isSelected}
                  isDimmed={isDimmed}
                  isToday={isToday}
                  bookings={cellBookings}
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