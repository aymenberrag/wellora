import type { WellStatus } from "../services/well";

/**
 * Marker colors per well status, kept visually consistent with the
 * status badge colors used across the app (see WellTable.tsx).
 */
export const WELL_STATUS_MARKER_COLORS: Record<WellStatus, string> = {
  Producing: "#16a34a", // green-600
  Drilling: "#ea580c", // orange-600
  "Shut In": "#ca8a04", // yellow-600
  Workover: "#2563eb", // blue-600
  Abandoned: "#dc2626", // red-600
};

export function getWellStatusColor(status: string): string {
  return (
    WELL_STATUS_MARKER_COLORS[status as WellStatus] ?? "#64748b" // slate-500 fallback
  );
}
