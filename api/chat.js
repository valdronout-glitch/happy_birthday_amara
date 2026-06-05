const { sql } = require('@vercel/postgres');

const DEFAULT_MESSAGES = [
    { id: 'welcome', sender: 'System', text: 'Selamat datang di LoveSpace rahasia! 💖', image: '', time: '2026-06-02T22:15:00Z' }
];

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // Auto-create table on first use
        await sql`CREATE TABLE IF NOT EXISTS chat_messages (
            id SERIAL PRIMARY KEY,
            msg_id VARCHAR(100) UNIQUE NOT NULL,
            sender VARCHAR(50) NOT NULL,
            text TEXT,
            image TEXT,
            time VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        if (req.method === 'GET') {
            // Seed welcome message if table is empty
            const countResult = await sql`SELECT COUNT(*) as c FROM chat_messages`;
            if (parseInt(countResult.rows[0].c) === 0) {
                for (const m of DEFAULT_MESSAGES) {
                    await sql`INSERT INTO chat_messages (msg_id, sender, text, image, time)
                        VALUES (${m.id}, ${m.sender}, ${m.text}, ${m.image}, ${m.time})
                        ON CONFLICT (msg_id) DO NOTHING`;
                }
            }
            const result = await sql`SELECT msg_id as id, sender, text, image, time FROM chat_messages ORDER BY id ASC`;
            const messages = result.rows.map(m => ({ ...m, image: m.image || '' }));
            return res.status(200).json({ data: { messages } });
        }

        if (req.method === 'POST' || req.method === 'PUT') {
            const body = req.body || {};
            if (body.data && Array.isArray(body.data.messages)) {
                for (const msg of body.data.messages) {
                    const msg_id = msg.id || '';
                    const sender = msg.sender || '';
                    const text = msg.text || '';
                    const image = msg.image || '';
                    const time = msg.time || '';
                    if (msg_id && sender) {
                        await sql`INSERT INTO chat_messages (msg_id, sender, text, image, time)
                            VALUES (${msg_id}, ${sender}, ${text}, ${image}, ${time})
                            ON CONFLICT (msg_id) DO UPDATE SET
                                text = EXCLUDED.text,
                                image = EXCLUDED.image,
                                time = EXCLUDED.time`;
                    }
                }
                return res.status(200).json({ status: 'success' });
            }
            return res.status(400).json({ status: 'error', message: 'Invalid messages format' });
        }
    } catch (err) {
        console.error('[chat]', err.message);
        return res.status(500).json({ error: err.message });
    }
};
