import type { Booking, DateRange } from "./types"
import { bookingOverlapsRange, calcNights, parseLocalDate } from "@/utils/dateUtils"

/**
 * Returns all bookings that overlap a given date range.
 * Excludes cancelled bookings.
 */
export function getBookingsForRange(
  bookings: Booking[],
  range: DateRange
): Booking[] {
  return bookings.filter((b) =>
    bookingOverlapsRange(b, range.start, range.end)
  )
}

/**
 * Returns the number of nights for a booking.
 */
export function getBookingNights(booking: Booking): number {
  return calcNights(booking.checkIn, booking.checkOut)
}

/**
 * Sorts bookings by check-in date ascending.
 */
export function sortBookingsByCheckIn(bookings: Booking[]): Booking[] {
  return [...bookings].sort((a, b) =>
    a.checkIn.localeCompare(b.checkIn)
  )
}

/**
 * Returns bookings active on a single night (single-day click).
 */
export function getBookingsForNight(
  bookings: Booking[],
  date: Date
): Booking[] {
  return getBookingsForRange(bookings, { start: date, end: date })
}