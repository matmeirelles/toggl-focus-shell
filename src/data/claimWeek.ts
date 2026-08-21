export type ClaimOrigin = 'matched' | 'other' | 'skipped'
export type ClaimDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'

export type ClaimBlock = {
  id: string
  title: string
  day: ClaimDay
  dayIndex: number
  iso: string
  durationMin: number
  startMin: number
  origin: ClaimOrigin
  defaultOn: boolean
}

export const CLAIM_RATE = 90

export function formatClaimHours(min: number) {
  const hours = min / 60
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1)
}

export function formatClaimMoney(min: number) {
  return `$${Math.round((min / 60) * CLAIM_RATE).toLocaleString('en-US')}`
}

export function formatClaimDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h && m) return `${h}h${m}`
  if (h) return `${h}h`
  return `${m}m`
}

export function formatClaimDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getProjectBlocks(assignedIds: Set<string>) {
  const assigned = CLAIM_BLOCKS.filter((block) => assignedIds.has(block.id))
  const blocks = assigned.length > 0 ? assigned : CLAIM_BLOCKS.filter((block) => block.defaultOn)
  return blocks.slice().sort((a, b) => (a.iso < b.iso ? 1 : a.iso > b.iso ? -1 : 0))
}

export const CLAIM_BLOCKS: ClaimBlock[] = [
  { id: 'a1', title: 'Acme homepage design', day: 'Mon', dayIndex: 0, iso: '2026-08-17', durationMin: 150, startMin: 9 * 60, origin: 'matched', defaultOn: true },
  { id: 'a2', title: 'Acme client sync', day: 'Tue', dayIndex: 1, iso: '2026-08-18', durationMin: 60, startMin: 10 * 60, origin: 'matched', defaultOn: true },
  { id: 'a3', title: 'Acme design review', day: 'Wed', dayIndex: 2, iso: '2026-08-19', durationMin: 90, startMin: 14 * 60, origin: 'matched', defaultOn: true },
  { id: 'a4', title: 'Acme dev handoff', day: 'Thu', dayIndex: 3, iso: '2026-08-20', durationMin: 150, startMin: 9 * 60, origin: 'matched', defaultOn: true },
  { id: 'a5', title: 'Acme QA + fixes', day: 'Fri', dayIndex: 4, iso: '2026-08-21', durationMin: 60, startMin: 10 * 60, origin: 'matched', defaultOn: true },
  { id: 'o1', title: 'Landing page build', day: 'Tue', dayIndex: 1, iso: '2026-08-18', durationMin: 120, startMin: 13 * 60, origin: 'other', defaultOn: false },
  { id: 'o2', title: 'Discovery call', day: 'Thu', dayIndex: 3, iso: '2026-08-20', durationMin: 60, startMin: 13 * 60, origin: 'other', defaultOn: false },
  { id: 'o3', title: 'Proposal writing', day: 'Thu', dayIndex: 3, iso: '2026-08-20', durationMin: 90, startMin: 15 * 60, origin: 'other', defaultOn: false },
  { id: 'mon-lunch', title: 'Lunch', day: 'Mon', dayIndex: 0, iso: '2026-08-17', durationMin: 60, startMin: 12 * 60, origin: 'skipped', defaultOn: false },
  { id: 'wed-lunch-logged', title: 'Lunch', day: 'Wed', dayIndex: 2, iso: '2026-08-19', durationMin: 60, startMin: 12 * 60, origin: 'skipped', defaultOn: false },
  { id: 'fri-lunch', title: 'Lunch', day: 'Fri', dayIndex: 4, iso: '2026-08-21', durationMin: 60, startMin: 12 * 60, origin: 'skipped', defaultOn: false },
  { id: 'thu-therapy', title: 'Therapy', day: 'Thu', dayIndex: 3, iso: '2026-08-20', durationMin: 75, startMin: 17 * 60, origin: 'skipped', defaultOn: false },
  { id: 'thu-azos', title: 'Focus time', day: 'Thu', dayIndex: 3, iso: '2026-08-20', durationMin: 45, startMin: 14 * 60, origin: 'skipped', defaultOn: false },
]
