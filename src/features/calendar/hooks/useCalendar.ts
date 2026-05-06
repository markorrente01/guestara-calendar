import { useReducer, useCallback } from "react"

interface CalendarState {
  year:  number
  month: number
}

type CalendarAction =
  | { type: "PREV"  }
  | { type: "NEXT"  }
  | { type: "TODAY" }

function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case "PREV":
      return state.month === 0
        ? { year: state.year - 1, month: 11 }
        : { ...state, month: state.month - 1 }

    case "NEXT":
      return state.month === 11
        ? { year: state.year + 1, month: 0 }
        : { ...state, month: state.month + 1 }

    case "TODAY": {
      const now = new Date()
      return { year: now.getFullYear(), month: now.getMonth() }
    }
  }
}

interface UseCalendarReturn {
  year:      number
  month:     number
  goToPrev:  () => void
  goToNext:  () => void
  goToToday: () => void
}

export function useCalendar(): UseCalendarReturn {
  const today = new Date()

  const [state, dispatch] = useReducer(calendarReducer, {
    year:  today.getFullYear(),
    month: today.getMonth(),
  })

  const goToPrev  = useCallback(() => dispatch({ type: "PREV"  }), [])
  const goToNext  = useCallback(() => dispatch({ type: "NEXT"  }), [])
  const goToToday = useCallback(() => dispatch({ type: "TODAY" }), [])

  return { year: state.year, month: state.month, goToPrev, goToNext, goToToday }
}