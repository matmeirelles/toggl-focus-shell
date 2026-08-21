export type ClaimOrigin = 'matched' | 'other' | 'skipped'
export type ClaimDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'

export type ClaimBlock = {
  id: string
  title: string
  day: ClaimDay
  dayIndex: number
  durationMin: number
  startMin: number
  origin: ClaimOrigin
  defaultOn: boolean
}

export const CLAIM_RATE = 90

export const CLAIM_BLOCKS: ClaimBlock[] = [
  { id: 'a1', title: 'Acme homepage design', day: 'Mon', dayIndex: 0, durationMin: 150, startMin: 9 * 60, origin: 'matched', defaultOn: true },
  { id: 'a2', title: 'Acme client sync', day: 'Tue', dayIndex: 1, durationMin: 60, startMin: 10 * 60, origin: 'matched', defaultOn: true },
  { id: 'a3', title: 'Acme design review', day: 'Wed', dayIndex: 2, durationMin: 90, startMin: 14 * 60, origin: 'matched', defaultOn: true },
  { id: 'a4', title: 'Acme dev handoff', day: 'Thu', dayIndex: 3, durationMin: 150, startMin: 9 * 60, origin: 'matched', defaultOn: true },
  { id: 'a5', title: 'Acme QA + fixes', day: 'Fri', dayIndex: 4, durationMin: 60, startMin: 10 * 60, origin: 'matched', defaultOn: true },
  { id: 'o1', title: 'Landing page build', day: 'Tue', dayIndex: 1, durationMin: 120, startMin: 13 * 60, origin: 'other', defaultOn: false },
  { id: 'o2', title: 'Discovery call', day: 'Thu', dayIndex: 3, durationMin: 60, startMin: 13 * 60, origin: 'other', defaultOn: false },
  { id: 'o3', title: 'Proposal writing', day: 'Thu', dayIndex: 3, durationMin: 90, startMin: 15 * 60, origin: 'other', defaultOn: false },
  { id: 'mon-lunch', title: 'Lunch', day: 'Mon', dayIndex: 0, durationMin: 60, startMin: 12 * 60, origin: 'skipped', defaultOn: false },
  { id: 'wed-lunch-logged', title: 'Lunch', day: 'Wed', dayIndex: 2, durationMin: 60, startMin: 12 * 60, origin: 'skipped', defaultOn: false },
  { id: 'fri-lunch', title: 'Lunch', day: 'Fri', dayIndex: 4, durationMin: 60, startMin: 12 * 60, origin: 'skipped', defaultOn: false },
  { id: 'thu-therapy', title: 'Therapy', day: 'Thu', dayIndex: 3, durationMin: 75, startMin: 17 * 60, origin: 'skipped', defaultOn: false },
  { id: 'thu-azos', title: 'Focus time', day: 'Thu', dayIndex: 3, durationMin: 45, startMin: 14 * 60, origin: 'skipped', defaultOn: false },
]
