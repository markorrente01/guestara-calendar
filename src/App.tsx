import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"

import { CalendarGrid, CalendarHeader, useCalendar, useDragSelect, useOccupancy } from "@/features/calendar"
import { BookingPanel, useBookingPanel } from "@/features/bookings"
import { StatsStrip, useStats } from "@/features/stats"
import { FilterBar, useFilters } from "@/features/filters"
import { Spinner } from "@/components/ui/Spinner"
import { buildCalendarGrid } from "@/utils/dateUtils"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  )
}

function Dashboard() {
  const { year, month, goToPrev, goToNext, goToToday } = useCalendar()
  const { filters, toggleRoomType, toggleSource, toggleStatus, clearFilters } = useFilters()
  const { bookings, occupancyMap, isLoading, isError } = useOccupancy(year, month, filters)
  const { dragState, selectedRange, onCellMouseDown, onCellMouseEnter, clearSelection } = useDragSelect()
  const { panelBookings } = useBookingPanel(bookings, selectedRange)
  const stats = useStats(bookings, year, month)

  const grid = buildCalendarGrid(year, month)

  // ── Loading state ───────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
           style={{ backgroundColor: "var(--color-bg-app)" }}>
        <Spinner size={36} />
        <p className="text-sm font-500" style={{ color: "var(--color-text-muted)" }}>
          Loading bookings…
        </p>
      </div>
    )
  }

  // ── Error state ─────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3"
           style={{ backgroundColor: "var(--color-bg-app)" }}>
        <p className="text-lg font-600" style={{ color: "var(--color-text-primary)" }}>
          Failed to load bookings
        </p>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Make sure bookings.json is in the /public folder and the dev server is running.
        </p>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-app)" }}
      // Prevent text selection during drag
      onMouseDown={(e) => { if (e.detail > 1) e.preventDefault() }}
    >
      {/* ── Top bar ── */}
      <header
        className="border-b px-6 py-3 flex items-center justify-between"
        style={{
          backgroundColor: "var(--color-bg-surface)",
          borderColor:     "var(--color-border-default)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-lg font-700 tracking-tight"
            style={{ color: "var(--color-brand-primary)" }}
          >
            Guestara
          </span>
          <span
            className="text-xs font-500 px-2 py-0.5 rounded-full border"
            style={{
              color:           "var(--color-text-muted)",
              borderColor:     "var(--color-border-default)",
              backgroundColor: "var(--color-bg-panel)",
            }}
          >
            Front Desk
          </span>
        </div>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {bookings.length} active bookings
        </p>
      </header>

      {/* ── Main layout ── */}
      <main className="calendar-p py-6">

        {/* Stats strip */}
        <StatsStrip stats={stats} />

        {/* Filter bar */}
        <FilterBar
          filters={filters}
          onToggleRoom={toggleRoomType}
          onToggleSource={toggleSource}
          onToggleStatus={toggleStatus}
          onClear={clearFilters}
        />

        {/* Calendar + Panel side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">

          {/* Left — calendar */}
          <div>
            <CalendarHeader
              year={year}
              month={month}
              onPrev={goToPrev}
              onNext={goToNext}
              onToday={goToToday}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${year}-${month}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarGrid
                  grid={grid}
                  occupancyMap={occupancyMap}
                  bookings={bookings}
                  selectedRange={selectedRange}
                  dragState={dragState}
                  currentMonth={month}
                  onCellMouseDown={onCellMouseDown}
                  onCellMouseEnter={onCellMouseEnter}
                />
              </motion.div>
            </AnimatePresence>

            {/* Heatmap legend */}
            <div className="flex items-center gap-2 mt-3 justify-end">
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Occupancy
              </span>
              {[
                { color: "#F9FAFB", label: "0"    },
                { color: "#DBEAFE", label: "1-2"  },
                { color: "#FDE68A", label: "3-6"  },
                { color: "#FB923C", label: "7-8"  },
                { color: "#B91C1C", label: "9-10" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-sm border"
                    style={{
                      backgroundColor: s.color,
                      borderColor:     "var(--color-border-default)",
                    }}
                  />
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — booking panel */}
          <div className="lg:sticky lg:top-6">
            <BookingPanel
              bookings={panelBookings}
              selectedRange={selectedRange}
              onClear={clearSelection}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App