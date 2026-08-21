import { CLAIM_RATE, formatClaimDate, formatClaimDuration, formatClaimHours, formatClaimMoney, type ClaimBlock } from '../../data/claimWeek'

export function ProjectTimeTab({ blocks }: { blocks: ClaimBlock[] }) {
  const totalMin = blocks.reduce((sum, block) => sum + block.durationMin, 0)

  return (
    <div className="flex min-h-0 flex-1 flex-col min-[720px]:flex-row">
      <aside className="w-full shrink-0 border-b border-[#2e2e2e] bg-[linear-gradient(180deg,#2a2208_0%,#1c1a1c_52%)] p-6 min-[720px]:w-[340px] min-[720px]:border-r min-[720px]:border-b-0 min-[720px]:p-7">
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
        <p className="mt-1 text-[12px] text-[#8a8a8a]">${CLAIM_RATE}/hr · {formatClaimHours(totalMin)}h</p>
      </aside>

      <div className="min-h-0 flex-1 overflow-y-auto p-6 min-[720px]:p-7">
        <h2 className="mb-3 text-[12px] font-semibold tracking-wide text-white uppercase">
          Assigned slots
        </h2>
        <div className="flex flex-col gap-2">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="flex items-center gap-3 rounded-xl border border-[#F5B301]/40 bg-[#F5B301]/10 px-3 py-2.5"
            >
              <span className="size-2.5 shrink-0 rounded-full bg-[#F5B301]" />
              <p className="min-w-0 flex-1 truncate text-[14px] font-medium text-white">{block.title}</p>
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
          ))}
        </div>
      </div>
    </div>
  )
}
