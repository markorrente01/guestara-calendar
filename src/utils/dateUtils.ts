import type { Booking, DateRange } from "@/features/calendar/types"

export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

// converts back to js date object
export function parseLocalDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function isBookingActiveOnNight(booking: Booking, date: Date): boolean {
  if (booking.status === "cancelled") return false
  const night = toDateKey(date)
  return night >= booking.checkIn && night < booking.checkOut // if conditions are met return true
}

/**
 * Returns true if a booking overlaps a date range (inclusive on both ends).
 * A booking overlaps if it starts before range end AND ends after range start.
 * Cancelled bookings never overlap.
 */
export function bookingOverlapsRange(
  booking: Booking,
  start: Date,
  end: Date
): boolean {
  if (booking.status === "cancelled") return false
  const rangeStart = toDateKey(start)
  const rangeEnd   = toDateKey(end)
  return booking.checkIn <= rangeEnd && booking.checkOut > rangeStart
}

/**
 * 2D array (weeks × days) of Date objects for the calendar grid.
 * Always Monday–Sunday. Pads with prev/next month days to fill the rectangle.
 */
export function buildCalendarGrid(year: number, month: number): Date[][] {
  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth  = new Date(year, month + 1, 0)

  // Monday = 0 ... Sunday = 6  (convert JS's Sun=0 system)
  const startDow = (firstOfMonth.getDay() + 6) % 7
  const endDow   = (lastOfMonth.getDay() + 6) % 7

  const gridStart = new Date(firstOfMonth)
  gridStart.setDate(gridStart.getDate() - startDow)

  const gridEnd = new Date(lastOfMonth)
  const daysToAdd = endDow === 6 ? 0 : 6 - endDow
  gridEnd.setDate(gridEnd.getDate() + daysToAdd)

  const weeks: Date[][] = []
  const cursor = new Date(gridStart)

  while (cursor <= gridEnd) {
    const week: Date[] = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  return weeks
}

/**
 * Returns a canonical { start, end } range regardless of drag direction.
 */
export function normalizeDateRange(a: Date, b: Date): DateRange {
  return a <= b ? { start: a, end: b } : { start: b, end: a }
}

/**
 * Returns true if `date` falls within [start, end] inclusive.
 */
export function isDateInRange(date: Date, range: DateRange): boolean {
  const key   = toDateKey(date)
  const start = toDateKey(range.start)
  const end   = toDateKey(range.end)
  return key >= start && key <= end
}

/**
 * Returns a human-readable formatted date string.
 * e.g. "12 Feb 2026"
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  })
}

/**
 * Returns the number of nights between checkIn and checkOut strings.
 */
export function calcNights(checkIn: string, checkOut: string): number {
  const a = parseLocalDate(checkIn)
  const b = parseLocalDate(checkOut)
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}