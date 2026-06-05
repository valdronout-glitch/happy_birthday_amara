const { sql } = require('@vercel/postgres');

const DEFAULT_PROFILES = {
    valdric: { displayName: 'Valdric 💖', bio: 'Mencintaimu adalah hal terbaik yang pernah ada.', mood: 'Kangen Amara... 💕', avatar: '' },
    amara:   { displayName: 'Amara Clarinta 🌸', bio: 'Sweet 21st, looking forward to magical days!', mood: 'Happy Birthday! 🎉🌸', avatar: '' }
};

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // Auto-create table on first use
        await sql`CREATE TABLE IF NOT EXISTS profiles (
            username VARCHAR(50) PRIMARY KEY,
            display_name VARCHAR(255) NOT NULL DEFAULT '',
            bio VARCHAR(255) NOT NULL DEFAULT '',
            mood VARCHAR(255) NOT NULL DEFAULT '',
            avatar TEXT DEFAULT '',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        if (req.method === 'GET') {
            // Seed default profiles if table is empty
            const countResult = await sql`SELECT COUNT(*) as c FROM profiles`;
            if (parseInt(countResult.rows[0].c) === 0) {
                for (const [username, p] of Object.entries(DEFAULT_PROFILES)) {
                    await sql`INSERT INTO profiles (username, display_name, bio, mood, avatar)
                        VALUES (${username}, ${p.displayName}, ${p.bio}, ${p.mood}, ${p.avatar})
                        ON CONFLICT (username) DO NOTHING`;
                }
            }
            const result = await sql`SELECT username, display_name, bio, mood, avatar FROM profiles`;
            const profiles = {};
            for (const row of result.rows) {
                profiles[row.username] = {
                    displayName: row.display_name,
                    bio: row.bio,
                    mood: row.mood,
                    avatar: row.avatar || ''
                };
            }
            return res.status(200).json({ data: { profiles } });
        }

        if (req.method === 'POST' || req.method === 'PUT') {
            const body = req.body || {};
            if (body.data && body.data.profiles) {
                for (const [username, p] of Object.entries(body.data.profiles)) {
                    const displayName = p.displayName || '';
                    const bio = p.bio || '';
                    const mood = p.mood || '';
                    const avatar = p.avatar || '';
                    await sql`INSERT INTO profiles (username, display_name, bio, mood, avatar)
                        VALUES (${username}, ${displayName}, ${bio}, ${mood}, ${avatar})
                        ON CONFLICT (username) DO UPDATE SET
                            display_name = EXCLUDED.display_name,
                            bio = EXCLUDED.bio,
                            mood = EXCLUDED.mood,
                            avatar = EXCLUDED.avatar,
                            updated_at = CURRENT_TIMESTAMP`;
                }
                return res.status(200).json({ status: 'success' });
            }
            return res.status(400).json({ status: 'error', message: 'Invalid profiles format' });
        }
    } catch (err) {
        console.error('[profile]', err.message);
        return res.status(500).json({ error: err.message });
    }
};
