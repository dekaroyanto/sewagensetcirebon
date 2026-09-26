<?php
/**
 * Database Connection Helper (PDO MySQL)
 * Sewa Genset Cirebon (SGC)
 */

require_once __DIR__ . '/config.php';

function getDbConnection() {
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Return null or throw custom error
        return null;
    }
}

function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Origin: ' . (defined('CORS_ALLOWED_ORIGIN') ? CORS_ALLOWED_ORIGIN : '*'));
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getJsonInput() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        return $_POST;
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function verifyAuthToken($headers) {
    $authHeader = '';
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }

    if (!$authHeader || strpos($authHeader, 'Bearer ') !== 0) {
        return false;
    }

    $token = substr($authHeader, 7);
    // Decode basic base64 signature
    $parts = explode('.', $token);
    if (count($parts) !== 2) {
        return false;
    }

    $payload = json_decode(base64_decode($parts[0]), true);
    $signature = $parts[1];

    if (!$payload || !isset($payload['user_id']) || !isset($payload['exp'])) {
        return false;
    }

    if ($payload['exp'] < time()) {
        return false; // Token expired
    }

    $expectedSig = hash_hmac('sha256', $parts[0], JWT_SECRET);
    if (!hash_equals($expectedSig, $signature)) {
        return false;
    }

    return $payload;
}

function generateAuthToken($user) {
    $payload = [
        'user_id' => $user['id'],
        'username' => $user['username'],
        'role' => $user['role'] ?? 'admin',
        'exp' => time() + (86400 * 7) // 7 days expiration
    ];
    $encodedPayload = base64_encode(json_encode($payload));
    $signature = hash_hmac('sha256', $encodedPayload, JWT_SECRET);
    return $encodedPayload . '.' . $signature;
}

/**
 * Safely delete an uploaded image file from the server's uploads folder.
 * Only deletes files inside /uploads/ with allowed image extensions.
 * Never deletes external URLs, .gitkeep, .htaccess, or files used by other database records.
 */
function safelyDeleteUploadedImage(?string $imageUrl, ?PDO $pdo = null): bool {
    if (empty($imageUrl)) {
        return false;
    }

    // Must be a local upload (e.g. /uploads/sgc_... or https://.../uploads/sgc_...)
    if (strpos($imageUrl, '/uploads/') === false) {
        return false;
    }

    $filename = basename(parse_url($imageUrl, PHP_URL_PATH));
    
    // Safety check: protect special files and root
    if (empty($filename) || $filename === '.' || $filename === '..' || $filename === '.gitkeep' || $filename === '.htaccess') {
        return false;
    }

    // Only allow known image extensions
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'])) {
        return false;
    }

    // If PDO is provided, check if any OTHER record in products, blog_posts, or gallery_items is still using this file!
    if ($pdo) {
        try {
            $likePattern = '%' . $filename;
            
            // Check products
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM `products` WHERE `image_url` LIKE ?");
            $stmt->execute([$likePattern]);
            $countProducts = (int)$stmt->fetchColumn();

            // Check blog_posts
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM `blog_posts` WHERE `image` LIKE ?");
            $stmt->execute([$likePattern]);
            $countBlogs = (int)$stmt->fetchColumn();

            // Check gallery_items
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM `gallery_items` WHERE `image` LIKE ?");
            $stmt->execute([$likePattern]);
            $countGallery = (int)$stmt->fetchColumn();

            // If more than 0 records are currently using this file, do NOT delete
            if (($countProducts + $countBlogs + $countGallery) > 0) {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    // Resolve uploads directory
    $possibleDirs = [
        dirname(__DIR__) . '/uploads',
        rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/\\') . '/uploads',
        dirname(dirname(__DIR__)) . '/uploads',
    ];

    $deleted = false;
    foreach ($possibleDirs as $dir) {
        if (!empty($dir) && is_dir($dir)) {
            $targetFile = $dir . '/' . $filename;
            if (is_file($targetFile)) {
                @unlink($targetFile);
                $deleted = true;
            }
        }
    }

    return $deleted;
}

