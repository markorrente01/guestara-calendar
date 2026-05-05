import type { Booking } from "./types"

export async function fetchBookings(): Promise<Booking[]> {
  const response = await fetch("/bookings.json")
  if (!response.ok) throw new Error(`Failed to load bookings: ${response.status}`)
  const data: Booking[] = await response.json()
  return data
}