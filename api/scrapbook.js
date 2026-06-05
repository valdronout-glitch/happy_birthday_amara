const { sql } = require('@vercel/postgres');

// Default scrapbook items (only asset-based ones that exist in git repo)
const DEFAULT_SCRAPBOOK = [
    { id: 'default_amara_1', src: 'assets/amara_1.png', caption: 'Gorgeous Amara 🌸', left: '55.3662px', top: '7.54731px', rotate: '-3deg', zIndex: 59 },
    { id: 'default_amara_2', src: 'assets/amara_2.jpg', caption: 'Sweetest Smile 💕', left: '270.259px', top: '17.6247px', rotate: '4deg', zIndex: 77 },
    { id: 'default_amara_3', src: 'assets/amara_3.jpg', caption: 'Sparkling Eyes ✨', left: '474.584px', top: '21.5905px', rotate: '-5deg', zIndex: 76 }
];

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // Auto-create table on first use
        await sql`CREATE TABLE IF NOT EXISTS scrapbook (
            id VARCHAR(100) PRIMARY KEY,
            src TEXT NOT NULL,
            caption VARCHAR(255) NOT NULL DEFAULT '',
            left_pos VARCHAR(100) NOT NULL DEFAULT '35%',
            top_pos VARCHAR(100) NOT NULL DEFAULT '20%',
            rotate VARCHAR(50) NOT NULL DEFAULT '0deg',
            z_index INT NOT NULL DEFAULT 10,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        if (req.method === 'GET') {
            // Seed defaults if table is empty
            const countResult = await sql`SELECT COUNT(*) as c FROM scrapbook`;
            if (parseInt(countResult.rows[0].c) === 0) {
                for (const item of DEFAULT_SCRAPBOOK) {
                    await sql`INSERT INTO scrapbook (id, src, caption, left_pos, top_pos, rotate, z_index)
                        VALUES (${item.id}, ${item.src}, ${item.caption}, ${item.left}, ${item.top}, ${item.rotate}, ${item.zIndex})
                        ON CONFLICT (id) DO NOTHING`;
                }
            }
            const result = await sql`SELECT id, src, caption, left_pos as "left", top_pos as "top", rotate, z_index as "zIndex" FROM scrapbook ORDER BY created_at ASC`;
            return res.status(200).json(result.rows);
        }

        if (req.method === 'POST') {
            const body = req.body || {};
            const image_b64 = body.image || '';
            const caption = (body.caption || 'Sweet Memory ✨').trim();

            if (!image_b64) {
                return res.status(400).json({ status: 'error', message: 'Invalid image payload' });
            }

            // On Vercel: store base64 data URL directly in src (no filesystem access)
            const id = 'user_' + Date.now();
            const left = '35%';
            const top = '20%';
            const rotate = (Math.floor(Math.random() * 16) - 8) + 'deg';

            const maxZResult = await sql`SELECT MAX(z_index) as max_z FROM scrapbook`;
            const z_index = (parseInt(maxZResult.rows[0].max_z) || 10) + 1;

            await sql`INSERT INTO scrapbook (id, src, caption, left_pos, top_pos, rotate, z_index)
                VALUES (${id}, ${image_b64}, ${caption}, ${left}, ${top}, ${rotate}, ${z_index})`;

            return res.status(200).json({ id, src: image_b64, caption, left, top, rotate, zIndex: z_index });
        }
    } catch (err) {
        console.error('[scrapbook]', err.message);
        return res.status(500).json({ error: err.message });
    }
};
