import { useState } from 'react'
import {
  CalendarDays,
  ChartColumn,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  Download,
  Funnel,
  Info,
  Settings,
  Star,
  Wallet,
  X,
} from 'lucide-react'
import { ProfitChart } from '../components/reports/ProfitChart'

const KPIS = [
  { label: 'Revenue', value: '390.00 USD' },
  { label: 'Cost', value: '0.00 USD' },
  { label: 'Profit', value: '390.00 USD' },
  { label: 'Margin', value: '100%', hint: 'Target 30%' },
]

function FilterChip({
  icon: Icon,
  label,
}: {
  icon: typeof CalendarDays
  label: string
}) {
  return (
    <button
      type="button"
      className="flex h-8 items-center gap-2 rounded-lg border border-toggl-stroke px-3 text-[13px] font-medium text-toggl-text"
    >
      <Icon size={14} className="text-toggl-muted" />
      {label}
      <ChevronDown size={14} className="text-toggl-muted" />
    </button>
  )
}

export function ReportsPage() {
  const [showBanner, setShowBanner] = useState(true)

  return (
    <main className="min-h-0 flex-1 overflow-auto bg-toggl-app">
      <div className="px-8 py-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-semibold text-toggl-text">Reports</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-8 items-center gap-2 rounded-lg border border-toggl-stroke px-3 text-[13px] font-medium text-toggl-muted"
            >
              <Download size={14} />
              Export CSV
            </button>
            <button type="button" aria-label="Favorite" className="flex size-8 items-center justify-center rounded-lg text-toggl-muted">
              <Star size={16} />
            </button>
            <button
              type="button"
              className="flex h-8 items-center gap-2 rounded-lg px-2 text-[13px] text-toggl-muted"
            >
              <CircleHelp size={14} />
              How it works
            </button>
            <button type="button" aria-label="Settings" className="flex size-8 items-center justify-center rounded-lg text-toggl-muted">
              <Settings size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <FilterChip icon={ChartColumn} label="Profitability" />
          <div className="flex h-8 items-center overflow-hidden rounded-lg border border-toggl-stroke">
            <button type="button" aria-label="Previous" className="flex size-8 items-center justify-center text-toggl-muted">
              <ChevronLeft size={16} />
            </button>
            <span className="flex items-center gap-2 px-2 text-[13px] font-medium">
              <CalendarDays size={14} className="text-toggl-muted" />
              This week • W34
            </span>
            <button type="button" aria-label="Next" className="flex size-8 items-center justify-center text-toggl-muted">
              <ChevronRight size={16} />
            </button>
          </div>
          <FilterChip icon={Funnel} label="Filters" />
          <FilterChip icon={Wallet} label="Shown in USD" />
        </div>

        {showBanner ? (
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-[#e6c46a] px-4 py-3 text-[#1c1a1c]">
            <CircleAlert size={18} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1 text-[13px] leading-5">
              <div className="font-semibold">Missing data for the selected period</div>
              <ul className="mt-1 list-disc pl-4">
                <li>1 member has no cost rate: Mat Meirelles1991</li>
                <li>1 project does not have estimates or fixed fee set: Mateus</li>
              </ul>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setShowBanner(false)}
              className="rounded p-1 hover:bg-black/10"
            >
              <X size={16} />
            </button>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-4 gap-6 border-b border-toggl-stroke pb-6">
          {KPIS.map((kpi) => (
            <div key={kpi.label}>
              <div className="text-[12px] font-medium text-toggl-muted">{kpi.label}</div>
              <div className="mt-2 text-[22px] font-semibold tabular-nums">{kpi.value}</div>
              {kpi.hint ? <div className="mt-1 text-[12px] text-toggl-muted">{kpi.hint}</div> : null}
            </div>
          ))}
        </div>

        <section className="mt-6">
          <h2 className="text-[16px] font-semibold">How is profitability trending?</h2>
          <div className="mt-4">
            <ProfitChart />
          </div>
          <div className="mt-2 flex items-center justify-center gap-5 text-[12px] text-toggl-muted">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-toggl-accent" />
              Revenue
            </span>
            <span className="flex items-center gap-2">
              <span className="h-px w-4 bg-toggl-text" />
              Profit
            </span>
            <span className="flex items-center gap-2">
              <span className="h-px w-4 border-t border-dashed border-toggl-text" />
              Profit forecast
            </span>
          </div>
        </section>

        <section className="mt-10 border-t border-toggl-stroke pt-6">
          <h2 className="flex items-center gap-2 text-[16px] font-semibold">
            Which projects need attention?
            <Info size={14} className="text-toggl-muted" />
          </h2>
          <p className="mt-1 text-[13px] text-toggl-muted">Margin below 30% target</p>
          <div className="py-16 text-center">
            <div className="text-[22px] font-semibold text-toggl-muted">Nothing to flag</div>
            <p className="mx-auto mt-2 max-w-md text-[13px] text-toggl-muted">
              No projects fall below the 30% margin target. If you expected to see results, check your
              filters above.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
