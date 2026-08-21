import { useEffect, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import {
  EVENTS,
  GRID_HEIGHT,
  HOURS,
  INITIAL_SCROLL_TOP,
  WEEK_DAYS,
  formatHourLabel,
  getNowMarker,
  getTodayIndex,
} from '../../data/mockCalendar'
import { EventCard } from './EventCard'
import { CurrentTimeMarker } from './CurrentTimeMarker'
import { FeatureSlot } from '../../feature/Slot'
import { useWeekAssignment } from '../../context/WeekAssignmentContext'

export function CalendarGrid() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [now, setNow] = useState(() => getNowMarker())
  const todayIndex = getTodayIndex()
  const highlightedDay = todayIndex >= 0 ? todayIndex : 2
  const { assignedIds } = useWeekAssignment()
  const isAssigned = (event: (typeof EVENTS)[number]) =>
    assignedIds.has(event.id) || Boolean(event.assignWith && assignedIds.has(event.assignWith))

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: INITIAL_SCROLL_TOP })
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setNow(getNowMarker()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        className="grid shrink-0 border-b border-toggl-stroke"
        style={{
          gridTemplateColumns: 'var(--toggl-time-column-width) repeat(5, minmax(0, 1fr))',
          height: 73,
        }}
      >
        <div className="flex items-start justify-center gap-1 pt-2">
          <button
            type="button"
            aria-label="Zoom out"
            className="flex size-4 items-center justify-center rounded text-toggl-muted hover:bg-white/5"
          >
            <Minus size={8} />
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            className="flex size-4 items-center justify-center rounded text-toggl-muted hover:bg-white/5"
          >
            <Plus size={8} />
          </button>
        </div>
        {WEEK_DAYS.map((day, index) => {
          const isToday = index === highlightedDay
          return (
            <div key={day.iso} className="flex flex-col border-l border-toggl-stroke">
              <div className="flex h-10 items-center justify-center gap-1.5">
                <span
                  className={`flex size-9 items-center justify-center rounded-full text-[22px] leading-[22px] ${
                    isToday
                      ? 'bg-toggl-accent/10 font-semibold text-toggl-accent'
                      : 'font-normal text-toggl-text'
                  }`}
                >
                  {day.date}
                </span>
                <span
                  className={`text-[14px] leading-[14px] ${
                    isToday ? 'font-semibold text-toggl-text' : 'font-medium text-toggl-text'
                  }`}
                >
                  {day.weekday}
                </span>
              </div>
              <div className="flex h-[33px] text-[12px] leading-[12px] text-toggl-muted">
                <div
                  className={`flex flex-1 items-center justify-center border-r border-toggl-lane ${
                    isToday ? 'font-semibold' : 'font-medium'
                  }`}
                >
                  {day.loggedLabel}
                </div>
                <div
                  className={`flex flex-1 items-center justify-center ${
                    isToday ? 'font-semibold' : 'font-medium'
                  }`}
                >
                  {day.plannedLabel}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div ref={scrollRef} className="calendar-scroll relative min-h-0 flex-1 overflow-auto">
        <div
          className="grid"
          style={{
            gridTemplateColumns: 'var(--toggl-time-column-width) repeat(5, minmax(0, 1fr))',
            height: GRID_HEIGHT,
          }}
        >
          <div className="relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute right-2 text-right text-[11px] leading-[16px] font-medium tracking-[0.32px] text-toggl-muted uppercase"
                style={{ top: hour * 60 - 8 }}
              >
                {hour === 0 ? '' : formatHourLabel(hour)}
              </div>
            ))}
          </div>

          {WEEK_DAYS.map((day, index) => (
            <div
              key={day.iso}
              className="calendar-hour-lines relative border-l border-toggl-stroke"
            >
              <div className="absolute inset-y-0 left-0 w-1/2 border-r border-toggl-lane">
                {EVENTS.filter((event) => event.dayIndex === index && event.lane === 'logged').map(
                  (event) => (
                    <EventCard key={event.id} event={event} assigned={isAssigned(event)} />
                  ),
                )}
              </div>
              <div className="absolute inset-y-0 right-0 w-1/2 bg-toggl-secondary/50">
                {EVENTS.filter((event) => event.dayIndex === index && event.lane === 'planned').map(
                  (event) => (
                    <EventCard key={event.id} event={event} assigned={isAssigned(event)} />
                  ),
                )}
              </div>
              {now.dayIndex === index ? <CurrentTimeMarker minutes={now.minutes} /> : null}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE_SLOT: calendar overlay / inline entry for Friday's feature */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <FeatureSlot placement="calendar" />
      </div>
    </div>
  )
}
