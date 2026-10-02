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

    // Auto-migrate bookings columns if table already existed prior to update
    try {
        $cols = $pdo->query("SHOW COLUMNS FROM `bookings`")->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array('selected_genset_id', $cols)) {
            $pdo->exec("ALTER TABLE `bookings` ADD COLUMN `selected_genset_id` VARCHAR(64) NULL AFTER `phone`");
        }
        if (!in_array('selected_genset_name', $cols)) {
            $pdo->exec("ALTER TABLE `bookings` ADD COLUMN `selected_genset_name` VARCHAR(150) NULL AFTER `selected_genset_id`");
        }
        if (!in_array('genset_quantity', $cols)) {
            $pdo->exec("ALTER TABLE `bookings` ADD COLUMN `genset_quantity` INT NOT NULL DEFAULT 0 AFTER `selected_genset_name`");
        }
        if (!in_array('genset_duration', $cols)) {
            $pdo->exec("ALTER TABLE `bookings` ADD COLUMN `genset_duration` VARCHAR(100) NULL AFTER `genset_quantity`");
        }
        if (!in_array('selected_ac_id', $cols)) {
            $pdo->exec("ALTER TABLE `bookings` ADD COLUMN `selected_ac_id` VARCHAR(64) NULL AFTER `genset_duration`");
        }
        if (!in_array('selected_ac_name', $cols)) {
            $pdo->exec("ALTER TABLE `bookings` ADD COLUMN `selected_ac_name` VARCHAR(150) NULL AFTER `selected_ac_id`");
        }
        if (!in_array('ac_quantity', $cols)) {
            $pdo->exec("ALTER TABLE `bookings` ADD COLUMN `ac_quantity` INT NOT NULL DEFAULT 0 AFTER `selected_ac_name`");
        }
        if (!in_array('ac_duration', $cols)) {
            $pdo->exec("ALTER TABLE `bookings` ADD COLUMN `ac_duration` VARCHAR(100) NULL AFTER `ac_quantity`");
        }
        $pdo->exec("ALTER TABLE `bookings` MODIFY COLUMN `district_cirebon` VARCHAR(100) NULL DEFAULT ''");
        $pdo->exec("ALTER TABLE `bookings` MODIFY COLUMN `package_type` VARCHAR(150) NULL DEFAULT ''");
    } catch (Exception $eCol) {
        // Ignored if table not ready
    }

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
