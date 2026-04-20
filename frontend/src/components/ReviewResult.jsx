export default function ReviewResult({ review, output }) {
  return (
    <div className="mt-8 flex flex-col gap-6">

      {/* Output + Improved Code Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — Code Output */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-widest mb-3">
            ▶️ Code Output
          </h2>
          {output ? (
  <>
    {output.stderr ? (
      <pre className="text-red-400 text-sm font-mono whitespace-pre-wrap bg-red-900/10 rounded-lg p-3">
        {output.stderr}
      </pre>
    ) : (
      <pre className="text-emerald-300 text-sm font-mono whitespace-pre-wrap bg-zinc-800 rounded-lg p-3">
        {output.output && output.output !== 'No output'
          ? output.output
          : '(no output produced)'}
      </pre>
    )}
  </>
) : (
  <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">
    Click "Run Code" to see output
  </div>
)}
        </div>

        {/* Right — Improved Code */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-widest mb-3">
            ✨ Improved Code
          </h2>
          {review?.improved_code ? (
            <pre className="text-blue-200 text-sm font-mono whitespace-pre-wrap bg-zinc-800 rounded-lg p-3 overflow-x-auto">
              {review.improved_code}
            </pre>
          ) : (
            <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">
              Click "Review Code" to see suggestions
            </div>
          )}
        </div>
      </div>

      {/* Review Feedback */}
      {review && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">

          {/* Badge */}
          <div className="flex items-center justify-between">
            <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-widest">
              🔎 AI Review
            </h2>
            <span className={`px-4 py-1 rounded-full text-sm font-bold ${
              review.status === 'optimized'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
            }`}>
              {review.status === 'optimized' ? '✅ Optimized Code' : '⚠️ Needs Improvement'}
            </span>
          </div>

          {/* Summary */}
          {review.summary && (
            <p className="text-zinc-300 text-sm bg-zinc-800 rounded-lg p-3">{review.summary}</p>
          )}

          {/* Feedback Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {review.feedback && Object.entries(review.feedback).map(([key, value]) => (
              <div key={key} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest mb-2">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-zinc-300 text-sm leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}