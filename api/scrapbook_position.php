<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $id = isset($input['id']) ? $input['id'] : '';
    $left = isset($input['left']) ? $input['left'] : null;
    $top = isset($input['top']) ? $input['top'] : null;
    $z_index = isset($input['zIndex']) ? intval($input['zIndex']) : null;
    
    if ($id) {
        try {
            $query = "UPDATE scrapbook SET ";
            $params = [];
            $updates = [];
            
            if ($left !== null) {
                $updates[] = "left_pos = ?";
                $params[] = $left;
            }
            if ($top !== null) {
                $updates[] = "top_pos = ?";
                $params[] = $top;
            }
            if ($z_index !== null) {
                $updates[] = "z_index = ?";
                $params[] = $z_index;
            }
            
            if (!empty($updates)) {
                $query .= implode(', ', $updates) . " WHERE id = ?";
                $params[] = $id;
                
                $stmt = $pdo->prepare($query);
                $stmt->execute($params);
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "no-op"]);
            }
        } catch (Exception $e) {
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(["status" => "error", "message" => "Missing item id"]);
    }
}
?>
