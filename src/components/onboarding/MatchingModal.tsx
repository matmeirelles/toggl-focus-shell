import { useEffect, useRef, useState } from 'react'

type MatchingModalProps = {
  companyName: string
  onComplete: () => void
}

function CalendarScan() {
  return (
    <svg width="168" height="118" viewBox="0 0 168 118" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="152" height="102" rx="12" fill="#141414" stroke="#2e2e2e" />
      <rect x="8" y="8" width="152" height="22" rx="12" fill="#1f1b1f" />
      <rect x="8" y="18" width="152" height="12" fill="#1f1b1f" />
      {[0, 1, 2, 3, 4].map((col) => (
        <circle key={col} cx={32 + col * 26} cy="19" r="3" fill="#5c5c5c" />
      ))}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3, 4].map((col) => {
          const matched = (row === 0 && col === 1) || (row === 1 && col === 3) || (row === 2 && col === 0)
          return (
            <rect
              key={`${row}-${col}`}
              className={matched ? 'calendar-block-match' : undefined}
              x={20 + col * 26}
              y={38 + row * 22}
              width="20"
              height="16"
              rx="3"
              fill={matched ? '#E57CD8' : '#2a2a2a'}
              style={matched ? { animationDelay: `${col * 180}ms` } : undefined}
            />
          )
        }),
      )}
      <rect
        className="calendar-scan-line"
        x="18"
        y="34"
        width="132"
        height="2"
        rx="1"
        fill="#E57CD8"
      />
    </svg>
  )
}

export function MatchingModal({ companyName, onComplete }: MatchingModalProps) {
  const steps = [
    'Reading your calendar…',
    `Matching blocks to ${companyName}…`,
    'Skipping personal time…',
  ]
  const [step, setStep] = useState(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') event.preventDefault()
    }
    window.addEventListener('keydown', onKeyDown)
    const timers = [
      window.setTimeout(() => setStep(1), 1000),
      window.setTimeout(() => setStep(2), 2000),
      window.setTimeout(() => onCompleteRef.current(), 3000),
    ]
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="matching-modal-title"
        aria-live="polite"
        className="relative w-full max-w-[748px] rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] px-10 py-16 shadow-[0_24px_80px_rgb(0_0_0_/_55%)]"
      >
        <div className="flex flex-col items-center">
          <CalendarScan />
          <h1
            key={step}
            id="matching-modal-title"
            className="matching-step mt-8 min-h-[32px] text-center text-[22px] leading-8 font-semibold text-white"
          >
            {steps[step]}
          </h1>
          <p className="mt-2 text-center text-[13px] text-[#8a8a8a]">This only takes a moment</p>
        </div>
      </div>
    </div>
  )
}
