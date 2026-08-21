import { useState, type ReactNode } from 'react'
import { Bell, CalendarDays, Folder, Lock, Paperclip, Plus, Flag, User } from 'lucide-react'

function PinkToggle({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
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

function SideCard({
  title,
  description,
  on,
  onChange,
  children,
}: {
  title: string
  description: string
  on: boolean
  onChange: (on: boolean) => void
  children?: ReactNode
}) {
  return (
    <div className="border-b border-[#2e2e2e] px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-white">{title}</p>
          <p className="mt-1 text-[12px] leading-4 text-[#8a8a8a]">{description}</p>
        </div>
        <PinkToggle on={on} onChange={onChange} />
      </div>
      {on && children ? <div className="mt-3">{children}</div> : null}
    </div>
  )
}

export function ProjectOverviewTab() {
  const [draft, setDraft] = useState(false)
  const [complete, setComplete] = useState(false)
  const [recurring, setRecurring] = useState(false)
  const [estimate, setEstimate] = useState(false)
  const [billable, setBillable] = useState(true)
  const [fixedFee, setFixedFee] = useState(false)

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between gap-3 rounded-lg bg-[#2a1840] px-4 py-3">
          <p className="text-[13px] text-[#d8c6e8]">
            You&apos;re trying 10 Premium features — recurring, estimate, billing & more
          </p>
          <button
            type="button"
            className="shrink-0 rounded-lg bg-[#E57CD8] px-3 py-1.5 text-[13px] font-semibold text-[#0F0F0F]"
          >
            Upgrade now
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Folder size={22} className="text-[#F5B301]" />
            <h2 className="text-[22px] font-semibold text-white">Acme</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[13px] text-[#a1a1a1]">
              Draft
              <PinkToggle on={draft} onChange={setDraft} />
            </div>
            <label className="flex items-center gap-2 text-[13px] text-[#a1a1a1]">
              <input
                type="checkbox"
                checked={complete}
                onChange={(event) => setComplete(event.target.checked)}
                className="size-4 rounded border-[#3c3c3c]"
              />
              Complete project
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-lg border border-[#2e2e2e] px-3 text-[13px] text-white"
          >
            <User size={14} className="text-[#8a8a8a]" />
            Acme Inc.
          </button>
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-lg border border-[#2e2e2e] px-3 text-[13px] text-white"
          >
            <CalendarDays size={14} className="text-[#8a8a8a]" />
            Aug 17 – Ongoing
          </button>
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-full border border-[#2e2e2e] px-3 text-[13px] text-[#a1a1a1]"
          >
            <Lock size={12} className="text-[#E57CD8]" />
            Private
          </button>
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-full border border-[#2e2e2e] px-3 text-[13px] text-[#a1a1a1]"
          >
            <User size={12} />
            Shared
          </button>
        </div>

        <button
          type="button"
          className="mt-5 flex h-8 items-center gap-1 rounded-lg border border-dashed border-[#3c3c3c] px-3 text-[12px] font-semibold tracking-wide text-[#8a8a8a] uppercase"
        >
          <Plus size={12} />
          Tag
        </button>

        <p className="mt-5 text-[14px] text-[#6B7280]">Project description</p>

        <div className="mt-6 flex flex-col gap-3">
          <button type="button" className="flex items-center gap-2 text-[14px] text-[#a1a1a1] hover:text-white">
            <Bell size={14} />
            + Add alert
          </button>
          <button type="button" className="flex items-center gap-2 text-[14px] text-[#a1a1a1] hover:text-white">
            <Flag size={14} />
            + Add milestone
          </button>
          <button type="button" className="flex items-center gap-2 text-[14px] text-[#a1a1a1] hover:text-white">
            <Paperclip size={14} />
            + Add attachment
          </button>
        </div>
      </div>

      <aside className="hidden w-[300px] shrink-0 overflow-y-auto border-l border-[#2e2e2e] lg:block">
        <SideCard
          title="Recurring"
          description="Make this project recurring to service your retainer project."
          on={recurring}
          onChange={setRecurring}
        />
        <SideCard
          title="Estimate"
          description="See how tracked hours compare to your time budget."
          on={estimate}
          onChange={setEstimate}
        />
        <SideCard
          title="Billable"
          description="Bill time tracked on this project."
          on={billable}
          onChange={setBillable}
        >
          <p className="text-[11px] font-semibold tracking-wide text-[#8a8a8a] uppercase">
            Project rate
          </p>
          <p className="mt-1 text-[20px] font-semibold text-white">90 USD</p>
          <p className="mt-1 text-[12px] text-[#8a8a8a]">Aug 17 2026 – Ongoing</p>
          <button type="button" className="mt-2 text-[12px] font-semibold text-[#E57CD8]">
            + New rate
          </button>
        </SideCard>
        <SideCard
          title="Fixed fee"
          description="Monitor spending against the fixed fee."
          on={fixedFee}
          onChange={setFixedFee}
        />
      </aside>
    </div>
  )
}
