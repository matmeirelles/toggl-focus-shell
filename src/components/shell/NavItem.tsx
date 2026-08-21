import { Link, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { Star } from 'lucide-react'

type NavItemProps = {
  icon: LucideIcon
  label: string
  to?: string
  paid?: boolean
}

export function NavItem({ icon: Icon, label, to, paid = false }: NavItemProps) {
  const location = useLocation()
  const active =
    to != null &&
    (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to))

  const className = [
    'nav-transition flex h-8 w-[184px] items-center gap-3 rounded-lg px-2 text-[14px] leading-[20px]',
    active
      ? 'bg-toggl-active font-semibold text-toggl-accent'
      : 'font-medium text-toggl-muted hover:bg-toggl-app hover:text-toggl-hover',
    to ? '' : 'cursor-default',
  ].join(' ')

  const inner = (
    <>
      <Icon size={16} strokeWidth={1.75} className="shrink-0" />
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
      {paid ? <Star size={12} strokeWidth={1.75} className="shrink-0 opacity-80" /> : null}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={className}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" className={className}>
      {inner}
    </button>
  )
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex h-6 w-[184px] items-center px-2 pt-1 text-[11px] leading-[16px] font-semibold tracking-[0.275px] text-toggl-muted uppercase">
      {children}
    </div>
  )
}
