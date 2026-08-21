export function TogglMark() {
  return (
    <div className="relative flex size-8 items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="14" fill="#c282b9" />
        <path
          d="M16 8v9"
          stroke="#131213"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M10.4 11.2a7.2 7.2 0 1 0 11.2 0"
          fill="none"
          stroke="#131213"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute -bottom-1 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-toggl-badge bg-toggl-active px-[3px] text-[11px] leading-[16px] font-semibold text-toggl-accent">
        2.0
      </span>
    </div>
  )
}
