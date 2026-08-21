import { PeriodToolbar } from '../components/calendar/PeriodToolbar'
import { SummaryBar } from '../components/calendar/SummaryBar'
import { CalendarGrid } from '../components/calendar/CalendarGrid'

export function TimerPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col bg-toggl-app">
      <PeriodToolbar />
      <SummaryBar />
      <CalendarGrid />
    </main>
  )
}
