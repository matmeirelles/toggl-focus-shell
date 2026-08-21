import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronRight, Sparkles, X } from 'lucide-react'
import { CLAIM_BLOCKS, CLAIM_RATE, type ClaimBlock } from '../../data/claimWeek'
import { useWeekAssignment } from '../../context/WeekAssignmentContext'

type Assignment = 'project' | 'none'
type View = 'claim' | 'done' | 'invoice'

type Row = ClaimBlock & { assignment: Assignment }

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
  return (min / 60) * CLAIM_RATE
}

type ClaimWeekModalProps = {
  onComplete: () => void
  onDismiss: () => void
}

export function ClaimWeekModal({ onComplete, onDismiss }: ClaimWeekModalProps) {
  const { setAssignedIds } = useWeekAssignment()
  const [view, setView] = useState<View>('claim')
  const [rows, setRows] = useState<Row[]>(() =>
    CLAIM_BLOCKS.map((block) => ({
      ...block,
      assignment: block.defaultOn ? 'project' : 'none',
    })),
  )
  const [skippedOpen, setSkippedOpen] = useState(false)
  const [chipPulse, setChipPulse] = useState(false)
  const prevTotal = useRef<number | null>(null)

  const matchedRows = rows.filter((row) => row.origin === 'matched')
  const otherRows = rows.filter((row) => row.origin === 'other')
  const skippedRows = rows.filter((row) => row.origin === 'skipped')

  const claimedMin = rows
    .filter((row) => row.assignment === 'project')
    .reduce((sum, row) => sum + row.durationMin, 0)
  const otherMin = otherRows
    .filter((row) => row.assignment !== 'project')
    .reduce((sum, row) => sum + row.durationMin, 0)
  const totalHours = formatHours(claimedMin)
  const totalValue = formatMoney(valueOf(claimedMin))
  const otherHours = formatHours(otherMin)
  const otherValue = formatMoney(valueOf(otherMin))

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') event.preventDefault()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    setAssignedIds(rows.filter((row) => row.assignment === 'project').map((row) => row.id))
  }, [rows, setAssignedIds])

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

  const setAssigned = (id: string, on: boolean) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, assignment: on ? 'project' : 'none' } : row)),
    )
  }

  const TotalChip = (
    <div
      className={`shrink-0 rounded-full px-3 py-1 text-[13px] font-semibold tabular-nums transition-all duration-150 ${
        chipPulse ? 'scale-105 bg-[#E57CD8] text-[#0F0F0F]' : 'scale-100 bg-[#2e2e2e] text-white'
      }`}
    >
      {totalHours}h · {totalValue}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-week-title"
        className="relative flex max-h-[85vh] w-[min(720px,92vw)] flex-col rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] shadow-[0_24px_80px_rgb(0_0_0_/_55%)]"
      >
        {/* TEST: remove dismiss before submission */}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-lg text-[#8a8a8a] hover:bg-white/5 hover:text-white"
        >
          <X size={18} />
        </button>

        {view === 'claim' ? (
          <>
            <header className="shrink-0 border-b border-[#2e2e2e] px-8 pt-8 pb-5">
              <div className="flex items-start justify-between gap-6 pr-6">
                <div className="min-w-0">
                  <h1 id="claim-week-title" className="text-[22px] leading-7 font-semibold text-white">
                    Here&apos;s your Acme week — rebuilt from your calendar
                  </h1>
                  <p className="mt-2 text-[14px] leading-5 text-[#a1a1a1]">
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
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E57CD8]/15 px-2 py-0.5 text-[11px] font-medium text-[#E57CD8]">
                    <Sparkles size={11} />
                    AI matched
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {matchedRows.map((row) => (
                    <BlockRow
                      key={row.id}
                      row={row}
                      claimed={row.assignment === 'project'}
                      trailing={
                        <Toggle
                          on={row.assignment === 'project'}
                          onChange={(on) => setAssigned(row.id, on)}
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
                      claimed={row.assignment === 'project'}
                      trailing={
                        <Toggle
                          on={row.assignment === 'project'}
                          onChange={(on) => setAssigned(row.id, on)}
                        />
                      }
                    />
                  ))}
                </div>
                <p className="mt-3 text-[13px] text-[#a1a1a1]">
                  ~{otherHours}h · {otherValue} potential
                </p>
              </section>

              <section className="mt-7 mb-2">
                <button
                  type="button"
                  onClick={() => setSkippedOpen((open) => !open)}
                  className="flex w-full items-center gap-2 text-left text-[13px] text-[#a1a1a1] transition-colors duration-150 hover:text-white"
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
                        claimed={row.assignment === 'project'}
                        trailing={
                          <Toggle
                            on={row.assignment === 'project'}
                            onChange={(on) => setAssigned(row.id, on)}
                          />
                        }
                      />
                    ))}
                  </div>
                ) : null}
              </section>
            </div>

            <footer className="shrink-0 border-t border-[#2e2e2e] px-8 py-5">
              <button
                type="button"
                onClick={() => setView('done')}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-[#E57CD8] text-[14px] font-semibold text-[#0F0F0F] transition-opacity duration-150 hover:opacity-90"
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
            <p className="mt-3 max-w-[460px] text-[14px] leading-5 text-[#a1a1a1]">
              {otherHours}h of other work still unassigned — set up those clients to see your full week.
            </p>
            <p className="mt-2 text-[12px] leading-4 text-[#8a8a8a]">
              Estimated from your calendar. Track live to keep it exact.
            </p>
            <div className="mt-8 flex w-full max-w-[420px] flex-col gap-3">
              <button
                type="button"
                onClick={() => setView('invoice')}
                className="flex h-11 items-center justify-center rounded-xl bg-[#E57CD8] text-[14px] font-semibold text-[#0F0F0F] transition-opacity duration-150 hover:opacity-90"
              >
                Create invoice →
              </button>
              <button
                type="button"
                onClick={onComplete}
                className="flex h-11 items-center justify-center rounded-xl border border-[#2e2e2e] text-[14px] font-semibold text-white transition-colors duration-150 hover:bg-white/5"
              >
                Back to my week
              </button>
            </div>
          </div>
        ) : null}

        {view === 'invoice' ? (
          <div className="claim-pop px-10 py-14 text-center">
            <p className="text-[12px] font-semibold tracking-[0.12em] text-[#8a8a8a] uppercase">
              Invoice draft
            </p>
            <p className="mt-3 text-[22px] font-semibold text-white">INV-1042 · Acme</p>
            <p className="mt-6 text-[32px] font-bold tabular-nums text-white">
              {totalHours}h · {totalValue}
            </p>
            <p className="mt-2 text-[14px] text-[#a1a1a1]">{formatHours(claimedMin)}h × $90/h</p>
            <p className="mt-6 text-[13px] text-[#a1a1a1]">Saved as a draft. No email sent.</p>
            <button
              type="button"
              onClick={() => setView('done')}
              className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#E57CD8] px-6 text-[14px] font-semibold text-[#0F0F0F] transition-opacity duration-150 hover:opacity-90"
            >
              Done
            </button>
          </div>
        ) : null}
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
        claimed ? 'border-[#e6c46a]/40 bg-[#e6c46a]/10' : 'border-[#2e2e2e] bg-[#141414]'
      }`}
    >
      <span
        className={`size-2.5 shrink-0 rounded-full transition-colors duration-150 ${
          claimed ? 'bg-[#e6c46a]' : 'bg-[#2DD4BF]'
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium text-white">{row.title}</p>
      </div>
      <span className="hidden w-10 shrink-0 text-[13px] text-[#a1a1a1] sm:block">{row.day}</span>
      <span className="w-12 shrink-0 text-right text-[13px] tabular-nums text-[#a1a1a1]">
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
        on ? 'bg-[#E57CD8]' : 'bg-[#3A3A3A]'
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
