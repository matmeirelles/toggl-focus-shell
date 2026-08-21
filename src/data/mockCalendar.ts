export type Lane = 'logged' | 'planned'

export type CalendarDay = {
  date: number
  weekday: string
  iso: string
  loggedLabel: string
  plannedLabel: string
}

export type CalendarEvent = {
  id: string
  dayIndex: number
  lane: Lane
  startMin: number
  durationMin: number
  title: string
  google: boolean
  syncedLight?: boolean
  leftPct?: number
  widthPct?: number
  zIndex?: number
  assignWith?: string
}

export const WEEK_LABEL = 'This week • W34'

export const WEEK_DAYS: CalendarDay[] = [
  { date: 17, weekday: 'Mon', iso: '2026-08-17', loggedLabel: '3h 30m', plannedLabel: '-' },
  { date: 18, weekday: 'Tue', iso: '2026-08-18', loggedLabel: '4h 26m', plannedLabel: '-' },
  { date: 19, weekday: 'Wed', iso: '2026-08-19', loggedLabel: '2h 30m', plannedLabel: '1h' },
  { date: 20, weekday: 'Thu', iso: '2026-08-20', loggedLabel: '-', plannedLabel: '8h' },
  { date: 21, weekday: 'Fri', iso: '2026-08-21', loggedLabel: '-', plannedLabel: '2h' },
]

export const LOGGED_TOTAL = '10h 26m'
export const PLANNED_TOTAL = '11h'
export const LOGGED_MINUTES = 10 * 60 + 26
export const PLANNED_MINUTES = 11 * 60
export const TARGET_MINUTES = 8 * 60

export const EVENTS: CalendarEvent[] = [
  {
    id: 'mon-lunch',
    dayIndex: 0,
    lane: 'logged',
    startMin: 12 * 60,
    durationMin: 60,
    title: 'Lunch',
    google: true,
  },
  {
    id: 'tue-lunch',
    dayIndex: 1,
    lane: 'logged',
    startMin: 12 * 60,
    durationMin: 60,
    title: 'Lunch',
    google: true,
  },
  {
    id: 'tue-toggl-a',
    dayIndex: 1,
    lane: 'logged',
    startMin: 14 * 60 + 23,
    durationMin: 16,
    title: 'Toggl video assessment',
    google: false,
    leftPct: 2,
    widthPct: 58,
    zIndex: 1,
  },
  {
    id: 'tue-toggl-b',
    dayIndex: 1,
    lane: 'logged',
    startMin: 14 * 60 + 23,
    durationMin: 26,
    title: 'Toggl video assessment',
    google: false,
    leftPct: 40,
    widthPct: 58,
    zIndex: 2,
  },
  {
    id: 'wed-lunch-logged',
    dayIndex: 2,
    lane: 'logged',
    startMin: 12 * 60,
    durationMin: 60,
    title: 'Lunch',
    google: true,
  },
  {
    id: 'wed-lunch-planned',
    dayIndex: 2,
    lane: 'planned',
    startMin: 12 * 60,
    durationMin: 60,
    title: 'Lunch',
    google: true,
    syncedLight: true,
    assignWith: 'wed-lunch-logged',
  },
  {
    id: 'thu-lunch',
    dayIndex: 3,
    lane: 'planned',
    startMin: 12 * 60,
    durationMin: 60,
    title: 'Lunch',
    google: true,
  },
  {
    id: 'thu-azos',
    dayIndex: 3,
    lane: 'planned',
    startMin: 14 * 60,
    durationMin: 45,
    title: 'Focus time',
    google: true,
  },
  {
    id: 'thu-therapy',
    dayIndex: 3,
    lane: 'planned',
    startMin: 17 * 60,
    durationMin: 75,
    title: 'Therapy',
    google: true,
  },
  {
    id: 'fri-lunch',
    dayIndex: 4,
    lane: 'planned',
    startMin: 12 * 60,
    durationMin: 60,
    title: 'Lunch',
    google: true,
  },
  {
    id: 'a1',
    dayIndex: 0,
    lane: 'logged',
    startMin: 9 * 60,
    durationMin: 150,
    title: 'Acme homepage design',
    google: true,
  },
  {
    id: 'a2',
    dayIndex: 1,
    lane: 'logged',
    startMin: 10 * 60,
    durationMin: 60,
    title: 'Acme client sync',
    google: true,
  },
  {
    id: 'a3',
    dayIndex: 2,
    lane: 'logged',
    startMin: 14 * 60,
    durationMin: 90,
    title: 'Acme design review',
    google: true,
  },
  {
    id: 'a4',
    dayIndex: 3,
    lane: 'planned',
    startMin: 9 * 60,
    durationMin: 150,
    title: 'Acme dev handoff',
    google: true,
  },
  {
    id: 'a5',
    dayIndex: 4,
    lane: 'planned',
    startMin: 10 * 60,
    durationMin: 60,
    title: 'Acme QA + fixes',
    google: true,
  },
  {
    id: 'o1',
    dayIndex: 1,
    lane: 'logged',
    startMin: 13 * 60,
    durationMin: 120,
    title: 'Landing page build',
    google: true,
  },
  {
    id: 'o2',
    dayIndex: 3,
    lane: 'planned',
    startMin: 13 * 60,
    durationMin: 60,
    title: 'Discovery call',
    google: true,
  },
  {
    id: 'o3',
    dayIndex: 3,
    lane: 'planned',
    startMin: 15 * 60,
    durationMin: 90,
    title: 'Proposal writing',
    google: true,
  },
]

export const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

export const GRID_HEIGHT = 24 * 60
export const INITIAL_SCROLL_TOP = 9 * 60

export function formatHourLabel(hour: number) {
  const period = hour >= 12 ? 'PM' : 'AM'
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}:00 ${period}`
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}

export function getTodayIndex(now = new Date()) {
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const idx = WEEK_DAYS.findIndex((day) => day.iso === iso)
  return idx
}

export function getNowMarker(now = new Date()) {
  const dayIndex = getTodayIndex(now)
  if (dayIndex >= 0) {
    return {
      dayIndex,
      minutes: now.getHours() * 60 + now.getMinutes(),
    }
  }
  return { dayIndex: 2, minutes: 15 * 60 + 18 }
}

export const MOCK_PROJECTS = [
  { id: 'acme', name: 'Acme', client: 'Acme Inc.', hours: '8h 30m' },
  { id: 'p1', name: 'Toggl video assessment', client: 'Career', hours: '26m' },
  { id: 'p2', name: 'Azos — PM B2C Policyholder', client: 'Azos', hours: '45m' },
  { id: 'p3', name: 'Personal', client: '—', hours: '6h 15m' },
]

export const MOCK_TASKS = [
  { id: 't1', name: 'Record Toggl video assessment', project: 'Toggl video assessment', estimate: '45m' },
  { id: 't2', name: 'Prep Azos interview', project: 'Azos — PM B2C Policyholder', estimate: '1h' },
  { id: 't3', name: 'Weekly planning', project: 'Personal', estimate: '30m' },
]

export const MOCK_REPORTS = [
  { label: 'Logged', value: LOGGED_TOTAL, hint: 'This week' },
  { label: 'Planned', value: PLANNED_TOTAL, hint: 'This week' },
  { label: 'Billable', value: '0h', hint: 'No billable tags' },
  { label: 'Utilization', value: '89%', hint: 'vs 8h target' },
]
