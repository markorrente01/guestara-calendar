import { useState, useCallback } from "react"

interface UseCalendarReturn {
  year:        number
  month:       number
  goToPrev:    () => void
  goToNext:    () => void
  goToToday:   () => void
}

export function useCalendar(): UseCalendarReturn {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const goToPrev = useCallback(() => {
    setMonth((m) => {
      if (m === 0) { setYear((y) => y - 1); return 11 }
      return m - 1
    })
  }, [])

  const goToNext = useCallback(() => {
    setMonth((m) => {
      if (m === 11) { setYear((y) => y + 1); return 0 }
      return m + 1
    })
  }, [])

  const goToToday = useCallback(() => {
    const now = new Date()
    setYear(now.getFullYear())
    setMonth(now.getMonth())
  }, [])

  return { year, month, goToPrev, goToNext, goToToday }
}