export function CurrentTimeMarker({ minutes }: { minutes: number }) {
  return (
    <div
      className="pointer-events-none absolute right-0 left-0 z-10"
      style={{ top: minutes }}
    >
      <div className="relative flex items-center">
        <div
          className="absolute -left-[9px] size-[18px] rounded-full bg-toggl-accent"
          style={{ top: '-8px' }}
        />
        <div className="h-[2px] w-full bg-toggl-accent" />
      </div>
    </div>
  )
}
