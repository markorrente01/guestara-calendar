export type RoomType      = "Standard" | "Deluxe" | "Suite" | "Penthouse"
export type BookingStatus = "confirmed" | "checked_in" | "checked_out" | "cancelled"
export type BookingSource = "Direct" | "Airbnb" | "Booking.com" | "Expedia" | "Agoda" | "Walk-in"

export interface Booking {
  id:           string
  guestName:    string
  roomNumber:   string
  roomType:     RoomType
  checkIn:      string   // "YYYY-MM-DD"
  checkOut:     string   // "YYYY-MM-DD"
  guests:       number
  totalAmount:  number
  currency:     string
  status:       BookingStatus
  source:       BookingSource
}

export interface DateRange {
  start: Date
  end:   Date
}

export interface OccupancyMap {
  [dateKey: string]: number  // "2026-02-10" → 7
}

export interface MonthStats {
  totalRevenue:       number
  averageOccupancy:   number   // 0–100
  longestStay:        number   // nights
  mostBookedRoomType: RoomType
}

export interface DragState {
  isDragging: boolean
  dragStart:  Date | null
  dragEnd:    Date | null
}

export interface FilterState {
  roomTypes: RoomType[]
  sources:   BookingSource[]
  statuses:  BookingStatus[]
}