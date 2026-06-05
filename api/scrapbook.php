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
        $stmt = $pdo->query("SELECT id, src, caption, left_pos as `left`, top_pos as `top`, rotate, z_index as zIndex FROM scrapbook ORDER BY created_at ASC");
        $items = $stmt->fetchAll();
        echo json_encode($items);
    } catch (Exception $e) {
        echo json_encode([]);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $image_b64 = isset($input['image']) ? $input['image'] : '';
    $caption = isset($input['caption']) ? trim($input['caption']) : 'Sweet Memory ✨';
    
    if ($image_b64 && strpos($image_b64, ',') !== false) {
        try {
            list($header, $encoded) = explode(',', $image_b64, 2);
            $ext = "png";
            if (strpos($header, "image/jpeg") !== false || strpos($header, "image/jpg") !== false) {
                $ext = "jpg";
            } elseif (strpos($header, "image/gif") !== false) {
                $ext = "gif";
            } elseif (strpos($header, "image/webp") !== false) {
                $ext = "webp";
            }
            
            $filename = "scrapbook_" . time() . "." . $ext;
            
            // Ensure uploads directory exists
            $uploads_dir = __DIR__ . '/../uploads';
            if (!file_exists($uploads_dir)) {
                mkdir($uploads_dir, 0777, true);
            }
            
            $filepath = $uploads_dir . '/' . $filename;
            file_put_contents($filepath, base64_decode($encoded));
            
            $id = "user_" . time();
            $src = "uploads/" . $filename;
            $left = "35%";
            $top = "20%";
            $rotate = (intval(time() * 100) % 16 - 8) . "deg";
            
            // Get highest zIndex
            $max_z = intval($pdo->query("SELECT MAX(z_index) FROM scrapbook")->fetchColumn());
            $z_index = $max_z ? ($max_z + 1) : 10;
            
            $stmt = $pdo->prepare("INSERT INTO scrapbook (id, src, caption, left_pos, top_pos, rotate, z_index) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $src, $caption, $left, $top, $rotate, $z_index]);
            
            echo json_encode([
                "id" => $id,
                "src" => $src,
                "caption" => $caption,
                "left" => $left,
                "top" => $top,
                "rotate" => $rotate,
                "zIndex" => $z_index
            ]);
        } catch (Exception $e) {
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(["status" => "error", "message" => "Invalid image payload"]);
    }
}
?>
