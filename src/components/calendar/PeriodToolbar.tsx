import type { ReactNode } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Columns2,
  Grid2X2,
  List,
  PanelRight,
  Settings,
} from 'lucide-react'
import { WEEK_LABEL } from '../../data/mockCalendar'

function IconBtn({
  label,
  active = false,
  children,
}: {
  label: string
  active?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex size-8 items-center justify-center text-[14px] ${
        active
          ? 'bg-toggl-active text-toggl-accent'
          : 'text-toggl-muted hover:bg-white/5 hover:text-toggl-hover'
      }`}
    >
      {children}
    </button>
  )
}

export function PeriodToolbar() {
  return (
    <div className="flex h-[41px] shrink-0 items-center gap-2 border-b border-toggl-stroke px-4">
      <div className="flex h-8 items-center">
        <button
          type="button"
          aria-label="Previous period"
          className="flex size-8 items-center justify-center rounded-l-lg text-toggl-muted hover:bg-white/5"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="flex h-8 w-[232px] items-center justify-center gap-2 text-[14px] font-medium text-toggl-text"
        >
          <CalendarDays size={16} className="text-toggl-muted" />
          {WEEK_LABEL}
        </button>
        <button
          type="button"
          aria-label="Next period"
          className="flex size-8 items-center justify-center rounded-r-lg text-toggl-muted hover:bg-white/5"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <button
        type="button"
        className="flex h-8 w-[100px] items-center justify-center gap-2 rounded-lg border border-toggl-stroke px-3.5 text-[14px] font-medium text-toggl-text"
      >
        5 Days
        <ChevronDown size={16} className="text-toggl-muted" />
      </button>

      <div className="ml-1 flex overflow-hidden rounded-lg border border-toggl-stroke">
        <IconBtn label="Calendar view">
          <CalendarDays size={16} />
        </IconBtn>
        <IconBtn label="Split view" active>
          <Columns2 size={16} />
        </IconBtn>
        <IconBtn label="List view">
          <List size={16} />
        </IconBtn>
        <IconBtn label="Grid view">
          <Grid2X2 size={16} />
        </IconBtn>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          aria-label="Calendar settings"
          className="flex size-8 items-center justify-center rounded-lg text-toggl-muted hover:bg-white/5"
        >
          <Settings size={16} />
        </button>
        <button
          type="button"
          aria-label="Layout"
          className="flex size-8 items-center justify-center rounded-lg text-toggl-muted hover:bg-white/5"
        >
          <PanelRight size={16} />
        </button>
      </div>
    </div>
  )
}
