import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Check, X } from 'lucide-react'
import {
  CLAIM_BLOCKS,
  CLAIM_RATE,
  formatClaimDate,
  formatClaimDuration,
  formatClaimHours,
  formatClaimMoney,
  type ClaimBlock,
} from '../../data/claimWeek'

const CONFIRMED_ID = 'a2'

export function ProjectTimeTab({ blocks }: { blocks: ClaimBlock[] }) {
  const navigate = useNavigate()
  const [invoiceOpen, setInvoiceOpen] = useState(false)
  const totalMin = blocks.reduce((sum, block) => sum + block.durationMin, 0)
  const assignedIds = new Set(blocks.map((block) => block.id))
  const unassignedMin = CLAIM_BLOCKS.filter(
    (block) => block.origin === 'other' && !assignedIds.has(block.id),
  ).reduce((sum, block) => sum + block.durationMin, 0)
  const goToTimer = () => navigate('/timer')

  return (
    <div className="flex min-h-0 flex-1 flex-col min-[720px]:flex-row">
      <aside className="w-full shrink-0 overflow-y-auto border-b border-[#2e2e2e] bg-[linear-gradient(180deg,#2a2208_0%,#1c1a1c_52%)] p-6 min-[720px]:w-[340px] min-[720px]:border-r min-[720px]:border-b-0 min-[720px]:p-7">
        <p className="text-[22px] leading-7 font-semibold text-white">Acme</p>
        <p className="mt-1 text-[14px] text-[#a1a1a1]">
          Acme Inc. <span className="text-[#6B7280]">·</span>{' '}
          <span className="tabular-nums text-[#F5B301]">$90/hr</span>
        </p>

        <div className="mt-4 rounded-xl border border-[#3c3c3c] bg-black/20 px-3 py-2.5">
          <p className="text-[12px] font-medium text-[#cfcfcf]">Mapped from your calendar</p>
          <p className="mt-1 text-[12px] text-[#8a8a8a]">
            {blocks.length} blocks
            <span className="text-[#6B7280]"> · </span>
            {formatClaimHours(totalMin)}h tracked
          </p>
        </div>

        <p className="mt-5 text-[48px] leading-[52px] font-bold tabular-nums text-white">
          {formatClaimMoney(totalMin)}
        </p>
        <p className="mt-1 text-[18px] tabular-nums text-[#a1a1a1]">
          {formatClaimHours(totalMin)}h billable
        </p>

        <div className="my-5 h-px w-full bg-white/10" />

        <div className="flex items-center gap-2 text-[13px]">
          <span className="size-2 shrink-0 rounded-full bg-[#F5B301]" />
          <span className="min-w-0 flex-1 text-[#cfcfcf]">Assigned to Acme</span>
          <span className="tabular-nums text-white">
            {formatClaimHours(totalMin)}h · {formatClaimMoney(totalMin)}
          </span>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#2e2e2e]">
          <div className="h-full w-full bg-[#F5B301]" />
        </div>

        <p className="mt-3 text-[12px] leading-4 text-[#8a8a8a]">
          All time on this project. Track live to keep it exact.
        </p>
        <p className="mt-1 text-[12px] text-[#8a8a8a]">
          ${CLAIM_RATE}/hr · {formatClaimHours(totalMin)}h
        </p>

        <div className="mt-5 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() => setInvoiceOpen(true)}
            className="flex h-11 w-full items-center justify-center rounded-xl border border-[#3c3c3c] text-[14px] font-semibold text-[#cfcfcf] transition-colors duration-150 hover:border-[#F5B301]/45 hover:text-white"
          >
            Generate invoice →
          </button>
          <p className="mt-2 text-[12px] leading-4 text-[#8a8a8a]">
            Covers {formatClaimHours(totalMin)}h so far. Keep going to bill the full project.
          </p>
          <button
            type="button"
            onClick={goToTimer}
            className="mt-4 text-[13px] text-[#8a8a8a] transition-colors duration-150 hover:text-white"
          >
            Track this week live →
          </button>
        </div>
      </aside>

      <div className="min-h-0 flex-1 overflow-y-auto p-6 min-[720px]:p-7">
        <h2 className="mb-3 text-[12px] font-semibold tracking-wide text-white uppercase">Assigned slots</h2>
        <div className="flex flex-col gap-2">
          {blocks.map((block) => {
            const confirmed = block.id === CONFIRMED_ID
            return (
              <div
                key={block.id}
                className="flex items-center gap-3 rounded-xl border border-[#F5B301]/40 bg-[#F5B301]/10 px-3 py-2.5"
              >
                <span className="size-2.5 shrink-0 rounded-full bg-[#F5B301]" />
                <p className="min-w-0 flex-1 truncate text-[14px] font-medium text-white">{block.title}</p>
                <StatusPill confirmed={confirmed} />
                <span className="hidden w-[118px] shrink-0 text-right text-[13px] text-[#a1a1a1] sm:block">
                  {formatClaimDate(block.iso)}
                </span>
                <span className="w-12 shrink-0 text-right text-[13px] tabular-nums text-[#a1a1a1]">
                  {formatClaimDuration(block.durationMin)}
                </span>
                <span className="w-12 shrink-0 text-right text-[13px] font-medium tabular-nums text-white">
                  {formatClaimMoney(block.durationMin)}
                </span>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={goToTimer}
          className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-[#F5B301]/30 px-3 py-3 text-left transition-colors duration-150 hover:border-[#F5B301]/70 hover:bg-[#F5B301]/5"
        >
          <span className="text-[14px] text-[#a1a1a1]">+ Assign more from your calendar</span>
          <span className="shrink-0 text-[13px] tabular-nums text-[#F5B301]/70">
            {formatClaimHours(unassignedMin)}h unassigned this week →
          </span>
        </button>
      </div>

      {invoiceOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-stub-title"
            className="relative w-full max-w-[440px] rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] px-8 py-10 text-center shadow-[0_24px_80px_rgb(0_0_0_/_55%)]"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setInvoiceOpen(false)}
              className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-[#8a8a8a] hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>
            <p className="text-[12px] font-semibold tracking-[0.12em] text-[#8a8a8a] uppercase">
              Invoice preview
            </p>
            <h2 id="invoice-stub-title" className="mt-3 text-[22px] font-semibold text-white">
              Coming soon
            </h2>
            <p className="mt-6 text-[32px] font-bold tabular-nums text-white">{formatClaimMoney(totalMin)}</p>
            <p className="mt-2 text-[14px] text-[#a1a1a1]">
              {formatClaimHours(totalMin)}h × $90/hr · Acme
            </p>
            <p className="mt-6 text-[13px] text-[#8a8a8a]">Draft only. Nothing is sent.</p>
            <button
              type="button"
              onClick={() => setInvoiceOpen(false)}
              className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-[#3c3c3c] px-6 text-[14px] font-semibold text-white hover:bg-white/5"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function StatusPill({ confirmed }: { confirmed: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase ${
        confirmed ? 'bg-[#2DD4BF]/10 text-[#74b1b6]' : 'bg-white/5 text-[#8a8a8a]'
      }`}
    >
      {confirmed ? <Check size={10} strokeWidth={2.4} /> : <Calendar size={10} strokeWidth={2.2} />}
      {confirmed ? 'Logged' : 'Planned'}
    </span>
  )
}
