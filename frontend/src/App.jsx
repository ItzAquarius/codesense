import { useState } from 'react'
import Header from './components/Header'
import CodeEditor from './components/CodeEditor'
import ReviewResult from './components/ReviewResult'

const BACKEND_URL = 'https://codesense-backend-rc2u.onrender.com'

export default function App() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [review, setReview] = useState(null)
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState(null)

  async function handleReview() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BACKEND_URL}/api/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setReview(data)
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  async function handleRun() {
    setRunning(true)
    setError(null)
    try {
      const res = await fetch(`${BACKEND_URL}/api/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      })
      const data = await res.json()
      setOutput(data)
    } catch (err) {
      setError('Failed to run code')
    } finally {
      setRunning(false)
    }
  }

  return (
  <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
    <Header />
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
      <CodeEditor
        code={code}
        language={language}
        onCodeChange={setCode}
        onLanguageChange={setLanguage}
        onSubmit={handleReview}
        onRun={handleRun}
        loading={loading}
        running={running}
      />
      {error && (
        <p className="text-red-400 text-sm mt-4 bg-red-900/20 border border-red-800 rounded-lg p-3">
          {error}
        </p>
      )}
      {/* Always render ReviewResult so output panel is always visible */}
      <ReviewResult review={review} output={output} />
    </main>
  </div>
)
}