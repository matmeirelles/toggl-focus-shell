import { MOCK_REPORTS } from '../data/mockCalendar'

export function ReportsPage() {
  return (
    <main className="min-h-0 flex-1 overflow-auto bg-toggl-app px-8 py-6">
      <h1 className="text-[20px] leading-7 font-semibold text-toggl-text">Reports</h1>
      <p className="mt-1 text-[14px] text-toggl-muted">This week • W34</p>
      <div className="mt-6 grid grid-cols-4 gap-3">
        {MOCK_REPORTS.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-toggl-stroke bg-toggl-elevated p-4"
          >
            <div className="text-[12px] font-medium text-toggl-muted">{card.label}</div>
            <div className="mt-2 text-[22px] font-semibold tabular-nums">{card.value}</div>
            <div className="mt-1 text-[12px] text-toggl-muted">{card.hint}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
