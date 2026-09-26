<?php
/**
 * 1-Click Database Setup & Migrator for Hostinger
 * Sewa Genset Cirebon (SGC)
 */

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$pdo = getDbConnection();

if (!$pdo) {
    echo json_encode([
        'success' => false,
        'message' => 'Gagal terhubung ke Database MySQL Hostinger.',
        'details' => 'Pastikan DB_HOST, DB_NAME, DB_USER, dan DB_PASS di file public/api/config.php sudah sesuai dengan info database di hPanel Hostinger.',
        'config' => [
            'host' => DB_HOST,
            'database' => DB_NAME,
            'user' => DB_USER,
            'port' => DB_PORT
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$sqlFile = __DIR__ . '/database.sql';
if (!file_exists($sqlFile)) {
    echo json_encode([
        'success' => false,
        'message' => 'File database.sql tidak ditemukan di server.'
    ]);
    exit;
}

try {
    $sql = file_get_contents($sqlFile);
    // Execute multiple statements
    $pdo->exec($sql);

    // Hitung tabel yang berhasil dibuat
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        'success' => true,
        'message' => 'Database Hostinger berhasil diinisialisasi dan semua data awal telah diimpor!',
        'tables_count' => count($tables),
        'tables' => $tables,
        'default_admin' => [
            'username' => 'admin',
            'password' => 'admin123'
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan saat mengeksekusi SQL: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
