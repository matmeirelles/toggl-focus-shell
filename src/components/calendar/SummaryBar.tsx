import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  LOGGED_MINUTES,
  LOGGED_TOTAL,
  PLANNED_MINUTES,
  PLANNED_TOTAL,
  TARGET_MINUTES,
} from '../../data/mockCalendar'

function Meter({ label, value, minutes }: { label: string; value: string; minutes: number }) {
  const pct = Math.min(100, (minutes / TARGET_MINUTES) * 100)
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <span className="shrink-0 text-[12px] font-medium text-toggl-muted">{label}</span>
      <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-toggl-stroke">
        <div
          className="h-full rounded-full bg-toggl-muted"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 text-[12px] font-medium text-toggl-text tabular-nums">{value}</span>
    </div>
  )
}

export function SummaryBar() {
  return (
    <div className="flex h-[41px] shrink-0 items-center gap-3 border-b border-toggl-stroke bg-toggl-secondary px-4">
      <Meter label="Logged" value={LOGGED_TOTAL} minutes={LOGGED_MINUTES} />
      <Meter label="Planned" value={PLANNED_TOTAL} minutes={PLANNED_MINUTES} />
      <Link
        to="/reports"
        className="flex h-6 shrink-0 items-center gap-0.5 rounded-lg px-2 text-[12px] font-medium text-toggl-muted hover:text-toggl-hover"
      >
        View reports
        <ChevronRight size={16} />
      </Link>
    </div>
  )
}
