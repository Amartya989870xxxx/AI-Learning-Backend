const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-topic', async (req, res) => {
  const { topic, mode } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:"You are an AI teacher. Explain the topic given by the user in an engaging ${mode} format, and then generate 10–15 quiz questions to test the user's understanding.",
          },
          {
            role: "user",
            content: 'Topic: ${topic}',
          },
        ],
        temperature: 0.8,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization: Bearer ${process.env.OPENAI_API_KEY}',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'OpenAI API call failed.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
