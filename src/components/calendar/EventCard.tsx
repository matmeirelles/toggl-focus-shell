import { Play, Timer } from 'lucide-react'
import type { CalendarEvent } from '../../data/mockCalendar'
import { formatDuration } from '../../data/mockCalendar'
import { GoogleG } from '../icons/GoogleG'

export function EventCard({ event }: { event: CalendarEvent }) {
  const short = event.durationMin < 30
  const isGoogleLogged = event.google && (event.lane === 'logged' || event.syncedLight)
  const isGooglePlanned = event.google && event.lane === 'planned' && !event.syncedLight

  const surface = isGoogleLogged
    ? 'bg-toggl-event text-toggl-inverted border-toggl-event-border'
    : isGooglePlanned
      ? 'bg-toggl-event-muted text-toggl-event border-toggl-event-border'
      : 'bg-toggl-generic text-toggl-text border-toggl-generic-border hover:border-toggl-stroke-strong'

  const left = event.leftPct ?? 0
  const width = event.widthPct ?? 100

  return (
    <div
      className="absolute px-px"
      style={{
        top: event.startMin,
        height: event.durationMin,
        left: `${left}%`,
        width: `${width}%`,
        zIndex: event.zIndex ?? 1,
      }}
    >
      <div
        className={`group relative h-full overflow-hidden rounded-lg border ${surface}`}
        style={{ padding: short ? '1px 6px' : '2px 6px' }}
      >
        <div className="flex items-start justify-between gap-1">
          <div
            className={`min-w-0 truncate font-semibold ${
              short ? 'text-[11px] leading-[14px]' : 'text-[12px] leading-[16px]'
            }`}
          >
            {event.title}
          </div>
          {event.google ? (
            <span className="mt-0.5 shrink-0 opacity-90">
              <GoogleG />
            </span>
          ) : null}
        </div>
        {!short ? (
          <div className="mt-0.5 flex items-center gap-1 text-[12px] leading-[16px] opacity-60">
            <Timer size={10} strokeWidth={2} />
            <span>{formatDuration(event.durationMin)}</span>
          </div>
        ) : null}
        <button
          type="button"
          aria-label="Start timer from event"
          className="absolute right-1 bottom-1 flex size-5 items-center justify-center rounded-full bg-black/25 text-current opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        >
          <Play size={10} fill="currentColor" strokeWidth={0} />
        </button>
      </div>
    </div>
  )
}
