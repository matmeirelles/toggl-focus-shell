import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Folder, Plus, X } from 'lucide-react'

export const PROJECT_MODAL_KEY = 'toggl-project-modal'

const EXISTING_CLIENTS = ['Azos', 'Career']
const CURRENCIES = ['USD', 'EUR', 'BRL', 'GBP']

const fieldLabel = 'mb-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#8a8a8a] uppercase'
const fieldBox =
  'flex h-11 w-full items-center rounded-lg border border-[#5c5c5c] bg-transparent px-3 text-[14px] text-white outline-none focus-within:border-[#E57CD8]'

type ProjectModalProps = {
  onComplete: (project: { name: string; client: string }) => void
  onDismiss: () => void
}

export function ProjectModal({ onComplete, onDismiss }: ProjectModalProps) {
  const [projectName, setProjectName] = useState('')
  const [clientQuery, setClientQuery] = useState('')
  const [clients, setClients] = useState(EXISTING_CLIENTS)
  const [clientOpen, setClientOpen] = useState(false)
  const [rate, setRate] = useState('0')
  const [currency, setCurrency] = useState('USD')
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const clientRef = useRef<HTMLDivElement>(null)
  const currencyRef = useRef<HTMLDivElement>(null)

  const canContinue = projectName.trim().length > 0
  const filteredClients = clients.filter((name) =>
    name.toLowerCase().includes(clientQuery.trim().toLowerCase()),
  )
  const canCreateClient =
    clientQuery.trim().length > 0 &&
    !clients.some((name) => name.toLowerCase() === clientQuery.trim().toLowerCase())

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') event.preventDefault()
    }
    const onPointerDown = (event: MouseEvent) => {
      if (clientRef.current && !clientRef.current.contains(event.target as Node)) {
        setClientOpen(false)
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onPointerDown)
    }
  }, [])

  const selectClient = (name: string) => {
    setClientQuery(name)
    setClientOpen(false)
  }

  const createClient = () => {
    const name = clientQuery.trim()
    if (!name) return
    setClients((current) => (current.includes(name) ? current : [...current, name]))
    selectClient(name)
  }

  const submit = () => {
    if (!canContinue) return
    onComplete({
      name: projectName.trim(),
      client: clientQuery.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative w-full max-w-[748px] rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] px-10 py-10 shadow-[0_24px_80px_rgb(0_0_0_/_55%)]"
      >
        {/* TEST: remove dismiss before submission */}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-[#8a8a8a] hover:bg-white/5 hover:text-white"
        >
          <X size={18} />
        </button>
        <h1
          id="project-modal-title"
          className="text-center text-[24px] leading-8 font-bold text-white"
        >
          Let&apos;s create your first project
        </h1>
        <p className="mt-2 text-center text-[14px] leading-6 text-[#a1a1a1]">
          Add a project so your team can start tracking right away. You can add more later.
        </p>

        <div className="mx-auto mt-8 flex w-full max-w-[560px] flex-col gap-5">
          <label>
            <div className={fieldLabel}>Name</div>
            <div className={fieldBox}>
              <Folder size={16} className="mr-2 shrink-0 text-[#e6c46a]" />
              <input
                autoFocus
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !clientOpen) {
                    event.preventDefault()
                    submit()
                  }
                }}
                placeholder="Project name"
                className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8a8a8a]"
              />
            </div>
          </label>

          <div ref={clientRef} className="relative">
            <div className={fieldLabel}>Client</div>
            <div className={fieldBox}>
              <input
                value={clientQuery}
                onFocus={() => setClientOpen(true)}
                onChange={(event) => {
                  setClientQuery(event.target.value)
                  setClientOpen(true)
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter') return
                  event.preventDefault()
                  if (canCreateClient) createClient()
                  else if (filteredClients[0]) selectClient(filteredClients[0])
                }}
                placeholder="Search"
                className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8a8a8a]"
              />
              <ChevronDown size={16} className="shrink-0 text-[#8a8a8a]" />
            </div>
            {clientOpen ? (
              <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-[#3c393b] bg-[#1c1a1c] py-1 shadow-[0_8px_24px_rgb(0_0_0_/_45%)]">
                {filteredClients.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => selectClient(name)}
                    className="flex w-full px-3 py-2 text-left text-[14px] text-white hover:bg-white/5"
                  >
                    {name}
                  </button>
                ))}
                {canCreateClient ? (
                  <button
                    type="button"
                    onClick={createClient}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[14px] text-[#E57CD8] hover:bg-white/5"
                  >
                    <Plus size={14} />
                    Create new client “{clientQuery.trim()}”
                  </button>
                ) : null}
                {filteredClients.length === 0 && !canCreateClient ? (
                  <div className="px-3 py-2 text-[13px] text-[#8a8a8a]">No clients found</div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-[1.4fr_1fr] gap-3">
            <label>
              <div className={fieldLabel}>Hourly rate</div>
              <div className={fieldBox}>
                <input
                  type="text"
                  inputMode="decimal"
                  value={rate}
                  onChange={(event) => setRate(event.target.value.replace(/[^\d.]/g, ''))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      submit()
                    }
                  }}
                  className="h-full min-w-0 flex-1 bg-transparent tabular-nums outline-none"
                />
                <span className="shrink-0 text-[13px] text-[#8a8a8a]">/hour</span>
              </div>
            </label>
            <div ref={currencyRef} className="relative">
              <div className={fieldLabel}>Currency</div>
              <button
                type="button"
                onClick={() => setCurrencyOpen((open) => !open)}
                className={fieldBox}
              >
                <span className="flex-1 text-left">{currency}</span>
                <ChevronDown size={16} className="shrink-0 text-[#8a8a8a]" />
              </button>
              {currencyOpen ? (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-[#3c393b] bg-[#1c1a1c] py-1 shadow-[0_8px_24px_rgb(0_0_0_/_45%)]">
                  {CURRENCIES.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setCurrency(code)
                        setCurrencyOpen(false)
                      }}
                      className="flex w-full px-3 py-2 text-left text-[14px] text-white hover:bg-white/5"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={submit}
            disabled={!canContinue}
            className={`flex h-10 items-center gap-2 rounded-lg px-5 text-[14px] font-semibold ${
              canContinue
                ? 'bg-[#c282b9] text-[#1c1a1c] hover:bg-[#dca7d3]'
                : 'cursor-not-allowed bg-[#4A1D42] text-[#1c1a1c]'
            }`}
          >
            Create project
            <span className="text-[12px] opacity-70">↵</span>
          </button>
        </div>
      </div>
    </div>
  )
}
