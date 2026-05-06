import { useMemo } from "react"
import type { Booking, MonthStats, RoomType } from "@/features/calendar/types"
import { calcNights, isBookingActiveOnNight, buildCalendarGrid } from "@/utils/dateUtils"
import { TOTAL_ROOMS, ROOM_TYPES } from "@/constants/rooms"

export function useStats(
  bookings: Booking[],
  year: number,
  month: number
): MonthStats {
  return useMemo(() => {
    const activeBookings = bookings.filter((b) => b.status !== "cancelled")

    // Total revenue — bookings that overlap this month
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthStart  = new Date(year, month, 1)
    const monthEnd    = new Date(year, month, daysInMonth)

    const totalRevenue = activeBookings
      .filter((b) => b.checkIn <= toKey(monthEnd) && b.checkOut > toKey(monthStart))
      .reduce((sum, b) => sum + b.totalAmount, 0)

    // Average occupancy across the month
    const grid = buildCalendarGrid(year, month)
    const allDates = grid.flat().filter((d) => d.getMonth() === month)
    const totalOccupied = allDates.reduce((sum, date) => {
      const count = activeBookings.filter((b) => isBookingActiveOnNight(b, date)).length
      return sum + count
    }, 0)
    const averageOccupancy = Math.round(
      (totalOccupied / (daysInMonth * TOTAL_ROOMS)) * 100
    )

    // Longest stay among active bookings in range
    const longestStay = activeBookings.reduce((max, b) => {
      const nights = calcNights(b.checkIn, b.checkOut)
      return nights > max ? nights : max
    }, 0)

    // Most booked room type by booking count
    const typeCounts = ROOM_TYPES.reduce<Record<RoomType, number>>(
      (acc, t) => ({ ...acc, [t]: 0 }),
      {} as Record<RoomType, number>
    )
    for (const b of activeBookings) {
      typeCounts[b.roomType] = (typeCounts[b.roomType] ?? 0) + 1
    }
    const mostBookedRoomType = (
      Object.entries(typeCounts) as [RoomType, number][]
    ).reduce((best, curr) => (curr[1] > best[1] ? curr : best))[0]

    return { totalRevenue, averageOccupancy, longestStay, mostBookedRoomType }
  }, [bookings, year, month])
}

function toKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}