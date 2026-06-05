<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT username, display_name, bio, mood, avatar FROM profiles");
        $rows = $stmt->fetchAll();
        
        $profiles = [];
        foreach ($rows as $row) {
            $profiles[$row['username']] = [
                "displayName" => $row['display_name'],
                "bio" => $row['bio'],
                "mood" => $row['mood'],
                "avatar" => $row['avatar'] ? $row['avatar'] : ""
            ];
        }
        
        echo json_encode(["data" => ["profiles" => $profiles]]);
    } catch (Exception $e) {
        echo json_encode(["data" => ["profiles" => []]]);
    }
} elseif ($method === 'POST' || $method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['data']['profiles']) && is_array($input['data']['profiles'])) {
        try {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO profiles (username, display_name, bio, mood, avatar) 
                VALUES (?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                display_name = VALUES(display_name), 
                bio = VALUES(bio), 
                mood = VALUES(mood), 
                avatar = VALUES(avatar)");
                
            foreach ($input['data']['profiles'] as $username => $profile) {
                $displayName = isset($profile['displayName']) ? $profile['displayName'] : '';
                $bio = isset($profile['bio']) ? $profile['bio'] : '';
                $mood = isset($profile['mood']) ? $profile['mood'] : '';
                $avatar = isset($profile['avatar']) ? $profile['avatar'] : '';
                
                $stmt->execute([$username, $displayName, $bio, $mood, $avatar]);
            }
            $pdo->commit();
            echo json_encode(["status" => "success"]);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(["status" => "error", "message" => "Invalid profiles format"]);
    }
}
?>
