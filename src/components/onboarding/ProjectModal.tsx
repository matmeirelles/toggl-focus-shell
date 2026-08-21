import { useEffect, useState } from 'react'
import { ProjectCardsIllustration } from './Illustrations'

export const PROJECT_MODAL_KEY = 'toggl-project-modal'

type ProjectModalProps = {
  onComplete: () => void
}

export function ProjectModal({ onComplete }: ProjectModalProps) {
  const [projectName, setProjectName] = useState('')
  const canContinue = projectName.trim().length > 0

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') event.preventDefault()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const submit = () => {
    if (!canContinue) return
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative w-full max-w-[748px] overflow-hidden rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] px-10 py-10 shadow-[0_24px_80px_rgb(0_0_0_/_55%)]"
      >
        <h1
          id="project-modal-title"
          className="text-center text-[24px] leading-8 font-bold text-white"
        >
          What&apos;s your team&apos;s first project?
        </h1>
        <p className="mt-2 text-center text-[14px] leading-6 text-[#a1a1a1]">
          Add a project so your team can start tracking right away. You can add more later.
        </p>
        <input
          autoFocus
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              submit()
            }
          }}
          placeholder="e.g. Client project, Marketing campaign"
          className="mx-auto mt-8 block h-12 w-full max-w-[560px] rounded-lg border border-[#5c5c5c] bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-[#8a8a8a] focus:border-[#E57CD8]"
        />
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={submit}
            disabled={!canContinue}
            className={`h-10 min-w-[88px] rounded-lg px-6 text-[14px] font-semibold ${
              canContinue
                ? 'bg-[#E57CD8] text-[#1c1a1c] hover:bg-[#eda0e0]'
                : 'cursor-not-allowed bg-[#4A1D42] text-[#1c1a1c]'
            }`}
          >
            Next
          </button>
        </div>
        <div className="pointer-events-none absolute right-4 bottom-3">
          <ProjectCardsIllustration />
        </div>
      </div>
    </div>
  )
}
