import { motion } from "framer-motion"
import type { MonthStats } from "../types"
import { TrendingUp, BedDouble, Moon, Star } from "lucide-react"

interface StatsStripProps {
  stats: MonthStats
}

interface StatTileProps {
  icon:    React.ReactNode
  label:   string
  value:   string
  index:   number
}

function StatTile({ icon, label, value, index }: StatTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="flex items-center gap-3 px-5 py-4 rounded-2xl border"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        borderColor:     "var(--color-border-default)",
      }}
    >
      <span style={{ color: "var(--color-brand-accent)" }}>{icon}</span>
      <div>
        <p className="text-xs font-500" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </p>
        <p className="text-base font-700 leading-tight mt-0.5"
           style={{ color: "var(--color-text-primary)" }}>
          {value}
        </p>
      </div>
    </motion.div>
  )
}

export function StatsStrip({ stats }: StatsStripProps) {
  const tiles = [
    {
      icon:  <TrendingUp size={18} />,
      label: "Monthly Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
    },
    {
      icon:  <BedDouble size={18} />,
      label: "Avg Occupancy",
      value: `${stats.averageOccupancy}%`,
    },
    {
      icon:  <Moon size={18} />,
      label: "Longest Stay",
      value: `${stats.longestStay} nights`,
    },
    {
      icon:  <Star size={18} />,
      label: "Top Room Type",
      value: stats.mostBookedRoomType,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {tiles.map((t, i) => (
        <StatTile key={t.label} {...t} index={i} />
      ))}
    </div>
  )
}