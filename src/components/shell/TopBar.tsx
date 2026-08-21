import {
  ArrowUp,
  DollarSign,
  EllipsisVertical,
  Play,
} from 'lucide-react'
import { FeatureSlot } from '../../feature/Slot'

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-flex h-4 min-h-4 items-center rounded px-1 text-[12px] leading-none text-toggl-text" style={{ background: 'var(--toggl-surface-on-hover)' }}>
      {children}
    </kbd>
  )
}

function DashedChip({ kbd, label }: { kbd: string; label: string }) {
  return (
    <button
      type="button"
      className="flex h-8 items-center gap-2 rounded-lg border border-dashed border-toggl-stroke-strong px-3.5 text-[14px] font-medium text-toggl-muted"
    >
      <Kbd>{kbd}</Kbd>
      {label}
    </button>
  )
}

export function TopBar() {
  return (
    <header
      className="flex shrink-0 items-center gap-2 border-b border-toggl-stroke bg-toggl-app px-4"
      style={{ height: 'var(--toggl-topbar-height)' }}
    >
      <div className="relative min-w-0 flex-1">
        <input
          type="text"
          aria-label="What are you working on?"
          className="h-10 w-full bg-transparent text-[20px] leading-[28.6px] font-semibold text-toggl-text outline-none placeholder:text-toggl-muted"
          placeholder="What are you working on?"
        />
      </div>

      <DashedChip kbd="@" label="Task" />
      <DashedChip kbd="+" label="Project" />
      <DashedChip kbd="#" label="Tags" />

      <button
        type="button"
        aria-label="Billable"
        className="flex size-9 items-center justify-center rounded-lg text-toggl-muted hover:bg-white/5"
      >
        <DollarSign size={16} strokeWidth={1.75} />
      </button>

      <button
        type="button"
        aria-label="Timer mode"
        className="flex h-[26px] w-[30px] items-center justify-center rounded-lg text-toggl-muted hover:bg-white/5"
      >
        <ArrowUp size={14} strokeWidth={2} />
      </button>

      <div className="flex h-9 w-[88px] items-center justify-center text-center text-[18px] leading-[26px] font-medium text-toggl-muted tabular-nums">
        0:00:00
      </div>

      <button
        type="button"
        aria-label="Start timer"
        className="flex size-9 items-center justify-center rounded-full bg-toggl-accent text-toggl-inverted hover:bg-toggl-accent-hover"
      >
        <Play size={16} fill="currentColor" strokeWidth={0} className="translate-x-px" />
      </button>

      {/* FEATURE_SLOT: topbar entry point for Friday's feature */}
      <FeatureSlot placement="topbar" />

      <button
        type="button"
        aria-label="More options"
        className="flex size-9 items-center justify-center rounded-lg text-toggl-muted hover:bg-white/5"
      >
        <EllipsisVertical size={16} strokeWidth={1.75} />
      </button>
    </header>
  )
}
