import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronRight, Sparkles, X } from 'lucide-react'
import { CLAIM_BLOCKS, CLAIM_RATE, type ClaimBlock } from '../../data/claimWeek'
import { useWeekAssignment } from '../../context/WeekAssignmentContext'

type Assignment = 'project' | 'none'
type View = 'claim' | 'done'

type Row = ClaimBlock & { assignment: Assignment }

const SCAN_BLOCKS = CLAIM_BLOCKS.length
const SCAN_HOURS = CLAIM_BLOCKS.reduce((sum, block) => sum + block.durationMin, 0) / 60

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
  return `$${Math.round(value).toLocaleString('en-US')}`
}

function valueOf(min: number) {
  return (min / 60) * CLAIM_RATE
}

type ClaimWeekModalProps = {
  onComplete: () => void
  onSeeProject: () => void
  onDismiss: () => void
}

export function ClaimWeekModal({ onComplete, onSeeProject, onDismiss }: ClaimWeekModalProps) {
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

  const matchedList = rows.filter((row) => row.assignment === 'project')
  const unassignedList = rows.filter(
    (row) => row.origin !== 'skipped' && row.assignment !== 'project',
  )
  const skippedList = rows.filter((row) => row.origin === 'skipped' && row.assignment !== 'project')

  const matchedMin = matchedList.reduce((sum, row) => sum + row.durationMin, 0)
  const unassignedMin = unassignedList.reduce((sum, row) => sum + row.durationMin, 0)
  const barTotal = matchedMin + unassignedMin || 1

  const totalHours = formatHours(matchedMin)
  const totalValue = formatMoney(valueOf(matchedMin))
  const unassignedHours = formatHours(unassignedMin)
  const unassignedValue = formatMoney(valueOf(unassignedMin))

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
      prevTotal.current = matchedMin
      return
    }
    if (prevTotal.current === matchedMin) return
    prevTotal.current = matchedMin
    setHeroTick((tick) => tick + 1)
  }, [matchedMin])

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
          className={`flex shrink-0 flex-col bg-[linear-gradient(180deg,#2a2208_0%,#1a1a1a_52%)] transition-all duration-300 ease-out ${
            reviewing
              ? 'w-full p-6 min-[720px]:w-[340px] min-[720px]:p-7'
              : 'w-full flex-1 items-center justify-center px-8 py-12 min-[720px]:px-16'
          }`}
        >
            <ValuePanel
              reviewing={reviewing}
              heroTick={heroTick}
              totalValue={totalValue}
              totalHours={totalHours}
              matchedMin={matchedMin}
              unassignedMin={unassignedMin}
              unassignedHours={unassignedHours}
              unassignedValue={unassignedValue}
              barTotal={barTotal}
              onConfirm={() => setView('done')}
              onSeeProject={onSeeProject}
              onBack={onComplete}
            />
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
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F5B301]/15 px-2 py-0.5 text-[11px] font-medium text-[#F5B301]">
                  <Sparkles size={11} />
                  AI matched
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {matchedList.map((row) => (
                  <BlockRow
                    key={row.id}
                    row={row}
                    claimed
                    trailing={
                      <Toggle on onChange={(on) => setAssigned(row.id, on)} />
                    }
                  />
                ))}
              </div>
            </section>

            <section className="mt-7">
              <h2 className="mb-3 text-[12px] font-semibold tracking-wide text-white uppercase">
                Unassigned slots
              </h2>
              {unassignedList.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {unassignedList.map((row) => (
                    <BlockRow
                      key={row.id}
                      row={row}
                      claimed={false}
                      trailing={
                        <Toggle
                          on={false}
                          onChange={(on) => setAssigned(row.id, on)}
                        />
                      }
                    />
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#8a8a8a]">All work slots are assigned to Acme.</p>
              )}
            </section>

            <section className="mt-7 mb-2">
              <button
                type="button"
                onClick={() => setSkippedOpen((open) => !open)}
                className="flex w-full items-center gap-3 rounded-xl border border-[#3c3c3c] bg-[#141414] px-3 py-2.5 text-left transition-colors duration-150 hover:border-[#F5B301]/50 hover:bg-white/5"
              >
                <ChevronRight
                  size={16}
                  className={`shrink-0 text-white transition-transform duration-150 ${skippedOpen ? 'rotate-90' : ''}`}
                />
                <span className="min-w-0 flex-1 text-[13px] text-white">
                  AI skipped {skippedList.length} personal blocks (
                  {uniqueTitles(skippedList) || 'none left'})
                </span>
                <span className="shrink-0 text-[12px] font-semibold text-[#F5B301]">
                  {skippedOpen ? 'Hide' : 'Show'}
                </span>
              </button>
              {skippedOpen ? (
                <div className="mt-3 flex flex-col gap-2">
                  {skippedList.map((row) => (
                    <BlockRow
                      key={row.id}
                      row={row}
                      claimed={false}
                      trailing={
                        <Toggle
                          on={false}
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
  unassignedMin,
  unassignedHours,
  unassignedValue,
  barTotal,
  onConfirm,
  onSeeProject,
  onBack,
}: {
  reviewing: boolean
  heroTick: number
  totalValue: string
  totalHours: string
  matchedMin: number
  unassignedMin: number
  unassignedHours: string
  unassignedValue: string
  barTotal: number
  onConfirm: () => void
  onSeeProject: () => void
  onBack: () => void
}) {
  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col ${reviewing ? '' : 'max-w-[460px] text-center'}`}
    >
      <p className={`font-semibold text-white ${reviewing ? 'text-[22px] leading-7' : 'text-[24px] leading-8'}`}>
        Acme
      </p>
      <p className="mt-1 text-[14px] text-[#a1a1a1]">
        Acme Inc. <span className="text-[#6B7280]">·</span>{' '}
        <span className="tabular-nums text-[#F5B301]">$90/hr</span>
      </p>

      <div className="mt-4 rounded-xl border border-[#3c3c3c] bg-black/20 px-3 py-2.5 text-left">
        <p className="text-[12px] font-medium text-[#cfcfcf]">Last 7 days mapped</p>
        <p className="mt-1 text-[12px] text-[#8a8a8a]">
          {SCAN_BLOCKS} blocks
          <span className="text-[#6B7280]"> · </span>
          {SCAN_HOURS}h found
        </p>
      </div>

      <p
        key={heroTick}
        className={`mt-5 font-bold tabular-nums text-white ${
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
          Your past week
        </p>
      ) : null}

      <div className={`my-5 h-px w-full bg-white/10 ${reviewing ? '' : 'opacity-40'}`} />

      <div className={`flex flex-col gap-2.5 ${reviewing ? '' : 'items-center'}`}>
        <BreakdownRow filled label="Matched to Acme" hours={matchedMin} centered={!reviewing} />
        <BreakdownRow
          filled={false}
          label="Unassigned"
          hours={unassignedMin}
          centered={!reviewing}
        />
      </div>

      <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-[#2e2e2e]">
        <span
          className="bg-[#F5B301] transition-all duration-200"
          style={{ width: `${(matchedMin / barTotal) * 100}%` }}
        />
        <span
          className="bg-[#6B7280] transition-all duration-200"
          style={{ width: `${(unassignedMin / barTotal) * 100}%` }}
        />
      </div>

      {reviewing ? (
        <div className="mt-4 rounded-lg border border-[#F5B301]/45 bg-[#F5B301]/12 px-3 py-2.5">
          <p className="text-[13px] font-semibold text-[#F5B301]">
            Hours not billed → {unassignedHours}h · {unassignedValue}
          </p>
          <p className="mt-0.5 text-[12px] text-[#F5B301]/80">Assign them to bill.</p>
        </div>
      ) : (
        <p className="mt-4 text-[14px] leading-5 text-[#a1a1a1]">
          {unassignedHours}h of other work still unassigned — set up those clients to see your full week.
        </p>
      )}

      <p className="mt-3 text-[12px] leading-4 text-[#8a8a8a]">
        {reviewing
          ? 'Rebuilt from your calendar. No timesheet.'
          : 'Planned from your calendar. Track live to keep it exact.'}
      </p>

      <div className={`mt-auto flex flex-col gap-3 ${reviewing ? 'pt-6' : 'pt-8'}`}>
        {reviewing ? (
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-[#E57CD8] text-[14px] font-semibold text-[#0F0F0F] transition-opacity duration-150 hover:opacity-90"
          >
            Confirm
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onSeeProject}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-[#E57CD8] text-[14px] font-semibold text-[#0F0F0F] transition-opacity duration-150 hover:opacity-90"
            >
              See my project
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
  filled,
  label,
  hours,
  centered,
}: {
  filled: boolean
  label: string
  hours: number
  centered: boolean
}) {
  return (
    <div className={`flex w-full items-center gap-2 text-[13px] ${centered ? 'max-w-[320px]' : ''}`}>
      <span
        className={`size-2 shrink-0 rounded-full ${
          filled ? 'bg-[#F5B301]' : 'border border-[#6B7280] bg-transparent'
        }`}
      />
      <span className="min-w-0 flex-1 truncate text-[#cfcfcf]">{label}</span>
      <span className="shrink-0 tabular-nums text-white">
        {formatHours(hours)}h · {formatMoney(valueOf(hours))}
      </span>
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
        claimed ? 'border-[#F5B301]/40 bg-[#F5B301]/10' : 'border-[#2e2e2e] bg-[#141414]'
      }`}
    >
      <span
        className={`size-2.5 shrink-0 rounded-full transition-colors duration-150 ${
          claimed ? 'bg-[#F5B301]' : 'bg-[#6B7280]'
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
        on ? 'bg-[#F5B301]' : 'bg-[#3A3A3A]'
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
