const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeSense backend is healthy!' });
});

// Run code using Piston API
router.post('/run', async (req, res) => {
  const { code, language } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  const languageMap = {
  python:     { language: 'python',     version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  java:       { language: 'java',       version: '15.0.2' },
  'c++':      { language: 'cpp',        version: '10.2.0' },
  go:         { language: 'go',         version: '1.16.2' },
  rust:       { language: 'rust',       version: '1.68.2' },
};

  const lang = languageMap[language?.toLowerCase()] || { language: 'python', version: '3.10.0' };

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    language: lang.language,
    version: lang.version,
    files: [{ name: 'main', content: code }]  // ← add name field
  })
});

const data = await response.json();
console.log('Piston response:', JSON.stringify(data)); // ← add this

res.json({
  output: data.run?.stdout || data.run?.output || 'No output',  // ← try stdout first
  stderr: data.run?.stderr || '',
  code: data.run?.code
});
  } catch (error) {
    res.status(500).json({ error: 'Code execution failed', details: error.message });
  }
});

// AI Code Review using Groq
router.post('/review', async (req, res) => {
  const { code, language } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are an expert code reviewer. Analyze the following ${language || 'code'}.
Return ONLY a raw JSON object with no markdown, no backticks, no explanation. Just the JSON.
{
  "status": "optimized" or "needs_improvement",
  "summary": "one line verdict",
  "feedback": {
    "bugs": "feedback here",
    "security": "feedback here",
    "performance": "feedback here",
    "best_practices": "feedback here",
    "code_quality": "feedback here"
  },
  "improved_code": "full improved version of the code"
}
Code to review:
${code}`
        }
      ]
    });

    const text = response.choices[0].message.content;

    // Robust JSON extraction
    const clean = text.replace(/```json|```/g, '').trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const parsed = JSON.parse(jsonMatch[0]);
    res.json({ language: language || 'unknown', ...parsed });

  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'AI review failed', details: error.message });
  }
});

module.exports = router;