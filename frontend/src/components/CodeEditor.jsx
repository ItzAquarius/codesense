const LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'c++', 'go', 'rust']

export default function CodeEditor({ code, language, onCodeChange, onLanguageChange, onSubmit, loading }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Your Code</label>
        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
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
        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-emerald-300 font-mono text-sm resize-none focus:outline-none focus:border-emerald-500 placeholder-zinc-600"
      />

      <button
        onClick={onSubmit}
        disabled={loading || !code.trim()}
        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold text-sm tracking-wide transition-all duration-200"
      >
        {loading ? '⏳ Reviewing...' : '🔍 Review Code'}
      </button>
    </div>
  )
}