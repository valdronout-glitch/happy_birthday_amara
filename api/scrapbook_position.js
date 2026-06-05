const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Method not allowed' });
    }

    try {
        const body = req.body || {};
        const { id, left, top, zIndex } = body;

        if (!id) {
            return res.status(400).json({ status: 'error', message: 'Missing item id' });
        }

        // Update each provided field individually
        if (left !== undefined && left !== null) {
            await sql`UPDATE scrapbook SET left_pos = ${left} WHERE id = ${id}`;
        }
        if (top !== undefined && top !== null) {
            await sql`UPDATE scrapbook SET top_pos = ${top} WHERE id = ${id}`;
        }
        if (zIndex !== undefined && zIndex !== null) {
            await sql`UPDATE scrapbook SET z_index = ${parseInt(zIndex)} WHERE id = ${id}`;
        }

        return res.status(200).json({ status: 'success' });
    } catch (err) {
        console.error('[scrapbook_position]', err.message);
        return res.status(500).json({ error: err.message });
    }
};
