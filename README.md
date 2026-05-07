# Guestara Frontend Intern Assignment

An interactive hotel occupancy heatmap calendar built as a single-page React
application. Designed as a front desk tool: "how full are we this month, and
what is coming up."

---

## Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS v4** with `@theme` design tokens
- **TanStack Query** for async data fetching
- **Framer Motion** for animations
- **Vite** for bundling
- **Lucide React** for icons

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
git clone https://github.com/markorrente01/guestara-calendar.git
cd guestara-calendar
npm install
```

### Running the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
  features/
    calendar/        ← heatmap grid, occupancy logic, drag select
    bookings/        ← booking detail panel
    filters/         ← room type / source / status filter bar
    stats/           ← monthly metrics strip
  components/ui/     ← reusable Button, Badge, Spinner, Card, Tooltip
  utils/             ← pure date math, heatmap colors, currency
  constants/         ← room types, booking sources
  styles/            ← Tailwind v4 @theme tokens
```

Each feature is fully self-contained: its own types, service, actions,
hooks, and components. No feature reaches into another feature's internals.

---

## Data

Bookings are loaded from `/public/bookings.json` via `fetch()` at runtime.
The file is never imported as a module. TanStack Query manages the async
lifecycle with loading, error, and success states.

Dataset: 201 bookings across 10 rooms, January–May 2026.

---

## Key Features

### Occupancy Heatmap
Each calendar cell shows rooms occupied out of 10. Background color maps
occupancy level from cool blue (empty) through amber to deep red (full).
Checkout day is excluded. Cancelled bookings never count.

### Drag-to-Select
Click and drag across any date range — forward or backward, across month
boundaries. The booking panel updates live with all overlapping bookings.

### Hover Tooltip
Hover any cell to see occupied room count and guest names instantly.

### Stats Strip
Month-level metrics: prorated revenue, average occupancy, longest stay,
most booked room type. All update when the month changes.

### Filters
Filter by room type, booking source, and status simultaneously. All views
— heatmap, stats, panel — respond to the active filters.

---

## Occupancy Rule

```
checkIn:  "2026-02-10"  ← INCLUSIVE (guest is there this night)
checkOut: "2026-02-13"  ← EXCLUSIVE (guest leaves this morning)
```

A booking from Feb 10 to Feb 13 occupies the nights of Feb 10, 11, and 12.
This rule is implemented once in `utils/dateUtils.ts` and used everywhere.

---

## Running Checks

```bash
npm run lint        # ESLint
npm run type-check  # tsc --noEmit
```