export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.log('METRO_FEEDBACK', JSON.stringify({ ...body, receivedAt: new Date().toISOString() }));
      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error('METRO_FEEDBACK_ERROR', error);
      return res.status(400).json({ ok: false, error: 'Invalid feedback' });
    }
  }
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, message: 'Feedback endpoint is active. Feedback records are captured in Vercel runtime logs.' });
  }
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ ok: false });
}
