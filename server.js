require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'youtube-v31.p.rapidapi.com';

if (!RAPIDAPI_KEY) {
  console.error('RAPIDAPI_KEY not set in .env');
  process.exit(1);
}

app.get('/api/:endpoint', async (req, res) => {
  try {
    const { endpoint } = req.params;
    const params = req.query;

    const response = await axios.get(`https://${RAPIDAPI_HOST}/${endpoint}`, {
      params,
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

let history = []; // In-memory watch history

app.get('/api/history', (req, res) => {
  res.json(history);
});

app.post('/api/history', (req, res) => {
  const { videoId, title, timestamp } = req.body;
  if (videoId && title) {
    history.unshift({ videoId, title, timestamp: timestamp || new Date().toISOString() });
    // Keep top 50
    if (history.length > 50) history = history.slice(0, 50);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Missing videoId or title' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('History endpoints: GET/POST /api/history');
});
