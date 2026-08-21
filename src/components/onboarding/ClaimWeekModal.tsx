import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { ChevronDown, ChevronRight, Sparkles, X } from 'lucide-react'

type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
type Origin = 'matched' | 'other' | 'skipped'
type Assignment = 'acme' | 'none' | 'new'
type View = 'claim' | 'done' | 'invoice'

type Row = {
  id: string
  title: string
  day: Day
  durationMin: number
  startHour: number
  origin: Origin
  assignment: Assignment
}

const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const RATE = 90
const CAL_START = 9
const CAL_HOURS = 9
const PX_PER_HOUR = 34

const SEED: Row[] = [
  { id: 'a1', title: 'Acme homepage design', day: 'Mon', durationMin: 150, startHour: 9, origin: 'matched', assignment: 'acme' },
  { id: 'a2', title: 'Acme client sync', day: 'Tue', durationMin: 60, startHour: 10, origin: 'matched', assignment: 'acme' },
  { id: 'a3', title: 'Acme design review', day: 'Wed', durationMin: 90, startHour: 14, origin: 'matched', assignment: 'acme' },
  { id: 'a4', title: 'Acme dev handoff', day: 'Thu', durationMin: 150, startHour: 9, origin: 'matched', assignment: 'acme' },
  { id: 'a5', title: 'Acme QA + fixes', day: 'Fri', durationMin: 60, startHour: 10, origin: 'matched', assignment: 'acme' },
  { id: 'o1', title: 'Landing page build', day: 'Tue', durationMin: 120, startHour: 13, origin: 'other', assignment: 'none' },
  { id: 'o2', title: 'Discovery call', day: 'Thu', durationMin: 60, startHour: 13, origin: 'other', assignment: 'none' },
  { id: 'o3', title: 'Proposal writing', day: 'Thu', durationMin: 90, startHour: 14.25, origin: 'other', assignment: 'none' },
  { id: 's1', title: 'Lunch', day: 'Mon', durationMin: 60, startHour: 12, origin: 'skipped', assignment: 'none' },
  { id: 's2', title: 'Lunch', day: 'Wed', durationMin: 60, startHour: 12, origin: 'skipped', assignment: 'none' },
  { id: 's3', title: 'Lunch', day: 'Fri', durationMin: 60, startHour: 12, origin: 'skipped', assignment: 'none' },
  { id: 's4', title: 'Therapy', day: 'Thu', durationMin: 75, startHour: 16, origin: 'skipped', assignment: 'none' },
  { id: 's5', title: 'Focus time', day: 'Thu', durationMin: 45, startHour: 11.5, origin: 'skipped', assignment: 'none' },
]

function formatDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h && m) return `${h}h${m}`
  if (h) return `${h}h`
  return `${m}m`
}

function formatHours(min: number) {
  const hours = min / 60
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1)
}

function formatMoney(value: number) {
  return `$${Math.round(value)}`
}

function valueOf(min: number) {
  return (min / 60) * RATE
}

type ClaimWeekModalProps = {
  onComplete: () => void
  onDismiss: () => void
}

export function ClaimWeekModal({ onComplete, onDismiss }: ClaimWeekModalProps) {
  const [view, setView] = useState<View>('claim')
  const [rows, setRows] = useState<Row[]>(SEED)
  const [skippedOpen, setSkippedOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [chipPulse, setChipPulse] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const prevTotal = useRef<number | null>(null)

  const acmeRows = rows.filter((row) => row.origin === 'matched')
  const otherRows = rows.filter((row) => row.origin === 'other')
  const skippedRows = rows.filter((row) => row.origin === 'skipped')

  const claimedMin = rows
    .filter((row) => row.assignment === 'acme')
    .reduce((sum, row) => sum + row.durationMin, 0)
  const otherMin = otherRows
    .filter((row) => row.assignment !== 'acme')
    .reduce((sum, row) => sum + row.durationMin, 0)
  const totalHours = formatHours(claimedMin)
  const totalValue = formatMoney(valueOf(claimedMin))
  const otherHours = formatHours(otherMin)
  const otherValue = formatMoney(valueOf(otherMin))

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') event.preventDefault()
    }
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onPointerDown)
    }
  }, [])

  useEffect(() => {
    if (prevTotal.current === null) {
      prevTotal.current = claimedMin
      return
    }
    if (prevTotal.current === claimedMin) return
    prevTotal.current = claimedMin
    setChipPulse(true)
    const id = window.setTimeout(() => setChipPulse(false), 180)
    return () => window.clearTimeout(id)
  }, [claimedMin])

  const acmeOrder = useMemo(() => {
    return rows
      .filter((row) => row.assignment === 'acme')
      .slice()
      .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.startHour - b.startHour)
      .map((row) => row.id)
  }, [rows])

  const updateRow = (id: string, patch: Partial<Row>) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  const TotalChip = (
    <div
      className={`shrink-0 rounded-full px-3 py-1 text-[13px] font-semibold tabular-nums transition-all duration-150 ${
        chipPulse ? 'scale-105 bg-[#E477C4] text-[#0F0F0F]' : 'scale-100 bg-[#2A2A2A] text-white'
      }`}
    >
      {totalHours}h · {totalValue}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 font-sans">
      <div className="absolute inset-0 bg-[#0F0F0F]">
        <FauxWeekCalendar rows={rows} reveal={view !== 'claim'} acmeOrder={acmeOrder} />
      </div>
      <div className={`absolute inset-0 transition-colors duration-200 ${view === 'claim' ? 'bg-[#0F0F0F]/72' : 'bg-[#0F0F0F]/42'}`} />

      <div className="relative flex h-full items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="claim-week-title"
          className="relative flex max-h-[85vh] w-[min(720px,92vw)] flex-col rounded-2xl border border-[#2A2A2A] bg-[#1B1B1B] shadow-[0_24px_80px_rgb(0_0_0_/_55%)]"
        >
          {/* TEST: remove dismiss before submission */}
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onDismiss}
            className="absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>

          {view === 'claim' ? (
            <>
              <header className="shrink-0 border-b border-[#2A2A2A] px-8 pt-8 pb-5">
                <div className="flex items-start justify-between gap-6 pr-6">
                  <div className="min-w-0">
                    <h1 id="claim-week-title" className="text-[22px] leading-7 font-semibold text-white">
                      Here&apos;s your Acme week — rebuilt from your calendar
                    </h1>
                    <p className="mt-2 text-[14px] leading-5 text-[#9CA3AF]">
                      We scanned your last 7 days and matched what looks like Acme work. Confirm below — no
                      timesheet needed.
                    </p>
                  </div>
                  {TotalChip}
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto px-8 py-5">
                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <h2 className="text-[13px] font-semibold tracking-wide text-white uppercase">
                      Matched to Acme
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E477C4]/15 px-2 py-0.5 text-[11px] font-medium text-[#E477C4]">
                      <Sparkles size={11} />
                      AI matched
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {acmeRows.map((row) => (
                      <BlockRow
                        key={row.id}
                        row={row}
                        claimed={row.assignment === 'acme'}
                        trailing={
                          <Toggle
                            on={row.assignment === 'acme'}
                            onChange={(on) => updateRow(row.id, { assignment: on ? 'acme' : 'none' })}
                          />
                        }
                      />
                    ))}
                  </div>
                </section>

                <section className="mt-7">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-wide text-white uppercase">
                    Other work · assign?
                  </h2>
                  <div className="flex flex-col gap-2">
                    {otherRows.map((row) => (
                      <BlockRow
                        key={row.id}
                        row={row}
                        claimed={row.assignment === 'acme'}
                        trailing={
                          <AssignMenu
                            open={openMenu === row.id}
                            assignment={row.assignment}
                            menuRef={openMenu === row.id ? menuRef : undefined}
                            onToggle={() => setOpenMenu((current) => (current === row.id ? null : row.id))}
                            onSelect={(assignment) => {
                              updateRow(row.id, { assignment })
                              setOpenMenu(null)
                            }}
                          />
                        }
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-[13px] text-[#9CA3AF]">
                    ~{otherHours}h · {otherValue} potential
                  </p>
                </section>

                <section className="mt-7 mb-2">
                  <button
                    type="button"
                    onClick={() => setSkippedOpen((open) => !open)}
                    className="flex w-full items-center gap-2 text-left text-[13px] text-[#9CA3AF] transition-colors duration-150 hover:text-white"
                  >
                    <ChevronRight
                      size={14}
                      className={`shrink-0 transition-transform duration-150 ${skippedOpen ? 'rotate-90' : ''}`}
                    />
                    <span>
                      AI skipped {skippedRows.length} personal blocks (
                      {uniqueTitles(skippedRows) || 'none left'}) · Review
                    </span>
                  </button>
                  {skippedOpen ? (
                    <div className="mt-3 flex flex-col gap-2">
                      {skippedRows.map((row) => (
                        <BlockRow
                          key={row.id}
                          row={row}
                          claimed={false}
                          trailing={
                            <button
                              type="button"
                              onClick={() =>
                                updateRow(row.id, { origin: 'matched', assignment: 'acme' })
                              }
                              className="text-[12px] font-medium text-[#E477C4] transition-colors duration-150 hover:text-white"
                            >
                              Add anyway
                            </button>
                          }
                        />
                      ))}
                    </div>
                  ) : null}
                </section>
              </div>

              <footer className="shrink-0 border-t border-[#2A2A2A] px-8 py-5">
                <button
                  type="button"
                  onClick={() => setView('done')}
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-[#E477C4] text-[14px] font-semibold text-[#0F0F0F] transition-opacity duration-150 hover:opacity-90"
                >
                  Confirm → See my week
                </button>
              </footer>
            </>
          ) : null}

          {view === 'done' ? (
            <div className="claim-pop flex flex-col items-center px-10 py-14 text-center">
              <p className="text-[32px] leading-8 font-bold tabular-nums text-white">
                {totalHours}h · {totalValue}
              </p>
              <p className="mt-4 max-w-[460px] text-[15px] leading-6 text-white">
                Your Acme week, rebuilt from your calendar — no manual timesheet.
              </p>
              <p className="mt-3 max-w-[460px] text-[14px] leading-5 text-[#9CA3AF]">
                {otherHours}h of other work still unassigned — set up those clients to see your full week.
              </p>
              <p className="mt-2 text-[12px] leading-4 text-[#9CA3AF]/80">
                Estimated from your calendar. Track live to keep it exact.
              </p>
              <div className="mt-8 flex w-full max-w-[420px] flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setView('invoice')}
                  className="flex h-11 items-center justify-center rounded-xl bg-[#E477C4] text-[14px] font-semibold text-[#0F0F0F] transition-opacity duration-150 hover:opacity-90"
                >
                  Create invoice →
                </button>
                <button
                  type="button"
                  onClick={onComplete}
                  className="flex h-11 items-center justify-center rounded-xl border border-[#2A2A2A] text-[14px] font-semibold text-white transition-colors duration-150 hover:bg-white/5"
                >
                  Back to my week
                </button>
              </div>
            </div>
          ) : null}

          {view === 'invoice' ? (
            <div className="claim-pop px-10 py-14 text-center">
              <p className="text-[12px] font-semibold tracking-[0.12em] text-[#9CA3AF] uppercase">
                Invoice draft
              </p>
              <p className="mt-3 text-[22px] font-semibold text-white">INV-1042 · Acme</p>
              <p className="mt-6 text-[32px] font-bold tabular-nums text-white">
                {totalHours}h · {totalValue}
              </p>
              <p className="mt-2 text-[14px] text-[#9CA3AF]">{formatHours(claimedMin)}h × $90/h</p>
              <p className="mt-6 text-[13px] text-[#9CA3AF]">Saved as a draft. No email sent.</p>
              <button
                type="button"
                onClick={() => setView('done')}
                className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#E477C4] px-6 text-[14px] font-semibold text-[#0F0F0F] transition-opacity duration-150 hover:opacity-90"
              >
                Done
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function uniqueTitles(rows: Row[]) {
  return [...new Set(rows.map((row) => row.title))].join(', ')
}

function BlockRow({
  row,
  claimed,
  trailing,
}: {
  row: Row
  claimed: boolean
  trailing: ReactNode
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-150 ${
        claimed ? 'border-[#2DD4BF]/35 bg-[#2DD4BF]/8' : 'border-[#2A2A2A] bg-[#141414]'
      }`}
    >
      <span
        className={`size-2.5 shrink-0 rounded-full transition-colors duration-150 ${
          claimed ? 'bg-[#2DD4BF]' : 'bg-[#6B7280]'
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium text-white">{row.title}</p>
      </div>
      <span className="hidden w-10 shrink-0 text-[13px] text-[#9CA3AF] sm:block">{row.day}</span>
      <span className="w-12 shrink-0 text-right text-[13px] tabular-nums text-[#9CA3AF]">
        {formatDuration(row.durationMin)}
      </span>
      {claimed ? (
        <span className="w-12 shrink-0 text-right text-[13px] font-medium tabular-nums text-white">
          {formatMoney(valueOf(row.durationMin))}
        </span>
      ) : (
        <span className="w-12 shrink-0" />
      )}
      <div className="shrink-0">{trailing}</div>
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-10 rounded-full transition-colors duration-150 ${
        on ? 'bg-[#E477C4]' : 'bg-[#3A3A3A]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform duration-150 ${
          on ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function AssignMenu({
  open,
  assignment,
  menuRef,
  onToggle,
  onSelect,
}: {
  open: boolean
  assignment: Assignment
  menuRef?: RefObject<HTMLDivElement | null>
  onToggle: () => void
  onSelect: (assignment: Assignment) => void
}) {
  const label = assignment === 'acme' ? 'Acme' : assignment === 'new' ? 'New client' : 'Assign to'
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-8 items-center gap-1 rounded-lg border px-2.5 text-[12px] font-medium transition-colors duration-150 ${
          assignment === 'acme'
            ? 'border-[#2DD4BF]/40 text-[#2DD4BF]'
            : 'border-[#2A2A2A] text-[#9CA3AF] hover:text-white'
        }`}
      >
        {label}
        <ChevronDown size={12} />
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1B1B1B] py-1 shadow-[0_8px_24px_rgb(0_0_0_/_45%)]">
          <button
            type="button"
            onClick={() => onSelect('acme')}
            className="flex w-full px-3 py-1.5 text-left text-[13px] text-white hover:bg-white/5"
          >
            Acme
          </button>
          <button
            type="button"
            onClick={() => onSelect('new')}
            className="flex w-full px-3 py-1.5 text-left text-[13px] text-white hover:bg-white/5"
          >
            + New client
          </button>
        </div>
      ) : null}
    </div>
  )
}

function FauxWeekCalendar({
  rows,
  reveal,
  acmeOrder,
}: {
  rows: Row[]
  reveal: boolean
  acmeOrder: string[]
}) {
  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col px-16 pt-10 pb-8 opacity-70">
      <div className="mb-3 grid grid-cols-5 gap-3 px-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-[12px] font-medium text-[#9CA3AF]">
            {day}
          </div>
        ))}
      </div>
      <div
        className="relative grid flex-1 grid-cols-5 gap-3"
        style={{ minHeight: CAL_HOURS * PX_PER_HOUR }}
      >
        {DAYS.map((day) => (
          <div key={day} className="relative rounded-xl border border-[#2A2A2A] bg-[#141414]">
            {rows
              .filter((row) => row.day === day)
              .map((row) => {
                const claimed = row.assignment === 'acme'
                const teal = reveal && claimed
                const delay = teal ? `${Math.max(acmeOrder.indexOf(row.id), 0) * 90}ms` : '0ms'
                return (
                  <div
                    key={row.id}
                    className="absolute right-1.5 left-1.5 overflow-hidden rounded-md px-1.5 py-1 text-[10px] leading-3 font-medium"
                    style={{
                      top: (row.startHour - CAL_START) * PX_PER_HOUR + 8,
                      height: Math.max((row.durationMin / 60) * PX_PER_HOUR - 4, 18),
                      background: teal ? '#2DD4BF' : '#3A3A3A',
                      color: teal ? '#0F0F0F' : '#9CA3AF',
                      transition: 'background-color 200ms ease, color 200ms ease',
                      transitionDelay: delay,
                    }}
                  >
                    <span className="block truncate">{row.title}</span>
                  </div>
                )
              })}
          </div>
        ))}
      </div>
    </div>
  )
}
