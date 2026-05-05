/**
 * Returns a heatmap background color based on number of rooms occupied.
 * Total rooms = 10.
 */
export function getHeatmapColor(occupied: number): string {
  if (occupied === 0)  return "#F9FAFB"
  if (occupied <= 2)   return "#DBEAFE"
  if (occupied <= 4)   return "#FEF9C3"
  if (occupied <= 6)   return "#FDE68A"
  if (occupied <= 8)   return "#FB923C"
  if (occupied === 9)  return "#EF4444"
  return "#B91C1C" // 10
}

/**
 * Returns a contrasting text color for a given occupancy level.
 * Keeps day numbers readable against the heatmap background.
 */
export function getHeatmapTextColor(occupied: number): string {
  return occupied >= 7 ? "#ffffff" : "#1a1f36"
}