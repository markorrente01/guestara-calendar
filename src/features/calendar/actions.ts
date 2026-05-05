import type { Booking, OccupancyMap, FilterState } from "./types"
import { isBookingActiveOnNight, toDateKey, buildCalendarGrid } from "@/utils/dateUtils"
import { TOTAL_ROOMS } from "@/constants/rooms"

/**
 * Builds an OccupancyMap for every day in a given month.
 * Counts how many non-cancelled bookings occupy each night.
 */
export function buildOccupancyMap(
  bookings: Booking[],
  year: number,
  month: number
): OccupancyMap {
  const grid = buildCalendarGrid(year, month)
  const map: OccupancyMap = {}

  for (const week of grid) {
    for (const date of week) {
      const key = toDateKey(date)
      map[key] = bookings.filter((b) => isBookingActiveOnNight(b, date)).length
    }
  }

  return map
}

/**
 * Applies active filters to a booking list.
 * Empty filter arrays mean "show all" for that dimension.
 */
export function applyFilters(
  bookings: Booking[],
  filters: FilterState
): Booking[] {
  return bookings.filter((b) => {
    const roomMatch =
      filters.roomTypes.length === 0 || filters.roomTypes.includes(b.roomType)
    const sourceMatch =
      filters.sources.length === 0 || filters.sources.includes(b.source)
    const statusMatch =
      filters.statuses.length === 0 || filters.statuses.includes(b.status)
    return roomMatch && sourceMatch && statusMatch
  })
}

/**
 * Returns the occupancy percentage for a month (0–100).
 */
export function calcMonthOccupancyPercent(
  map: OccupancyMap,
  year: number,
  month: number
): number {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const total = Object.values(map).reduce((sum, n) => sum + n, 0)
  return Math.round((total / (daysInMonth * TOTAL_ROOMS)) * 100)
}