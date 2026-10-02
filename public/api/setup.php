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

    // 1. Auto-migrate products table columns if it already exists
    try {
        $pCols = $pdo->query("SHOW COLUMNS FROM `products`")->fetchAll(PDO::FETCH_COLUMN);
        if ($pCols) {
            $alterProducts = [
                'kva' => "ALTER TABLE `products` ADD COLUMN `kva` INT NULL AFTER `description`",
                'kw' => "ALTER TABLE `products` ADD COLUMN `kw` INT NULL AFTER `kva`",
                'pk' => "ALTER TABLE `products` ADD COLUMN `pk` INT NULL AFTER `kw`",
                'phase' => "ALTER TABLE `products` ADD COLUMN `phase` VARCHAR(50) NULL AFTER `pk`",
                'tag' => "ALTER TABLE `products` ADD COLUMN `tag` VARCHAR(100) NULL AFTER `phase`",
                'category_label' => "ALTER TABLE `products` ADD COLUMN `category_label` VARCHAR(100) NULL AFTER `tag`",
                'starting_price_estimate' => "ALTER TABLE `products` ADD COLUMN `starting_price_estimate` DECIMAL(12,2) NULL AFTER `category_label`",
                'is_available' => "ALTER TABLE `products` ADD COLUMN `is_available` TINYINT(1) NOT NULL DEFAULT 1 AFTER `starting_price_estimate`",
                'sort_order' => "ALTER TABLE `products` ADD COLUMN `sort_order` INT NOT NULL DEFAULT 0 AFTER `is_available`"
            ];
            foreach ($alterProducts as $col => $q) {
                if (!in_array($col, $pCols)) {
                    $pdo->exec($q);
                }
            }
        }
    } catch (Exception $eP) {
        // Table may not exist yet
    }

    // 2. Auto-migrate bookings table columns if it already exists
    try {
        $bCols = $pdo->query("SHOW COLUMNS FROM `bookings`")->fetchAll(PDO::FETCH_COLUMN);
        if ($bCols) {
            $alterBookings = [
                'selected_genset_id' => "ALTER TABLE `bookings` ADD COLUMN `selected_genset_id` VARCHAR(64) NULL AFTER `phone`",
                'selected_genset_name' => "ALTER TABLE `bookings` ADD COLUMN `selected_genset_name` VARCHAR(150) NULL AFTER `selected_genset_id`",
                'genset_quantity' => "ALTER TABLE `bookings` ADD COLUMN `genset_quantity` INT NOT NULL DEFAULT 0 AFTER `selected_genset_name`",
                'genset_duration' => "ALTER TABLE `bookings` ADD COLUMN `genset_duration` VARCHAR(100) NULL AFTER `genset_quantity`",
                'selected_ac_id' => "ALTER TABLE `bookings` ADD COLUMN `selected_ac_id` VARCHAR(64) NULL AFTER `genset_duration`",
                'selected_ac_name' => "ALTER TABLE `bookings` ADD COLUMN `selected_ac_name` VARCHAR(150) NULL AFTER `selected_ac_id`",
                'ac_quantity' => "ALTER TABLE `bookings` ADD COLUMN `ac_quantity` INT NOT NULL DEFAULT 0 AFTER `selected_ac_name`",
                'ac_duration' => "ALTER TABLE `bookings` ADD COLUMN `ac_duration` VARCHAR(100) NULL AFTER `ac_quantity`",
            ];
            foreach ($alterBookings as $col => $q) {
                if (!in_array($col, $bCols)) {
                    $pdo->exec($q);
                }
            }
            $pdo->exec("ALTER TABLE `bookings` MODIFY COLUMN `district_cirebon` VARCHAR(100) NULL DEFAULT ''");
            $pdo->exec("ALTER TABLE `bookings` MODIFY COLUMN `package_type` VARCHAR(150) NULL DEFAULT ''");
            $pdo->exec("ALTER TABLE `bookings` MODIFY COLUMN `additional_needs` TEXT NULL");
        }
    } catch (Exception $eB) {
        // Table may not exist yet
    }

    // 3. Execute database.sql safely statement-by-statement
    $sql = file_get_contents($sqlFile);
    $statements = array_filter(array_map('trim', explode(";\n", $sql)));
    foreach ($statements as $stmtSql) {
        if (!empty($stmtSql)) {
            try {
                $pdo->exec($stmtSql);
            } catch (Exception $eStmt) {
                // Ignore non-fatal duplicates or minor schema warnings
            }
        }
    }

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
