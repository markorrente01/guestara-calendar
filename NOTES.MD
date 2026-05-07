# Assignment Notes

## Open Scope Choices

### 1. Stats Strip (month-level metrics)

**Chosen because:** It integrates directly into the existing data flow with
zero new state. `useStats` is a pure `useMemo` over the bookings array
already loaded by `useOccupancy`. No new fetches, no new context.

The four metrics were chosen deliberately:

- **Revenue** — the number a front desk manager looks at first every morning.
  Implemented with per-night proration so a booking spanning two months
  contributes the correct fraction to each. A 10-night stay that crosses
  a month boundary does not inflate either month's number.

- **Average occupancy %** — derived from the same occupancy map powering the
  heatmap. Single source of truth, no duplicate calculation.

- **Longest stay** — scoped to bookings overlapping the current month.
  Tells front desk which guests need the most attention.

- **Most booked room type** — scoped to the current month. Useful for
  housekeeping prioritization.

### 2. Hover Tooltip

**Chosen because:** It adds genuine front desk value with no extra state
beyond a local `{ x, y }` position in `CalendarCell`. The tooltip content
(active bookings per night) is precomputed in `useOccupancy` as
`bookingsByDate` — a `useMemo` over the filtered bookings. The component
receives the already-filtered list and renders it. No business logic
inside the component.

---

## Architecture Decisions

### Feature-based folder structure
Each feature (calendar, bookings, stats, filters) owns its types, actions,
service, hooks, and components. The rule: a feature may import from
`utils/` and `constants/` but never from another feature's internals.
Cross-feature data flows through props from `App.tsx`.

### Date string comparisons
Occupancy is calculated by comparing ISO date strings directly:

```ts
night >= booking.checkIn && night < booking.checkOut
```

This works because `YYYY-MM-DD` strings are lexicographically sortable.
It avoids `Date` object creation inside the hot loop and is correct as
long as `toDateKey()` is used consistently — which it is, as the single
formatter in `dateUtils.ts`.

### `parseLocalDate` instead of `new Date(str)`
`new Date("2026-02-10")` parses as UTC midnight, which shifts to the
previous day in negative-offset timezones. `new Date(y, m - 1, d)` forces
local timezone. This is the most common silent date bug in JavaScript and
it is handled at the entry point so no downstream code needs to think
about it.

### `staleTime: Infinity` on TanStack Query
The bookings JSON is static for the lifetime of the session. Setting
`staleTime: Infinity` means it is fetched exactly once. TanStack Query
still provides loading and error states, retry logic, and deduplication —
without the cost of background refetches that would never return new data.

### `useReducer` for calendar navigation
Month navigation was refactored from nested `useState` setters to a
`useReducer`. The reducer handles the year rollover logic
(December → January, January → December) atomically, making the state
transition explicit and testable.

### Precomputed `bookingsByDate` map
Tooltip content (active bookings per night) is computed once in
`useOccupancy` as a `{ [dateKey]: Booking[] }` map. Each `CalendarCell`
receives its pre-filtered slice. Without this, 42 cells would each filter
201 bookings on every hover event.

---

## Trade-offs and Known Limitations

### No runtime type validation on the fetched JSON
`fetchBookings` casts the response as `Booking[]` without runtime
validation. In production this would be replaced with a `zod` schema
parse. For this assignment the JSON is controlled and the trade-off is
acceptable.

### Revenue proration uses night counting not amount-per-night rate
The proration divides `totalAmount` by total nights and multiplies by
nights in the month. This assumes a flat nightly rate. If the booking
JSON included dynamic pricing per night, a different approach would
be needed.

### Tooltip state lives in each `CalendarCell`
The `{ x, y }` tooltip position is local state in `CalendarCell`. This
means 42 state objects exist simultaneously. A single tooltip state
hoisted to `CalendarGrid` would be marginally more efficient but would
require passing callbacks down through an extra layer. For 42 cells the
difference is immeasurable.

### No virtualization on the booking panel
The panel renders all overlapping bookings without virtualisation. For
201 bookings across a wide range this is fine. At tens of thousands of
bookings, `react-virtual` would be needed.

### Month occupancy for May appears low (1%)
The dataset ends May 3rd. May's average occupancy is calculated over all
31 days with only 3 days of data — this is mathematically correct and
honest, not a bug.

---

## What I Would Do Differently With More Time

1. **Add `zod` validation** on the fetch response so malformed booking
   data surfaces as a clear error rather than a silent runtime crash.

2. **Write unit tests for `dateUtils.ts`** — specifically
   `isBookingActiveOnNight`, `bookingOverlapsRange`, and
   `buildCalendarGrid`. These functions are the correctness foundation
   of the entire application and deserve property-based tests across
   DST boundary dates.

3. **Add keyboard navigation** to the calendar — arrow keys to move
   between cells, Enter to select, Escape to clear. Currently the
   calendar is mouse-only which fails accessibility requirements.

4. **Hoist tooltip state** to `CalendarGrid` level and render a single
   portal-based tooltip rather than 42 conditionally rendered ones.

5. **Add a date range input** alongside drag select — typing
   "Apr 15 – Apr 22" as an alternative to dragging, for precision.

6. **Export selected range to CSV** — the `csvExport.ts` stub is in
   place, it just needs implementation. Front desk staff frequently
   need to export a date range's bookings to share with management.

7. **Add a room-level timeline view** — a secondary view showing each
   of the 10 rooms as a horizontal row with booking bars spanning their
   dates. This gives a complementary picture to the day-level heatmap.