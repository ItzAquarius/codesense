import { useState } from 'react'
import Header from './components/Header'
import CodeEditor from './components/CodeEditor'
import ReviewResult from './components/ReviewResult'

export default function App() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleReview() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://codesense-backend-rc2u.onrender.com/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      })
      const data = await res.json()
      if (data.success) setReview(data.review)
      else setError(data.error)
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-8 max-w-7xl mx-auto w-full">
        <CodeEditor
          code={code}
          language={language}
          onCodeChange={setCode}
          onLanguageChange={setLanguage}
          onSubmit={handleReview}
          loading={loading}
        />
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 overflow-y-auto">
          {error && <p className="text-red-400 text-sm mb-4 bg-red-900/20 border border-red-800 rounded-lg p-3">{error}</p>}
          <ReviewResult review={review} />
        </div>
      </main>
    </div>
  )
}