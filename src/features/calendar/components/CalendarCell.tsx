import { useState } from "react"
import type { Booking } from "../types"
import { getHeatmapColor, getHeatmapTextColor } from "@/utils/occupancyUtils"
import { isBookingActiveOnNight } from "@/utils/dateUtils"
import { DayTooltip } from "./DayTooltip"

interface CalendarCellProps {
  date:         Date
  occupancy:    number
  isSelected:   boolean
  isDimmed:     boolean
  isToday:      boolean
  bookings:     Booking[]
  onMouseDown:  (date: Date) => void
  onMouseEnter: (date: Date) => void
}

export function CalendarCell({
  date, occupancy, isSelected, isDimmed, isToday,
  bookings, onMouseDown, onMouseEnter,
}: CalendarCellProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)

  const bgColor   = isSelected ? "var(--color-brand-primary)" : getHeatmapColor(occupancy)
  const textColor = isSelected
    ? "#ffffff"
    : getHeatmapTextColor(occupancy)

  const activeBookings = bookings.filter((b) => isBookingActiveOnNight(b, date))

  return (
    <>
      <div
        className="relative flex flex-col p-2 rounded-lg cursor-pointer select-none
                   border transition-all duration-150 min-h-18"
        style={{
          backgroundColor: bgColor,
          color:           textColor,
          opacity:         isDimmed ? 0.35 : 1,
          borderColor:     isSelected
            ? "var(--color-brand-primary)"
            : isToday
            ? "var(--color-brand-accent)"
            : "var(--color-border-default)",
          borderWidth:     isToday && !isSelected ? 2 : 1,
        }}
        onMouseDown={() => onMouseDown(date)}
        onMouseEnter={(e) => {
          onMouseEnter(date)
          setTooltip({ x: e.clientX, y: e.clientY })
        }}
        onMouseMove={(e) => setTooltip({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setTooltip(null)}
      >
        <span className="text-sm font-600 leading-none">
          {date.getDate()}
        </span>

        {occupancy > 0 && (
          <span className="mt-auto text-xs font-500 opacity-80">
            {occupancy}/10
          </span>
        )}

        {isToday && !isSelected && (
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--color-brand-accent)" }}
          />
        )}
      </div>

      {tooltip && (
        <DayTooltip
          date={date}
          bookings={activeBookings}
          x={tooltip.x}
          y={tooltip.y}
        />
      )}
    </>
  )
}