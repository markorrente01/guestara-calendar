import type { RoomType } from "@/features/calendar/types"

export const TOTAL_ROOMS = 10

export const ROOM_TYPES: RoomType[] = [
  "Standard",
  "Deluxe",
  "Suite",
  "Penthouse",
]

export const ROOM_NUMBERS: Record<RoomType, string[]> = {
  Standard:   ["101", "102", "103"],
  Deluxe:     ["201", "202", "203"],
  Suite:      ["301", "302"],
  Penthouse:  ["401", "402"],
}