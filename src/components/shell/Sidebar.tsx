import type { ReactNode } from 'react'
import {
  Bell,
  ChevronDown,
  CircleArrowUp,
  CircleCheckBig,
  CircleHelp,
  ClipboardList,
  Clock3,
  Download,
  Folder,
  ListChecks,
  PanelLeftClose,
  Rows2,
  Send,
  Settings,
  TreePalm,
  User,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { NavItem, SectionLabel } from './NavItem'
import { TogglMark } from '../icons/TogglMark'

function RailButton({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="nav-transition flex size-8 items-center justify-center rounded-lg text-toggl-muted hover:bg-toggl-app hover:text-toggl-hover"
    >
      {children}
    </button>
  )
}

type SidebarProps = {
  onOpenWelcome: () => void
}

export function Sidebar({ onOpenWelcome }: SidebarProps) {
  return (
    <aside
      className="flex h-full shrink-0 border-r border-toggl-stroke bg-toggl-sidebar text-toggl-text"
      style={{ width: 'var(--toggl-sidebar-total)', boxShadow: 'var(--toggl-shadow-sidebar)' }}
    >
      <div
        className="flex flex-col items-center gap-2 py-3"
        style={{ width: 'var(--toggl-sidebar-rail)' }}
      >
        <TogglMark />
        <RailButton label="Collapse sidebar">
          <PanelLeftClose size={16} strokeWidth={1.75} />
        </RailButton>
        <div className="mt-auto flex flex-col items-center gap-2 pb-1">
          <button
            type="button"
            aria-label="Account"
            className="flex size-8 items-center justify-center rounded-full bg-toggl-active text-[11px] font-semibold text-toggl-accent"
          >
            MM
          </button>
          <RailButton label="Notifications">
            <Bell size={16} strokeWidth={1.75} />
          </RailButton>
          <RailButton label="Share feedback">
            <Send size={16} strokeWidth={1.75} />
          </RailButton>
          <RailButton label="Help">
            <CircleHelp size={16} strokeWidth={1.75} />
          </RailButton>
        </div>
      </div>

      <div
        className="flex h-full flex-col border-l border-toggl-stroke/40"
        style={{ width: 'var(--toggl-sidebar-nav)' }}
      >
        <button
          type="button"
          className="flex h-16 w-full items-center gap-2 px-4 py-2.5 pr-2 text-left"
        >
          <span className="min-w-0 flex-1 text-[14px] leading-[20px] font-medium text-toggl-text">
            Mat Meirelles1991's organization
          </span>
          <ChevronDown size={16} className="shrink-0 text-toggl-muted" />
        </button>

        <nav className="flex flex-1 flex-col px-2">
          <SectionLabel>Track</SectionLabel>
          <NavItem icon={Clock3} label="Timer" to="/timer" />

          <SectionLabel>Analyze</SectionLabel>
          <NavItem icon={ClipboardList} label="Reports" to="/reports" />

          <SectionLabel>Plan</SectionLabel>
          <NavItem icon={Folder} label="Projects" to="/projects" />
          <NavItem icon={ListChecks} label="Tasks" to="/tasks" />
          <NavItem icon={Rows2} label="Timeline" paid />

          <SectionLabel>Manage</SectionLabel>
          <NavItem icon={User} label="Members" />
          <NavItem icon={CircleCheckBig} label="Approvals" paid />
          <NavItem icon={TreePalm} label="Time off" paid />
        </nav>

        <div className="mt-auto flex flex-col gap-1 px-2 pb-3">
          <Link
            to="/"
            className="nav-transition flex h-8 w-[184px] items-center rounded-lg px-2 text-[14px] font-medium text-toggl-muted hover:bg-toggl-app hover:text-toggl-hover"
          >
            Restart onboarding
          </Link>

          <button
            type="button"
            onClick={onOpenWelcome}
            className="rounded-lg border border-toggl-stroke p-4 text-left"
            style={{ boxShadow: 'var(--toggl-shadow-raised)' }}
          >
            <div className="mb-2 flex items-center justify-between text-[13px] font-medium">
              <span>Get started</span>
              <span className="text-toggl-muted">›</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-toggl-stroke">
              <div className="h-full w-2/5 rounded-full bg-toggl-accent" />
            </div>
          </button>

          <button
            type="button"
            className="nav-transition flex h-8 w-[184px] items-center gap-3 rounded-lg px-2 text-[14px] font-medium text-toggl-muted hover:bg-toggl-app hover:text-toggl-hover"
          >
            <CircleArrowUp size={16} strokeWidth={1.75} />
            <span className="flex-1 text-left">Upgrade</span>
            <span className="rounded-lg border border-toggl-badge bg-toggl-active px-1.5 text-[10px] leading-4 font-semibold tracking-wide text-toggl-accent uppercase">
              30 days
            </span>
          </button>

          <button
            type="button"
            className="nav-transition flex h-8 w-[184px] items-center gap-3 rounded-lg px-2 text-[14px] font-medium text-toggl-muted hover:bg-toggl-app hover:text-toggl-hover"
          >
            <Download size={16} strokeWidth={1.75} />
            <span>Download apps</span>
          </button>

          <button
            type="button"
            className="nav-transition flex h-8 w-[184px] items-center gap-3 rounded-lg px-2 text-[14px] font-medium text-toggl-muted hover:bg-toggl-app hover:text-toggl-hover"
          >
            <Settings size={16} strokeWidth={1.75} />
            <span>Admin settings</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
