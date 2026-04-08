const express = require('express');
const router = express.Router();
const { reviewCode } = require('./services/aiService');

router.post('/review', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        error: 'Both code and language are required'
      });
    }

    const review = await reviewCode(code, language);
    res.json({ success: true, review });

  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({
      error: 'Failed to review code',
      details: error.message
    });
  }
});

module.exports = router;