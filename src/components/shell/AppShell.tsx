import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { WelcomeModal, WELCOME_MODAL_KEY } from '../onboarding/WelcomeModal'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const hideTopBar = location.pathname.startsWith('/reports')
  const [welcomeOpen, setWelcomeOpen] = useState(
    () => sessionStorage.getItem(WELCOME_MODAL_KEY) === '1',
  )

  const openWelcome = () => {
    sessionStorage.setItem(WELCOME_MODAL_KEY, '1')
    setWelcomeOpen(true)
    if (location.pathname !== '/timer') navigate('/timer')
  }

  return (
    <div className="relative flex h-full overflow-hidden bg-toggl-app font-sans text-toggl-text">
      <Sidebar onOpenWelcome={openWelcome} />
      <div className="flex min-w-0 flex-1 flex-col">
        {hideTopBar ? null : <TopBar />}
        <Outlet />
      </div>
      {welcomeOpen && location.pathname === '/timer' ? (
        <WelcomeModal
          onComplete={() => {
            sessionStorage.removeItem(WELCOME_MODAL_KEY)
            setWelcomeOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}
