import { useState, useCallback } from "react"
import type { FilterState, RoomType, BookingStatus, BookingSource } from "../types"

interface UseFiltersReturn {
  filters:         FilterState
  toggleRoomType:  (t: RoomType) => void
  toggleSource:    (s: BookingSource) => void
  toggleStatus:    (s: BookingStatus) => void
  clearFilters:    () => void
}

const EMPTY: FilterState = { roomTypes: [], sources: [], statuses: [] }

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(EMPTY)

  const toggleRoomType = useCallback(
    (t: RoomType) => setFilters((f) => ({ ...f, roomTypes: toggle(f.roomTypes, t) })),
    []
  )
  const toggleSource = useCallback(
    (s: BookingSource) => setFilters((f) => ({ ...f, sources: toggle(f.sources, s) })),
    []
  )
  const toggleStatus = useCallback(
    (s: BookingStatus) => setFilters((f) => ({ ...f, statuses: toggle(f.statuses, s) })),
    []
  )
  const clearFilters = useCallback(() => setFilters(EMPTY), [])

  return { filters, toggleRoomType, toggleSource, toggleStatus, clearFilters }
}