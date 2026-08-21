import { MOCK_PROJECTS } from '../data/mockCalendar'

export function ProjectsPage() {
  return (
    <main className="min-h-0 flex-1 overflow-auto bg-toggl-app px-8 py-6">
      <h1 className="text-[20px] leading-7 font-semibold text-toggl-text">Projects</h1>
      <p className="mt-1 text-[14px] text-toggl-muted">Workspace projects used in this week’s calendar.</p>
      <div className="mt-6 overflow-hidden rounded-lg border border-toggl-stroke">
        <div className="grid grid-cols-[1fr_160px_88px] border-b border-toggl-stroke bg-toggl-secondary px-4 py-2 text-[12px] font-medium text-toggl-muted">
          <span>Project</span>
          <span>Client</span>
          <span className="text-right">This week</span>
        </div>
        {MOCK_PROJECTS.map((project) => (
          <div
            key={project.id}
            className="grid grid-cols-[1fr_160px_88px] border-b border-toggl-stroke px-4 py-3 last:border-b-0"
          >
            <span className="text-[14px] font-medium">{project.name}</span>
            <span className="text-[14px] text-toggl-muted">{project.client}</span>
            <span className="text-right text-[14px] tabular-nums text-toggl-muted">{project.hours}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
