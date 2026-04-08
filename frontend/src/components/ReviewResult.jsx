export default function ReviewResult({ review }) {
  if (!review) return (
    <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
      <div className="text-5xl">🧠</div>
      <p className="text-sm">Your review will appear here</p>
    </div>
  )

  const scoreColor = review.score >= 8 ? 'text-emerald-400' : review.score >= 5 ? 'text-yellow-400' : 'text-red-400'

  const sections = [
    { icon: '📋', label: 'Summary', value: review.summary },
    { icon: '🐛', label: 'Bugs Found', value: review.bugs },
    { icon: '⚡', label: 'Performance', value: review.performance },
    { icon: '✅', label: 'Best Practices', value: review.bestPractices },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <label className="text-zinc-400 text-sm font-medium uppercase tracking-widest">AI Review</label>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-sm">Score:</span>
          <span className={`text-2xl font-bold ${scoreColor}`}>{review.score}<span className="text-zinc-600 text-sm">/10</span></span>
        </div>
      </div>

      {sections.map(({ icon, label, value }) => (
        <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase tracking-widest">
            <span>{icon}</span><span>{label}</span>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed">{value}</p>
        </div>
      ))}
    </div>
  )
}