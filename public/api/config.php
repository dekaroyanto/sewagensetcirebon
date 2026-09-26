<?php
/**
 * Konfigurasi Database MySQL Hostinger untuk Sewa Genset Cirebon (SGC)
 * 
 * PANDUAN MENGISI CONFIG DI HOSTINGER:
 * 1. Buka hPanel Hostinger Anda (https://hpanel.hostinger.com)
 * 2. Masuk ke menu "Databases" -> "MySQL Databases"
 * 3. Buat database baru (misal: u123456789_sgc_db) dan buat user baru (misal: u123456789_sgc_user)
 * 4. Salin Database Name, Username, dan Password ke variabel di bawah ini.
 * 5. DB_HOST di Hostinger biasanya tetap "localhost".
 */

// Aktifkan error reporting saat debugging jika perlu, matikan saat live
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');

// Deteksi file .env di root atau di folder yang sama jika ada
$envFile = __DIR__ . '/.env';
if (!file_exists($envFile)) {
    $envFile = dirname(__DIR__, 2) . '/.env';
}
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value, " \t\n\r\0\x0B\"'");
            if (!getenv($name)) {
                putenv("$name=$value");
                $_ENV[$name] = $value;
            }
        }
    }
}

// Dukungan file konfigurasi lokal jika ada
if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}

// ==============================================================================
// PENGATURAN KONEKSI DATABASE MYSQL HOSTINGER
// Silakan sesuaikan 4 baris di bawah ini dengan database phpMyAdmin Hostinger Anda:
// ==============================================================================
if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME') ?: 'u126089851_dbsgcindonesia');
if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER') ?: 'u126089851_sgcindonesia');
if (!defined('DB_PASS')) define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : 'DKGanteng2002@');
if (!defined('DB_PORT')) define('DB_PORT', getenv('DB_PORT') ?: '3306');


// Kunci Rahasia untuk Token Autentikasi Admin
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'sgc_cirebon_secure_jwt_token_2026_xyz');

// URL Frontend yang diizinkan untuk CORS (gunakan * untuk kemudahan)
define('CORS_ALLOWED_ORIGIN', '*');
