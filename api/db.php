<?php
$host = '127.0.0.1';
$db   = 'amara_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Automatically try to create database if it doesn't exist
    try {
        $temp_pdo = new PDO("mysql:host=$host;charset=$charset", $user, $pass, $options);
        $temp_pdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo = new PDO($dsn, $user, $pass, $options);
        // Run setup to create tables
        include_once __DIR__ . '/db_setup.php';
    } catch (\PDOException $e2) {
        header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json');
        echo json_encode(["error" => "Database connection failed: " . $e2->getMessage()]);
        exit;
    }
}
?>
