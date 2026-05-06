import { useMemo } from "react"
import type { Booking, DateRange } from "../types"
import { getBookingsForRange, sortBookingsByCheckIn } from "../actions"

interface UseBookingPanelReturn {
  panelBookings: Booking[]
}

export function useBookingPanel(
  bookings: Booking[],
  selectedRange: DateRange | null
): UseBookingPanelReturn {
  const panelBookings = useMemo(() => {
    if (!selectedRange) return []
    const overlapping = getBookingsForRange(bookings, selectedRange)
    return sortBookingsByCheckIn(overlapping)
  }, [bookings, selectedRange])

  return { panelBookings }
}