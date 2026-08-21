import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppShell() {
  const location = useLocation()
  const hideTopBar = location.pathname.startsWith('/reports')

  return (
    <div className="flex h-full overflow-hidden bg-toggl-app font-sans text-toggl-text">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {hideTopBar ? null : <TopBar />}
        <Outlet />
      </div>
    </div>
  )
}
