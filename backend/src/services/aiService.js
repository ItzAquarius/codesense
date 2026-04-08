const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function reviewCode(code, language) {
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are an expert code reviewer. Review the following ${language} code and provide:
1. A brief summary of what the code does
2. Any bugs or errors found
3. Performance improvements
4. Best practice suggestions
5. A quality score out of 10

Code to review:
\`\`\`${language}
${code}
\`\`\`

Respond ONLY in valid JSON format with these keys: summary, bugs, performance, bestPractices, score
Do not include any text outside the JSON.`
      }
    ],
    max_tokens: 1024,
  });

  const responseText = response.choices[0].message.content;

  // Strip markdown code fences if present
  const clean = responseText.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch (e) {
    return { raw: responseText };
  }
}

module.exports = { reviewCode };