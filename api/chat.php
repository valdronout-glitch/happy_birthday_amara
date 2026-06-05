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
        $stmt = $pdo->query("SELECT msg_id as id, sender, text, image, time FROM chat_messages ORDER BY id ASC");
        $messages = $stmt->fetchAll();
        
        foreach ($messages as &$msg) {
            if ($msg['image'] === null) {
                $msg['image'] = "";
            }
        }
        
        echo json_encode(["data" => ["messages" => $messages]]);
    } catch (Exception $e) {
        echo json_encode(["data" => ["messages" => []]]);
    }
} elseif ($method === 'POST' || $method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['data']['messages']) && is_array($input['data']['messages'])) {
        try {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO chat_messages (msg_id, sender, text, image, time) 
                VALUES (?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                text = VALUES(text), 
                image = VALUES(image), 
                time = VALUES(time)");
                
            foreach ($input['data']['messages'] as $msg) {
                $msg_id = isset($msg['id']) ? $msg['id'] : '';
                $sender = isset($msg['sender']) ? $msg['sender'] : '';
                $text = isset($msg['text']) ? $msg['text'] : '';
                $image = isset($msg['image']) ? $msg['image'] : '';
                $time = isset($msg['time']) ? $msg['time'] : '';
                
                if ($msg_id && $sender) {
                    $stmt->execute([$msg_id, $sender, $text, $image, $time]);
                }
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
        echo json_encode(["status" => "error", "message" => "Invalid messages format"]);
    }
}
?>
