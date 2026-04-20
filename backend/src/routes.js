const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeSense backend is healthy!' });
});

// Run code using Piston API
router.post('/run', async (req, res) => {
  const { code, language } = req.body;

  if (!code) return res.status(400).json({ error: 'No code provided' });

  const languageMap = {
    python: { language: 'python', version: '3.10.0' },
    javascript: { language: 'javascript', version: '18.15.0' },
    java: { language: 'java', version: '15.0.2' },
    cpp: { language: 'cpp', version: '10.2.0' },
    c: { language: 'c', version: '10.2.0' },
  };

  const lang = languageMap[language?.toLowerCase()] || { language: 'python', version: '3.10.0' };

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang.language,
        version: lang.version,
        files: [{ content: code }]
      })
    });

    const data = await response.json();
    res.json({
      output: data.run?.output || 'No output',
      stderr: data.run?.stderr || '',
      code: data.run?.code
    });

  } catch (error) {
    res.status(500).json({ error: 'Code execution failed', details: error.message });
  }
});

// AI Code Review + Suggestion
router.post('/review', async (req, res) => {
  const { code, language } = req.body;

  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert code reviewer. Analyze the following ${language || 'code'}.

Return your response in this EXACT JSON format (no markdown, no backticks, just raw JSON):
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
  "improved_code": "the full improved version of the code here"
}

Code to review:
${code}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean and parse JSON
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    res.json({
      language: language || 'unknown',
      ...parsed
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'AI review failed', details: error.message });
  }
});

module.exports = router;