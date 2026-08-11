const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const feedback = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!feedback || typeof feedback !== 'object') {
      return res.status(400).json({ ok: false, error: 'Invalid feedback payload' });
    }

    const record = {
      ...feedback,
      receivedAt: new Date().toISOString()
    };

    const pathname = `feedback/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.json`;

    const blob = await put(pathname, JSON.stringify(record, null, 2), {
      access: 'public',
      contentType: 'application/json'
    });

    return res.status(200).json({ ok: true, pathname: blob.pathname });
  } catch (error) {
    console.error('Feedback storage failed:', error);
    return res.status(500).json({ ok: false, error: 'Unable to save feedback' });
  }
};
