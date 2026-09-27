module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { name, email, discord, package: pkg, details } = body;
    if (!name || !email || !pkg || !details) return res.status(400).json({ error: 'Missing required fields' });
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) return res.status(503).json({ error: 'Discord webhook is not configured' });
    const safe = value => String(value ?? '').slice(0, 1000);
    const payload = {
      username: 'Thimot WebForge',
      embeds: [{
        title: '🛒 New Website Order',
        color: 0x8065ff,
        fields: [
          { name: 'Customer', value: safe(name), inline: true },
          { name: 'Email', value: safe(email), inline: true },
          { name: 'Discord', value: safe(discord || 'Not provided'), inline: true },
          { name: 'Package', value: safe(pkg), inline: true },
          { name: 'Project details', value: safe(details) }
        ],
        footer: { text: 'Thimot WebForge • New project request' },
        timestamp: new Date().toISOString()
      }]
    };
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('Discord error:', response.status, text);
      return res.status(502).json({ error: 'Discord delivery failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
