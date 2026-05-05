import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Booking, OccupancyMap, FilterState } from "../types"
import { fetchBookings } from "../service"
import { buildOccupancyMap, applyFilters } from "../actions"

interface UseOccupancyReturn {
  bookings:     Booking[]
  occupancyMap: OccupancyMap
  isLoading:    boolean
  isError:      boolean
}

export function useOccupancy(
  year: number,
  month: number,
  filters: FilterState
): UseOccupancyReturn {
  const { data = [], isLoading, isError } = useQuery<Booking[]>({
    queryKey:  ["bookings"],
    queryFn:   fetchBookings,
    staleTime: Infinity, // static JSON — never refetch
  })

  const filteredBookings = useMemo(
    () => applyFilters(data, filters),
    [data, filters]
  )

  const occupancyMap = useMemo(
    () => buildOccupancyMap(filteredBookings, year, month),
    [filteredBookings, year, month]
  )

  return { bookings: filteredBookings, occupancyMap, isLoading, isError }
}