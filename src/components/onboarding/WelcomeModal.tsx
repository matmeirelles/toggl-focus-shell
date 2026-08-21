import { useEffect, useState } from 'react'
import { LaptopPlayIllustration } from './Illustrations'

export const WELCOME_MODAL_KEY = 'toggl-welcome-modal'

const USES = [
  'Bill projects accurately',
  'Team productivity and payroll',
  'Planning resources effectively',
  'Project progress and profitability',
  'Personal productivity',
]

type WelcomeModalProps = {
  onComplete: () => void
}

export function WelcomeModal({ onComplete }: WelcomeModalProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [other, setOther] = useState('')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') event.preventDefault()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const toggle = (label: string) => {
    setSelected((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        className="relative w-full max-w-[640px] overflow-hidden rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] px-10 py-10 shadow-[0_24px_80px_rgb(0_0_0_/_55%)]"
      >
        <h1
          id="welcome-modal-title"
          className="text-center text-[24px] leading-8 font-bold text-white"
        >
          Welcome! What will your team use Toggl Track for?
        </h1>
        <p className="mt-2 text-center text-[14px] text-[#a1a1a1]">Select all that apply</p>

        <div className="mx-auto mt-7 flex w-full max-w-[420px] flex-col gap-2.5">
          {USES.map((label) => {
            const active = selected.includes(label)
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggle(label)}
                className={`h-12 rounded-lg border text-[15px] font-medium text-white ${
                  active
                    ? 'border-[#E57CD8] bg-[#E57CD8]/10'
                    : 'border-[#4a4a4a] bg-transparent hover:border-[#7a7a7a]'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="mx-auto mt-5 w-full max-w-[420px]">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-[#8a8a8a] uppercase">
            Other
          </div>
          <input
            value={other}
            onChange={(event) => setOther(event.target.value)}
            placeholder="Describe..."
            className="h-11 w-full rounded-lg border border-[#5c5c5c] bg-transparent px-3 text-[14px] text-white outline-none placeholder:text-[#8a8a8a] focus:border-[#E57CD8]"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onComplete}
            className="h-10 min-w-[88px] rounded-lg bg-[#E57CD8] px-6 text-[14px] font-semibold text-[#1c1a1c] hover:bg-[#eda0e0]"
          >
            Next
          </button>
        </div>

        <div className="pointer-events-none absolute right-4 bottom-3">
          <LaptopPlayIllustration />
        </div>
      </div>
    </div>
  )
}
