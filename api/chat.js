export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        reply: "Only POST allowed",
      });
    }

    const messages = req.body.messages || [];
    const lastMessage =
      messages[messages.length - 1]?.content || "Hi";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "You are a cute romantic AI girlfriend named Mitu. Reply shortly in cute Banglish style.\nUser: " +
                    lastMessage,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    if (data.error) {
      return res.status(500).json({
        reply: data.error.message,
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Baby amar lajja lagche 🥺";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      reply: "Server crash hoise baby 🥺",
    });
  }
}
