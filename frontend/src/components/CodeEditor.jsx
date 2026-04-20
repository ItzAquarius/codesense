const LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'c++']

export default function CodeEditor({ code, language, onCodeChange, onLanguageChange, onSubmit, onRun, loading, running }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-zinc-400 text-sm font-medium uppercase tracking-widest">
          Language
        </label>
        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2"
        >
          {LANGUAGES.map(l => (
            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
          ))}
        </select>
      </div>

      <textarea
        value={code}
        onChange={e => onCodeChange(e.target.value)}
        placeholder="Paste your code here..."
        rows={16}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm font-mono text-zinc-100 resize-none focus:outline-none focus:border-emerald-500"
      />

      <div className="flex gap-3">
        <button
          onClick={onRun}
          disabled={running || !code.trim()}
          className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold text-sm transition"
        >
          {running ? '⏳ Running...' : '▶️ Run Code'}
        </button>
        <button
          onClick={onSubmit}
          disabled={loading || !code.trim()}
          className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 font-semibold text-sm transition"
        >
          {loading ? '🔍 Reviewing...' : '🔎 Review Code'}
        </button>
      </div>
    </div>
  )
}