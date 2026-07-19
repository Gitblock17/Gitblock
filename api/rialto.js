// Vercel serverless proxy for Rialto Swap API
// Keeps RIALTO_API_KEY server-side — never exposed to the browser
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const apiKey = process.env.RIALTO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "RIALTO_API_KEY not configured" });
  }

  const { endpoint, ...params } = req.query;

  if (!endpoint || !["tokens", "quote"].includes(endpoint)) {
    return res.status(400).json({ error: 'endpoint must be "tokens" or "quote"' });
  }

  const baseUrl = "https://rialto-trade-api.rialto.xyz";
  const apiUrl = `${baseUrl}/${endpoint}?${new URLSearchParams(params).toString()}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: "Rialto API unreachable", detail: err.message });
  }
}
