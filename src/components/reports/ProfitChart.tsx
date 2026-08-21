import { useMemo } from 'react'

const DAYS = [
  { label: 'Mon 8/17', revenue: 0, profit: 0 },
  { label: 'Tue 8/18', revenue: 0, profit: 0 },
  { label: 'Wed 8/19', revenue: 0, profit: 0 },
  { label: 'Thu 8/20', revenue: 0, profit: 0 },
  { label: 'Fri 8/21', revenue: 390, profit: 390 },
  { label: 'Sat 8/22', revenue: 390, profit: 390 },
  { label: 'Sun 8/23', revenue: 0, profit: 180 },
]

export function ProfitChart() {
  const width = 760
  const height = 260
  const pad = { top: 16, right: 12, bottom: 44, left: 40 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const maxY = 400
  const barW = innerW / DAYS.length * 0.42

  const xAt = (index: number) => pad.left + (index + 0.5) * (innerW / DAYS.length)
  const yAt = (value: number) => pad.top + innerH - (value / maxY) * innerH

  const profitLine = DAYS.map((day, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index)} ${yAt(day.profit)}`).join(' ')
  const forecast = `M ${xAt(5)} ${yAt(390)} L ${xAt(6)} ${yAt(180)}`

  const ticks = useMemo(() => [400, 200, 0], [])

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[260px] w-full" role="img" aria-label="Profitability trend">
      {ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={pad.left}
            x2={width - pad.right}
            y1={yAt(tick)}
            y2={yAt(tick)}
            stroke="#3c393b"
            strokeWidth="1"
          />
          <text x={pad.left - 8} y={yAt(tick) + 4} textAnchor="end" fill="#b3b0b2" fontSize="11">
            {tick}
          </text>
        </g>
      ))}
      {DAYS.map((day, index) =>
        day.revenue > 0 ? (
          <rect
            key={day.label}
            x={xAt(index) - barW / 2}
            y={yAt(day.revenue)}
            width={barW}
            height={yAt(0) - yAt(day.revenue)}
            rx="3"
            fill="#c282b9"
          />
        ) : null,
      )}
      <path d={profitLine} fill="none" stroke="#e7e7ea" strokeWidth="2" />
      <path d={forecast} fill="none" stroke="#e7e7ea" strokeWidth="2" strokeDasharray="5 5" />
      {DAYS.map((day, index) => (
        <text
          key={`${day.label}-x`}
          x={xAt(index)}
          y={height - 16}
          textAnchor="middle"
          fill="#b3b0b2"
          fontSize="11"
        >
          {day.label}
        </text>
      ))}
    </svg>
  )
}
