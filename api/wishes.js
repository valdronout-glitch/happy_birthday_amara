const { sql } = require('@vercel/postgres');

const DEFAULT_WISHES = [
    // --- Wishes dari Valdric ---
    { text: "I love you clar...", sender: "Valdric", color: "#ffb6c1" },
    { text: "I Love You SOMUCCHHHHHH", sender: "Valdric", color: "#ffb6c1" },
    { text: "akusayangkamu", sender: "V", color: "#ffb6c1" },
    // --- Wishes dari pengunjung ---
    { text: "Happy birthday, hope you have a great year!", sender: "Tester", color: "#ffb6c1" },
    { text: "Semoga Amara panjang umur dan sehat selalu!", sender: "TestVerifier", color: "#ffb6c1" }
];


module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // Auto-create table on first use
        await sql`CREATE TABLE IF NOT EXISTS wishes (
            id SERIAL PRIMARY KEY,
            text TEXT NOT NULL,
            sender VARCHAR(255) NOT NULL,
            color VARCHAR(50) NOT NULL DEFAULT '#ffb6c1',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        if (req.method === 'GET') {
            // Seed default wishes if table is empty
            const countResult = await sql`SELECT COUNT(*) as c FROM wishes`;
            if (parseInt(countResult.rows[0].c) === 0) {
                for (const w of DEFAULT_WISHES) {
                    await sql`INSERT INTO wishes (text, sender, color) VALUES (${w.text}, ${w.sender}, ${w.color})`;
                }
            }
            const result = await sql`SELECT text, sender, color FROM wishes ORDER BY id ASC`;
            return res.status(200).json(result.rows);
        }

        if (req.method === 'POST') {
            const body = req.body || {};
            const text = ((body.text || body.message) || '').trim();
            const sender = (body.sender || '').trim();
            const color = body.color || '#ffb6c1';

            if (!text || !sender) {
                return res.status(400).json({ status: 'error', message: 'Invalid parameters' });
            }

            await sql`INSERT INTO wishes (text, sender, color) VALUES (${text}, ${sender}, ${color})`;
            return res.status(200).json({ status: 'success', wish: { text, sender, color } });
        }
    } catch (err) {
        console.error('[wishes]', err.message);
        return res.status(500).json({ error: err.message });
    }
};
