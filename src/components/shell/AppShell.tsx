import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { WelcomeModal, WELCOME_MODAL_KEY } from '../onboarding/WelcomeModal'
import { ProjectModal, PROJECT_MODAL_KEY } from '../onboarding/ProjectModal'
import { MatchingModal } from '../onboarding/MatchingModal'
import { ClaimWeekModal } from '../onboarding/ClaimWeekModal'

type ShellModal = 'none' | 'welcome' | 'project' | 'matching' | 'claim'

function initialModal(): ShellModal {
  if (sessionStorage.getItem(WELCOME_MODAL_KEY) === '1') return 'welcome'
  if (sessionStorage.getItem(PROJECT_MODAL_KEY) === '1') return 'project'
  return 'none'
}

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const hideTopBar = location.pathname.startsWith('/reports')
  const [modal, setModal] = useState<ShellModal>(initialModal)
  const [companyName, setCompanyName] = useState('your project')
  const onTimer = location.pathname === '/timer'

  const dismissModals = () => {
    sessionStorage.removeItem(WELCOME_MODAL_KEY)
    sessionStorage.removeItem(PROJECT_MODAL_KEY)
    setModal('none')
  }

  const openWelcome = () => {
    sessionStorage.setItem(WELCOME_MODAL_KEY, '1')
    sessionStorage.removeItem(PROJECT_MODAL_KEY)
    setModal('welcome')
    if (location.pathname !== '/timer') navigate('/timer')
  }

  return (
    <div className="relative flex h-full overflow-hidden bg-toggl-app font-sans text-toggl-text">
      <Sidebar onOpenWelcome={openWelcome} />
      <div className="flex min-w-0 flex-1 flex-col">
        {hideTopBar ? null : <TopBar />}
        <Outlet />
      </div>
      {onTimer && modal === 'welcome' ? (
        <WelcomeModal
          onComplete={() => {
            sessionStorage.removeItem(WELCOME_MODAL_KEY)
            sessionStorage.setItem(PROJECT_MODAL_KEY, '1')
            setModal('project')
          }}
          onDismiss={dismissModals}
        />
      ) : null}
      {onTimer && modal === 'project' ? (
        <ProjectModal
          onComplete={(project) => {
            sessionStorage.removeItem(PROJECT_MODAL_KEY)
            setCompanyName(project.client || project.name)
            setModal('matching')
          }}
          onDismiss={dismissModals}
        />
      ) : null}
      {onTimer && modal === 'matching' ? (
        <MatchingModal
          companyName={companyName}
          onComplete={() => setModal('claim')}
          onDismiss={dismissModals}
        />
      ) : null}
      {onTimer && modal === 'claim' ? (
        <ClaimWeekModal onComplete={() => setModal('none')} onDismiss={dismissModals} />
      ) : null}
    </div>
  )
}
