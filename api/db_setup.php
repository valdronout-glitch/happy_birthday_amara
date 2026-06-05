<?php
// Ensure this script has access to PDO connection $pdo
if (!isset($pdo)) {
    require_once __DIR__ . '/db.php';
}

try {
    // 1. Table creations
    $pdo->exec("CREATE TABLE IF NOT EXISTS wishes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        text TEXT NOT NULL,
        sender VARCHAR(255) NOT NULL,
        color VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS scrapbook (
        id VARCHAR(100) PRIMARY KEY,
        src TEXT NOT NULL,
        caption VARCHAR(255) NOT NULL,
        left_pos VARCHAR(50) NOT NULL,
        top_pos VARCHAR(50) NOT NULL,
        rotate VARCHAR(50) NOT NULL,
        z_index INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        msg_id VARCHAR(100) UNIQUE NOT NULL,
        sender VARCHAR(50) NOT NULL,
        text TEXT,
        image LONGTEXT,
        time VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS profiles (
        username VARCHAR(50) PRIMARY KEY,
        display_name VARCHAR(255) NOT NULL,
        bio VARCHAR(255) NOT NULL,
        mood VARCHAR(255) NOT NULL,
        avatar LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 2. Migrate/Seed Profiles from lovespace.json or defaults
    $lovespaceFile = __DIR__ . '/../lovespace.json';
    $profilesSeeded = false;
    if (file_exists($lovespaceFile)) {
        $lsData = json_decode(file_get_contents($lovespaceFile), true);
        if (isset($lsData['profiles']) && is_array($lsData['profiles'])) {
            $stmt = $pdo->prepare("INSERT INTO profiles (username, display_name, bio, mood, avatar) VALUES (?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), bio = VALUES(bio), mood = VALUES(mood), avatar = VALUES(avatar);");
            foreach ($lsData['profiles'] as $username => $profile) {
                $displayName = isset($profile['displayName']) ? $profile['displayName'] : '';
                $bio = isset($profile['bio']) ? $profile['bio'] : '';
                $mood = isset($profile['mood']) ? $profile['mood'] : '';
                $avatar = isset($profile['avatar']) ? $profile['avatar'] : '';
                $stmt->execute([$username, $displayName, $bio, $mood, $avatar]);
            }
            $profilesSeeded = true;
        }
    }

    if (!$profilesSeeded) {
        $stmt = $pdo->prepare("INSERT INTO profiles (username, display_name, bio, mood, avatar) VALUES 
            ('valdric', 'Valdric 💖', 'Mencintaimu adalah hal terbaik yang pernah ada.', 'Kangen Amara...', ''),
            ('amara', 'Amara Clarinta 🌸', 'Sweet 21st, looking forward to magical days!', 'Happy Birthday!', '')
            ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), bio = VALUES(bio), mood = VALUES(mood);");
        $stmt->execute();
    }

    // 3. Migrate/Seed Chat Messages from lovespace.json
    if (file_exists($lovespaceFile)) {
        $lsData = json_decode(file_get_contents($lovespaceFile), true);
        if (isset($lsData['messages']) && is_array($lsData['messages'])) {
            $stmt = $pdo->prepare("INSERT INTO chat_messages (msg_id, sender, text, image, time) VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE text = VALUES(text), image = VALUES(image), time = VALUES(time);");
            foreach ($lsData['messages'] as $msg) {
                $msg_id = isset($msg['id']) ? $msg['id'] : '';
                $sender = isset($msg['sender']) ? $msg['sender'] : '';
                $text = isset($msg['text']) ? $msg['text'] : '';
                $image = isset($msg['image']) ? $msg['image'] : '';
                $time = isset($msg['time']) ? $msg['time'] : '';
                if ($msg_id && $sender) {
                    $stmt->execute([$msg_id, $sender, $text, $image, $time]);
                }
            }
        }
    }

    // 4. Migrate/Seed Scrapbook Items from scrapbook.json
    $scrapbookJsonFile = __DIR__ . '/../scrapbook.json';
    if (file_exists($scrapbookJsonFile)) {
        $scrapbookData = json_decode(file_get_contents($scrapbookJsonFile), true);
        if (is_array($scrapbookData)) {
            $stmt = $pdo->prepare("INSERT INTO scrapbook (id, src, caption, left_pos, top_pos, rotate, z_index) VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE src = VALUES(src), caption = VALUES(caption), left_pos = VALUES(left_pos), top_pos = VALUES(top_pos), rotate = VALUES(rotate), z_index = VALUES(z_index);");
            foreach ($scrapbookData as $item) {
                $id = isset($item['id']) ? $item['id'] : '';
                $src = isset($item['src']) ? $item['src'] : '';
                $caption = isset($item['caption']) ? $item['caption'] : '';
                $left = isset($item['left']) ? $item['left'] : '';
                $top = isset($item['top']) ? $item['top'] : '';
                $rotate = isset($item['rotate']) ? $item['rotate'] : '';
                $zIndex = isset($item['zIndex']) ? intval($item['zIndex']) : 0;
                if ($id && $src) {
                    $stmt->execute([$id, $src, $caption, $left, $top, $rotate, $zIndex]);
                }
            }
        }
    } else {
        // Fallback default seed if json is missing
        $count = $pdo->query("SELECT COUNT(*) FROM scrapbook")->fetchColumn();
        if ($count == 0) {
            $stmt = $pdo->prepare("INSERT INTO scrapbook (id, src, caption, left_pos, top_pos, rotate, z_index) VALUES 
                ('default_amara_1', 'assets/amara_1.png', 'Gorgeous Amara 🌸', '8%', '12%', '-3deg', 10),
                ('default_amara_2', 'assets/amara_2.jpg', 'Sweetest Smile 💕', '36%', '8%', '4deg', 11),
                ('default_amara_3', 'assets/amara_3.jpg', 'Sparkling Eyes ✨', '65%', '14%', '-5deg', 12)
                ON DUPLICATE KEY UPDATE src = VALUES(src), caption = VALUES(caption), left_pos = VALUES(left_pos), top_pos = VALUES(top_pos), rotate = VALUES(rotate), z_index = VALUES(z_index);");
            $stmt->execute();
        }
    }

    // 5. Migrate/Seed Wishes from wishes.json if table is empty
    $countWishes = $pdo->query("SELECT COUNT(*) FROM wishes")->fetchColumn();
    if ($countWishes == 0) {
        $wishesJsonFile = __DIR__ . '/../wishes.json';
        if (file_exists($wishesJsonFile)) {
            $wishesData = json_decode(file_get_contents($wishesJsonFile), true);
            if (is_array($wishesData)) {
                $stmt = $pdo->prepare("INSERT INTO wishes (text, sender, color) VALUES (?, ?, ?)");
                foreach ($wishesData as $w) {
                    if (isset($w['text']) && isset($w['sender']) && isset($w['color'])) {
                        $stmt->execute([$w['text'], $w['sender'], $w['color']]);
                    }
                }
            }
        }
    }
} catch (Exception $e) {
    // If run directly, log or show error
    if (basename($_SERVER['PHP_SELF']) == 'db_setup.php') {
        header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        exit;
    }
}
?>
