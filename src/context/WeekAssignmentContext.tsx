import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'toggl-assigned-ids'

type WeekAssignmentContextValue = {
  assignedIds: Set<string>
  setAssignedIds: (ids: string[]) => void
}

const WeekAssignmentContext = createContext<WeekAssignmentContextValue | null>(null)

function readStoredIds() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return [] as string[]
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return [] as string[]
  }
}

function sameIds(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  const left = [...a].sort()
  const right = [...b].sort()
  return left.every((id, index) => id === right[index])
}

export function WeekAssignmentProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(readStoredIds)
  const assignedIds = useMemo(() => new Set(ids), [ids])

  const setAssignedIds = useCallback((next: string[]) => {
    setIds((current) => {
      if (sameIds(current, next)) return current
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <WeekAssignmentContext.Provider value={{ assignedIds, setAssignedIds }}>
      {children}
    </WeekAssignmentContext.Provider>
  )
}

export function useWeekAssignment() {
  const value = useContext(WeekAssignmentContext)
  if (!value) {
    return {
      assignedIds: new Set<string>(),
      setAssignedIds: (_ids: string[]) => undefined,
    }
  }
  return value
}
