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
  const [heroTick, setHeroTick] = useState(0)
  const prevTotal = useRef<number | null>(null)
  const reviewing = view === 'claim'

  const matchedRows = rows.filter((row) => row.origin === 'matched')
  const otherRows = rows.filter((row) => row.origin === 'other')
  const skippedRows = rows.filter((row) => row.origin === 'skipped')

  const matchedMin = matchedRows
    .filter((row) => row.assignment === 'project')
    .reduce((sum, row) => sum + row.durationMin, 0)
  const assignedMin = rows
    .filter((row) => row.origin !== 'matched' && row.assignment === 'project')
    .reduce((sum, row) => sum + row.durationMin, 0)
  const unassignedMin = otherRows
    .filter((row) => row.assignment !== 'project')
    .reduce((sum, row) => sum + row.durationMin, 0)
  const claimedMin = matchedMin + assignedMin
  const barTotal = matchedMin + assignedMin + unassignedMin || 1

  const totalHours = formatHours(claimedMin)
  const totalValue = formatMoney(valueOf(claimedMin))
  const potentialValue = formatMoney(valueOf(claimedMin + unassignedMin))
  const unassignedHours = formatHours(unassignedMin)

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
    setHeroTick((tick) => tick + 1)
  }, [claimedMin])

  const setAssigned = (id: string, on: boolean) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, assignment: on ? 'project' : 'none' } : row)),
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-week-title"
        className="relative flex max-h-[85vh] w-[min(900px,94vw)] flex-col overflow-hidden rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] shadow-[0_24px_80px_rgb(0_0_0_/_55%)] min-[720px]:h-[min(85vh,760px)] min-[720px]:flex-row"
      >
        {/* TEST: remove dismiss before submission */}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="absolute top-3 right-3 z-20 flex size-8 items-center justify-center rounded-lg text-[#8a8a8a] hover:bg-white/5 hover:text-white"
        >
          <X size={18} />
        </button>

        <aside
          className={`flex shrink-0 flex-col bg-[linear-gradient(180deg,#16302c_0%,#1a1a1a_56%)] transition-all duration-300 ease-out ${
            reviewing
              ? 'w-full p-6 min-[720px]:w-[340px] min-[720px]:p-7'
              : 'w-full flex-1 items-center justify-center px-8 py-12 min-[720px]:px-16'
          }`}
        >
          {view === 'invoice' ? (
            <InvoiceStub
              totalHours={totalHours}
              totalValue={totalValue}
              claimedMin={claimedMin}
              onBack={() => setView('done')}
            />
          ) : (
            <ValuePanel
              reviewing={reviewing}
              heroTick={heroTick}
              totalValue={totalValue}
              totalHours={totalHours}
              matchedMin={matchedMin}
              assignedMin={assignedMin}
              unassignedMin={unassignedMin}
              barTotal={barTotal}
              potentialValue={potentialValue}
              unassignedHours={unassignedHours}
              onConfirm={() => setView('done')}
              onInvoice={() => setView('invoice')}
              onBack={onComplete}
            />
          )}
        </aside>

        <div
          className={`min-h-0 border-[#2e2e2e] transition-all duration-300 ease-out min-[720px]:border-l ${
            reviewing
              ? 'flex w-full flex-1 flex-col overflow-hidden'
              : 'pointer-events-none max-h-0 overflow-hidden opacity-0 min-[720px]:max-h-none min-[720px]:w-0 min-[720px]:border-l-0 min-[720px]:opacity-0'
          }`}
        >
          <header className="shrink-0 px-6 pt-6 pr-12 pb-4 min-[720px]:px-7 min-[720px]:pt-7">
            <h1 id="claim-week-title" className="text-[18px] leading-6 font-semibold text-white">
              Here&apos;s your Acme week — rebuilt from your calendar
            </h1>
            <p className="mt-1.5 text-[13px] leading-5 text-[#a1a1a1]">
              We scanned your last 7 days and matched what looks like Acme work. Confirm below — no
              timesheet needed.
            </p>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 min-[720px]:px-7">
            <section>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-[12px] font-semibold tracking-wide text-white uppercase">
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
              <h2 className="mb-3 text-[12px] font-semibold tracking-wide text-white uppercase">
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
                ~{unassignedHours}h · {formatMoney(valueOf(unassignedMin))} potential
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
        </div>
      </div>
    </div>
  )
}

function ValuePanel({
  reviewing,
  heroTick,
  totalValue,
  totalHours,
  matchedMin,
  assignedMin,
  unassignedMin,
  barTotal,
  potentialValue,
  unassignedHours,
  onConfirm,
  onInvoice,
  onBack,
}: {
  reviewing: boolean
  heroTick: number
  totalValue: string
  totalHours: string
  matchedMin: number
  assignedMin: number
  unassignedMin: number
  barTotal: number
  potentialValue: string
  unassignedHours: string
  onConfirm: () => void
  onInvoice: () => void
  onBack: () => void
}) {
  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col ${reviewing ? '' : 'max-w-[460px] text-center'}`}
    >
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#8a8a8a] uppercase">
        Last 7 days · Acme
      </p>
      <p
        key={heroTick}
        className={`mt-3 font-bold tabular-nums text-white ${
          reviewing ? 'text-[48px] leading-[52px]' : 'text-[64px] leading-[68px]'
        } ${heroTick > 0 ? 'claim-hero-tick' : ''}`}
      >
        {totalValue}
      </p>
      <p className={`mt-1 tabular-nums text-[#a1a1a1] ${reviewing ? 'text-[18px]' : 'text-[20px]'}`}>
        {totalHours}h billable
      </p>

      {!reviewing ? (
        <p className="claim-pop mt-5 text-[15px] leading-6 text-white">
          Your Acme week, rebuilt from your calendar
        </p>
      ) : null}

      <div className={`my-5 h-px w-full bg-white/10 ${reviewing ? '' : 'opacity-40'}`} />

      <div className={`flex flex-col gap-2.5 ${reviewing ? '' : 'items-center'}`}>
        <BreakdownRow
          tone="teal"
          filled
          label="Matched to Acme"
          hours={matchedMin}
          centered={!reviewing}
        />
        <BreakdownRow
          tone="pink"
          filled
          label="Assigned by you"
          hours={assignedMin}
          centered={!reviewing}
        />
        <BreakdownRow
          tone="gray"
          filled={false}
          label="Still unassigned"
          hours={unassignedMin}
          centered={!reviewing}
        />
      </div>

      <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-[#2e2e2e]">
        <span className="bg-[#2DD4BF] transition-all duration-200" style={{ width: `${(matchedMin / barTotal) * 100}%` }} />
        <span className="bg-[#E57CD8] transition-all duration-200" style={{ width: `${(assignedMin / barTotal) * 100}%` }} />
        <span className="bg-[#6B7280] transition-all duration-200" style={{ width: `${(unassignedMin / barTotal) * 100}%` }} />
      </div>

      {reviewing ? (
        <p className="mt-4 text-[13px] text-[#d4b8ce]">Assign the rest → {potentialValue}</p>
      ) : (
        <p className="mt-4 text-[14px] leading-5 text-[#a1a1a1]">
          {unassignedHours}h of other work still unassigned — set up those clients to see your full week.
        </p>
      )}

      <p className="mt-2 text-[12px] leading-4 text-[#8a8a8a]">
        {reviewing
          ? 'Rebuilt from your calendar. No timesheet.'
          : 'Estimated from your calendar. Track live to keep it exact.'}
      </p>

      <div className={`mt-auto flex flex-col gap-3 ${reviewing ? 'pt-6' : 'pt-8'}`}>
        {reviewing ? (
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-[#E57CD8] text-[14px] font-semibold text-[#0F0F0F] transition-opacity duration-150 hover:opacity-90"
          >
            Confirm → See my week
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onInvoice}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-[#E57CD8] text-[14px] font-semibold text-[#0F0F0F] transition-opacity duration-150 hover:opacity-90"
            >
              Create invoice →
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex h-11 w-full items-center justify-center rounded-xl border border-[#2e2e2e] text-[14px] font-semibold text-white transition-colors duration-150 hover:bg-white/5"
            >
              Back to my week
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function BreakdownRow({
  tone,
  filled,
  label,
  hours,
  centered,
}: {
  tone: 'teal' | 'pink' | 'gray'
  filled: boolean
  label: string
  hours: number
  centered: boolean
}) {
  const color = tone === 'teal' ? 'bg-[#2DD4BF]' : tone === 'pink' ? 'bg-[#E57CD8]' : 'bg-[#6B7280]'
  return (
    <div className={`flex w-full items-center gap-2 text-[13px] ${centered ? 'max-w-[320px]' : ''}`}>
      <span
        className={`size-2 shrink-0 rounded-full ${filled ? color : 'border border-[#6B7280] bg-transparent'}`}
      />
      <span className="min-w-0 flex-1 truncate text-[#cfcfcf]">{label}</span>
      <span className="shrink-0 tabular-nums text-white">
        {formatHours(hours)}h · {formatMoney(valueOf(hours))}
      </span>
    </div>
  )
}

function InvoiceStub({
  totalHours,
  totalValue,
  claimedMin,
  onBack,
}: {
  totalHours: string
  totalValue: string
  claimedMin: number
  onBack: () => void
}) {
  return (
    <div className="claim-pop flex w-full max-w-[420px] flex-col items-center text-center">
      <p className="text-[12px] font-semibold tracking-[0.12em] text-[#8a8a8a] uppercase">
        Invoice draft
      </p>
      <p className="mt-3 text-[22px] font-semibold text-white">INV-1042 · Acme</p>
      <p className="mt-6 text-[48px] leading-[52px] font-bold tabular-nums text-white">{totalValue}</p>
      <p className="mt-2 text-[14px] text-[#a1a1a1]">
        {totalHours}h × $90/h · {formatHours(claimedMin)}h
      </p>
      <p className="mt-6 text-[13px] text-[#a1a1a1]">Saved as a draft. No email sent.</p>
      <button
        type="button"
        onClick={onBack}
        className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[#E57CD8] px-6 text-[14px] font-semibold text-[#0F0F0F] transition-opacity duration-150 hover:opacity-90"
      >
        Done
      </button>
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
