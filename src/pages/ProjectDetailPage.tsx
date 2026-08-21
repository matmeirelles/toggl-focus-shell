import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, ChevronLeft, EllipsisVertical, Lock, User } from 'lucide-react'
import { ProjectTimeTab } from '../components/project/ProjectTimeTab'
import { ProjectOverviewTab } from '../components/project/ProjectOverviewTab'
import { getProjectBlocks } from '../data/claimWeek'
import { useWeekAssignment } from '../context/WeekAssignmentContext'

const TABS = ['Time', 'Overview', 'Tasks', 'Board', 'Timeline', 'Dashboard', 'Members'] as const

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { assignedIds } = useWeekAssignment()
  const [tab, setTab] = useState<(typeof TABS)[number]>('Time')
  const blocks = getProjectBlocks(assignedIds)

  if (projectId !== 'acme') {
    return <Navigate to="/projects" replace />
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-toggl-app">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[#2e2e2e] px-4">
        <button
          type="button"
          aria-label="Back to projects"
          onClick={() => navigate('/projects')}
          className="flex size-8 items-center justify-center rounded-lg text-[#a1a1a1] hover:bg-white/5 hover:text-white"
        >
          <ChevronLeft size={18} />
        </button>
        <Lock size={14} className="text-[#8a8a8a]" />
        <span className="text-[14px] font-semibold text-white">Acme</span>
        <span className="flex items-center gap-1 text-[13px] text-[#a1a1a1]">
          <User size={13} />
          Acme Inc.
        </span>
        <button
          type="button"
          aria-label="Project menu"
          className="flex size-8 items-center justify-center rounded-lg text-[#8a8a8a] hover:bg-white/5 hover:text-white"
        >
          <EllipsisVertical size={16} />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 items-center gap-1 rounded-lg px-3 text-[13px] text-[#a1a1a1]"
          >
            Saved views
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className="flex h-8 items-center rounded-full bg-[#E57CD8] px-3 text-[13px] font-semibold text-[#0F0F0F]"
          >
            + Invite
          </button>
        </div>
      </header>

      <div className="flex h-11 shrink-0 items-center gap-5 border-b border-[#2e2e2e] px-5">
        {TABS.map((item) => {
          const active = tab === item
          const enabled = item === 'Time' || item === 'Overview'
          return (
            <button
              key={item}
              type="button"
              disabled={!enabled}
              onClick={() => enabled && setTab(item)}
              className={`relative h-11 text-[14px] ${
                active
                  ? 'font-semibold text-white'
                  : enabled
                    ? 'text-[#a1a1a1] hover:text-white'
                    : 'cursor-default text-[#575456]'
              }`}
            >
              {item}
              {active ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#E57CD8]" />
              ) : null}
            </button>
          )
        })}
      </div>

      {tab === 'Time' ? <ProjectTimeTab blocks={blocks} /> : null}
      {tab === 'Overview' ? <ProjectOverviewTab /> : null}
    </main>
  )
}
