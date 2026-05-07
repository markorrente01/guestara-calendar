import { useMemo } from "react"
import type { Booking, MonthStats, RoomType } from "@/features/calendar/types"
import { calcNights, isBookingActiveOnNight, buildCalendarGrid, toDateKey, parseLocalDate } from "@/utils/dateUtils"
import { TOTAL_ROOMS, ROOM_TYPES } from "@/constants/rooms"

function getProratedRevenue(
  booking: Booking,
  year: number,
  month: number
): number {
  const totalNights = calcNights(booking.checkIn, booking.checkOut)
  if (totalNights === 0) return 0

  const monthStart    = new Date(year, month, 1)
  const monthEnd      = new Date(year, month + 1, 0)  // last day of month
  const checkIn       = parseLocalDate(booking.checkIn)
  const checkOut      = parseLocalDate(booking.checkOut)

  // Clamp booking window to this month
  const windowStart   = checkIn  > monthStart ? checkIn  : monthStart
  const windowEnd     = checkOut < monthEnd   ? checkOut : new Date(year, month + 1, 0 + 1)

  // Count nights in this month (checkIn inclusive, checkOut exclusive)
  let nightsInMonth = 0
  const cursor = new Date(windowStart)
  while (cursor < windowEnd && cursor.getMonth() === month) {
    const key = toDateKey(cursor)
    if (key >= booking.checkIn && key < booking.checkOut) {
      nightsInMonth++
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return Math.round((nightsInMonth / totalNights) * booking.totalAmount)
}

export function useStats(
  bookings: Booking[],
  year: number,
  month: number
): MonthStats {
  return useMemo(() => {
    const activeBookings = bookings.filter((b) => b.status !== "cancelled")

    const daysInMonth   = new Date(year, month + 1, 0).getDate()
    const monthStartKey = toDateKey(new Date(year, month, 1))
    const monthEndKey   = toDateKey(new Date(year, month, daysInMonth))

    // ── Revenue: prorated to only nights in this month
    const monthBookings = activeBookings.filter(
      (b) => b.checkIn <= monthEndKey && b.checkOut > monthStartKey
    )
    const totalRevenue = monthBookings.reduce(
      (sum, b) => sum + getProratedRevenue(b, year, month),
      0
    )

    // ── Avg occupancy
    const grid = buildCalendarGrid(year, month)
    const monthDates = grid.flat().filter((d) => d.getMonth() === month)
    const totalOccupied = monthDates.reduce((sum, date) => {
      const count = activeBookings.filter((b) => isBookingActiveOnNight(b, date)).length
      return sum + count
    }, 0)
    const averageOccupancy = Math.round(
      (totalOccupied / (daysInMonth * TOTAL_ROOMS)) * 100
    )

    // ── Longest stay among bookings overlapping this month ───────────────
    const longestStay = monthBookings.reduce((max, b) => {
      const nights = calcNights(b.checkIn, b.checkOut)
      return nights > max ? nights : max
    }, 0)

    // ── Most booked room type scoped to this month ───────────────────────
    const typeCounts = ROOM_TYPES.reduce<Record<RoomType, number>>(
      (acc, t) => ({ ...acc, [t]: 0 }),
      {} as Record<RoomType, number>
    )
    for (const b of monthBookings) {
      typeCounts[b.roomType] = (typeCounts[b.roomType] ?? 0) + 1
    }
    const mostBookedRoomType = (
      Object.entries(typeCounts) as [RoomType, number][]
    ).reduce((best, curr) => (curr[1] > best[1] ? curr : best))[0]

    return { totalRevenue, averageOccupancy, longestStay, mostBookedRoomType }
  }, [bookings, year, month])
}