const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

app.use(cors());
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
        contents: [{ parts: [{ text: message }] }]
    };
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) {
            return res.status(500).json({ error: data.error?.message || 'Gemini API error' });
        }
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: 'Server error contacting Gemini.' });
    }
});

app.listen(PORT, () => {
    console.log(`Gemini proxy server running on port ${PORT}`);
});
