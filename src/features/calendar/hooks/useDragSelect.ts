import { useState, useCallback, useEffect } from "react"
import type { DateRange, DragState } from "../types"
import { normalizeDateRange } from "@/utils/dateUtils"

interface UseDragSelectReturn {
  dragState:        DragState
  selectedRange:    DateRange | null
  onCellMouseDown:  (date: Date) => void
  onCellMouseEnter: (date: Date) => void
  clearSelection:   () => void
}

export function useDragSelect(): UseDragSelectReturn {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragStart:  null,
    dragEnd:    null,
  })
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null)

  const onCellMouseDown = useCallback((date: Date) => {
    setSelectedRange(null)
    setDragState({ isDragging: true, dragStart: date, dragEnd: date })
  }, [])

  const onCellMouseEnter = useCallback((date: Date) => {
    setDragState((prev) => {
      if (!prev.isDragging) return prev
      return { ...prev, dragEnd: date }
    })
  }, [])

  const finalizeSelection = useCallback(() => {
    setDragState((prev) => {
      if (prev.isDragging && prev.dragStart && prev.dragEnd) {
        setSelectedRange(normalizeDateRange(prev.dragStart, prev.dragEnd))
      }
      return { isDragging: false, dragStart: null, dragEnd: null }
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedRange(null)
    setDragState({ isDragging: false, dragStart: null, dragEnd: null })
  }, [])

  // Catch mouseup anywhere on the window — handles release outside the grid
  useEffect(() => {
    window.addEventListener("mouseup", finalizeSelection)
    return () => window.removeEventListener("mouseup", finalizeSelection)
  }, [finalizeSelection])

  return { dragState, selectedRange, onCellMouseDown, onCellMouseEnter, clearSelection }
}