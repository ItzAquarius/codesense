export default function Header() {
  return (
    <header className="border-b border-zinc-800 px-8 py-4 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold text-sm">CS</div>
      <span className="text-white font-semibold tracking-wide text-lg">CodeSense</span>
      <span className="ml-2 text-xs text-zinc-500 border border-zinc-700 rounded-full px-2 py-0.5">AI Code Review</span>
    </header>
  )
}