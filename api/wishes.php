<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT text, sender, color FROM wishes ORDER BY id ASC");
        $wishes = $stmt->fetchAll();
        echo json_encode($wishes);
    } catch (Exception $e) {
        echo json_encode([]);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        $input = $_POST;
    }
    
    $text = isset($input['text']) ? trim($input['text']) : (isset($input['message']) ? trim($input['message']) : '');
    $sender = isset($input['sender']) ? trim($input['sender']) : '';
    $color = isset($input['color']) ? trim($input['color']) : '#ffb6c1';
    
    if ($text && $sender) {
        try {
            $stmt = $pdo->prepare("INSERT INTO wishes (text, sender, color) VALUES (?, ?, ?)");
            $stmt->execute([$text, $sender, $color]);
            echo json_encode(["status" => "success", "wish" => ["text" => $text, "sender" => $sender, "color" => $color]]);
        } catch (Exception $e) {
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(["status" => "error", "message" => "Invalid parameters"]);
    }
}
?>
