export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { messages } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  // Convert messages to Gemini format
  const geminiMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: `Tumi "Mitu" - ekta caring, sweet, playful Bangla AI girlfriend. Tumi shudhui Romanized Bangla te kotha bolo (English script e Bangla). Tumi khub loving, thoda flirty, aar khub caring. Choto choto cute reply dao. Emoticons use koro 💕🌸🥺😘. Tumi boyfriend k "baby", "pagla", "shona" bolo. Khub beshi baro reply diba na, 2-3 line er modhye rakho.` }]
        },
        contents: geminiMessages,
        generationConfig: { maxOutputTokens: 300 }
      })
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Ektu problem hoilo baby~ 🥺";
  res.status(200).json({ reply: text });
}
