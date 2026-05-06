import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Booking, OccupancyMap, FilterState } from "../types"
import { fetchBookings } from "../service"
import { buildOccupancyMap, applyFilters } from "../actions"
import { isBookingActiveOnNight, toDateKey, buildCalendarGrid } from "@/utils/dateUtils"

// Precomputed map: dateKey → bookings active that night
export interface BookingsByDateMap {
  [dateKey: string]: Booking[]
}

interface UseOccupancyReturn {
  bookings:       Booking[]
  occupancyMap:   OccupancyMap
  bookingsByDate: BookingsByDateMap
  isLoading:      boolean
  isError:        boolean
}

export function useOccupancy(
  year: number,
  month: number,
  filters: FilterState
): UseOccupancyReturn {
  const { data = [], isLoading, isError } = useQuery<Booking[]>({
    queryKey:  ["bookings"],
    queryFn:   fetchBookings,
    staleTime: Infinity,
  })

  const filteredBookings = useMemo(
    () => applyFilters(data, filters),
    [data, filters]
  )

  const occupancyMap = useMemo(
    () => buildOccupancyMap(filteredBookings, year, month),
    [filteredBookings, year, month]
  )


  const bookingsByDate = useMemo(() => {
    const grid = buildCalendarGrid(year, month)
    const map: BookingsByDateMap = {}

    for (const week of grid) {
      for (const date of week) {
        const key = toDateKey(date)
        map[key] = filteredBookings.filter((b) => isBookingActiveOnNight(b, date))
      }
    }

    return map
  }, [filteredBookings, year, month])

  return { bookings: filteredBookings, occupancyMap, bookingsByDate, isLoading, isError }
}