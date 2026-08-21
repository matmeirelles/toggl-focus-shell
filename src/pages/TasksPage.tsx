import { MOCK_TASKS } from '../data/mockCalendar'

export function TasksPage() {
  return (
    <main className="min-h-0 flex-1 overflow-auto bg-toggl-app px-8 py-6">
      <h1 className="text-[20px] leading-7 font-semibold text-toggl-text">Tasks</h1>
      <p className="mt-1 text-[14px] text-toggl-muted">Open tasks tied to the mocked week.</p>
      <div className="mt-6 overflow-hidden rounded-lg border border-toggl-stroke">
        <div className="grid grid-cols-[1fr_220px_88px] border-b border-toggl-stroke bg-toggl-secondary px-4 py-2 text-[12px] font-medium text-toggl-muted">
          <span>Task</span>
          <span>Project</span>
          <span className="text-right">Estimate</span>
        </div>
        {MOCK_TASKS.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-[1fr_220px_88px] border-b border-toggl-stroke px-4 py-3 last:border-b-0"
          >
            <span className="text-[14px] font-medium">{task.name}</span>
            <span className="text-[14px] text-toggl-muted">{task.project}</span>
            <span className="text-right text-[14px] tabular-nums text-toggl-muted">{task.estimate}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
