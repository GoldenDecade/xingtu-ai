export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, session_id, app_id } = req.body;

    const body = {
      input: { prompt },
      parameters: { incremental_output: false }
    };

    if (session_id) body.input.session_id = session_id;

    const response = await fetch(
      `https://dashscope.aliyuncs.com/api/v1/apps/${app_id}/completion`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BAILIAN_API_KEY}`
        },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
