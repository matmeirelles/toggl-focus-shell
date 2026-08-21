import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GoogleCalendarIcon,
  HourglassIllustration,
  OutlookIcon,
  PlaneIllustration,
  ProjectCardsIllustration,
  TeamIllustration,
} from '../components/onboarding/Illustrations'
import { WELCOME_MODAL_KEY } from '../components/onboarding/WelcomeModal'

const TEAM_SIZES = [
  'Just me',
  '2-5 members',
  '6-20 members',
  '21-50 members',
  '51-100 members',
  '100 or more members',
]

function TrackLogo() {
  return (
    <div className="text-[22px] leading-none tracking-tight">
      <span className="font-bold text-[#E57CD8]">toggl</span>
      <span className="font-medium text-white"> track</span>
    </div>
  )
}

function GhostButton({
  children,
  onClick,
}: {
  children: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 min-w-[88px] rounded-lg border border-[#5c5c5c] px-5 text-[14px] font-medium text-white hover:bg-white/5"
    >
      {children}
    </button>
  )
}

function PinkButton({
  children,
  onClick,
  disabled = false,
}: {
  children: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-10 min-w-[88px] rounded-lg px-5 text-[14px] font-semibold ${
        disabled
          ? 'cursor-not-allowed bg-[#4A1D42] text-[#1c1a1c]'
          : 'bg-[#E57CD8] text-[#1c1a1c] hover:bg-[#eda0e0]'
      }`}
    >
      {children}
    </button>
  )
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [team, setTeam] = useState<string | null>(null)
  const [orgName, setOrgName] = useState('Mateus Freelancer')
  const [projectName, setProjectName] = useState('')
  const [autoTrack, setAutoTrack] = useState(true)

  const goApp = () => {
    sessionStorage.removeItem(WELCOME_MODAL_KEY)
    navigate('/timer')
  }
  const goAppWithWelcome = () => {
    sessionStorage.setItem(WELCOME_MODAL_KEY, '1')
    navigate('/timer')
  }

  return (
    <div className="onboard-bg relative flex h-full min-h-full flex-col overflow-hidden">
      <div className="absolute top-6 left-8 z-10">
        <TrackLogo />
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="relative w-full max-w-[1024px] overflow-hidden rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] px-10 py-12 shadow-[0_24px_80px_rgb(0_0_0_/_45%)]">
          {step === 0 ? (
            <div className="flex flex-col items-center">
              <h1 className="text-center text-[28px] font-bold text-white">How big is your team?</h1>
              <div className="mt-8 flex w-full max-w-[520px] flex-col gap-2.5">
                {TEAM_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setTeam(size)
                      setStep(1)
                    }}
                    className={`h-12 rounded-lg border text-[15px] font-medium text-white ${
                      team === size
                        ? 'border-[#E57CD8] bg-[#E57CD8]/10'
                        : 'border-[#4a4a4a] bg-transparent hover:border-[#7a7a7a]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex w-full max-w-[520px] gap-3">
                <GhostButton onClick={() => undefined}>Back</GhostButton>
                <PinkButton
                  disabled={!team}
                  onClick={() => {
                    if (team) setStep(1)
                  }}
                >
                  Next
                </PinkButton>
              </div>
              <div className="pointer-events-none absolute right-6 bottom-4">
                <TeamIllustration />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="flex flex-col items-center">
              <h1 className="text-center text-[28px] font-bold text-white">Name your organization!</h1>
              <p className="mt-3 max-w-[560px] text-center text-[15px] leading-6 text-[#a1a1a1]">
                This is the home for all your time tracking data. Name it after your company, team, or
                yourself.
              </p>
              <input
                value={orgName}
                onChange={(event) => setOrgName(event.target.value)}
                className="mt-8 h-12 w-full max-w-[560px] rounded-lg border border-[#5c5c5c] bg-transparent px-4 text-[15px] text-white outline-none focus:border-[#E57CD8]"
              />
              <p className="mt-2 w-full max-w-[560px] text-left text-[12px] text-[#8a8a8a]">
                This name is just a suggestion, feel free to change it to something else.
              </p>
              <div className="mt-8 flex gap-3">
                <GhostButton onClick={() => setStep(0)}>Back</GhostButton>
                <PinkButton onClick={() => setStep(2)}>Next</PinkButton>
              </div>
              <div className="pointer-events-none absolute right-6 bottom-4">
                <PlaneIllustration />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-col items-center">
              <h1 className="text-center text-[28px] font-bold text-white">
                What&apos;s your team&apos;s first project?
              </h1>
              <p className="mt-3 max-w-[560px] text-center text-[15px] leading-6 text-[#a1a1a1]">
                Add a project so your team can start tracking right away. You can add more later.
              </p>
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && projectName.trim()) {
                    event.preventDefault()
                    setStep(3)
                  }
                }}
                placeholder="e.g. Client project, Marketing campaign"
                className="mt-8 h-12 w-full max-w-[560px] rounded-lg border border-[#5c5c5c] bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-[#8a8a8a] focus:border-[#E57CD8]"
              />
              <div className="mt-8">
                <PinkButton disabled={!projectName.trim()} onClick={() => setStep(3)}>
                  Next
                </PinkButton>
              </div>
              <div className="pointer-events-none absolute right-6 bottom-4">
                <ProjectCardsIllustration />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="flex flex-col items-center">
              <h1 className="max-w-[640px] text-center text-[26px] leading-8 font-bold text-white">
                Sync your team&apos;s calendars for seamless time tracking
              </h1>
              <div className="mt-8 flex w-full max-w-[640px] flex-col gap-3">
                <button
                  type="button"
                  onClick={goAppWithWelcome}
                  className="flex items-center gap-4 rounded-xl border border-[#3a3a3a] px-4 py-4 text-left hover:border-[#6a6a6a]"
                >
                  <GoogleCalendarIcon />
                  <span>
                    <span className="block text-[15px] font-semibold text-white">Google Calendar</span>
                    <span className="mt-0.5 block text-[13px] text-[#a0a0a0]">
                      View your Google Calendar events and easily add them as time entries
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={goAppWithWelcome}
                  className="flex items-center gap-4 rounded-xl border border-[#3a3a3a] px-4 py-4 text-left hover:border-[#6a6a6a]"
                >
                  <OutlookIcon />
                  <span>
                    <span className="block text-[15px] font-semibold text-white">Microsoft Outlook</span>
                    <span className="mt-0.5 block text-[13px] text-[#a0a0a0]">
                      View your Outlook Calendar events and easily add them as time entries
                    </span>
                  </span>
                </button>
                <div className="flex h-12 items-center justify-between rounded-xl border border-[#3a3a3a] px-4">
                  <span className="flex items-center gap-2 text-[14px] text-white">
                    Auto-track calendar events
                    <span className="flex size-4 items-center justify-center rounded-full border border-[#6a6a6a] text-[10px] text-[#8a8a8a]">
                      i
                    </span>
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoTrack}
                    onClick={() => setAutoTrack((value) => !value)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      autoTrack ? 'bg-[#9d4edd]' : 'bg-[#3a3a3a]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 size-5 rounded-full bg-white transition-transform ${
                        autoTrack ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="mt-8">
                <GhostButton onClick={goAppWithWelcome}>No, thanks</GhostButton>
              </div>
              <div className="pointer-events-none absolute right-4 bottom-3">
                <HourglassIllustration />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {step === 0 ? (
        <button
          type="button"
          onClick={goApp}
          className="absolute right-8 bottom-6 text-[13px] text-[#9a9a9a] underline underline-offset-2 hover:text-white"
        >
          Skip and go straight to the app
        </button>
      ) : null}
    </div>
  )
}
