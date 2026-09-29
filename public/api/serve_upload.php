<?php
/**
 * Self-Healing Image Server for /uploads/
 * Sewa Genset Cirebon (SGC)
 * 
 * If a requested file in /uploads/ is missing (e.g. after git deployment),
 * this endpoint searches persistent storage outside public_html,
 * automatically restores it to /uploads/, and serves it with proper cache headers.
 */

// Allow CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$rawFile = $_GET['file'] ?? '';
$filename = preg_replace('/[^a-zA-Z0-9_.-]/', '', basename($rawFile));

if (empty($filename)) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Nama file tidak valid.']);
    exit;
}

$uploadDir = dirname(__DIR__) . '/uploads';
$persistentDir = dirname(dirname(__DIR__)) . '/persistent_uploads';
$apiBackupDir = __DIR__ . '/.persistent_uploads';

$targetPath = $uploadDir . '/' . $filename;

// If target does not exist, try to restore from persistent storage
if (!file_exists($targetPath)) {
    $sources = [
        $persistentDir . '/' . $filename,
        $apiBackupDir . '/' . $filename,
    ];

    foreach ($sources as $source) {
        if (file_exists($source) && is_file($source)) {
            if (!is_dir($uploadDir)) {
                @mkdir($uploadDir, 0755, true);
            }
            @copy($source, $targetPath);
            break;
        }
    }
}

// Serve file if now exists
if (file_exists($targetPath) && is_file($targetPath)) {
    $ext = strtolower(pathinfo($targetPath, PATHINFO_EXTENSION));
    $mimes = [
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png'  => 'image/png',
        'webp' => 'image/webp',
        'gif'  => 'image/gif',
        'svg'  => 'image/svg+xml'
    ];
    $contentType = $mimes[$ext] ?? 'application/octet-stream';

    header('Content-Type: ' . $contentType);
    header('Content-Length: ' . filesize($targetPath));
    header('Cache-Control: public, max-age=31536000, immutable');
    header('X-SGC-Restored: true');
    readfile($targetPath);
    exit;
}

// Still not found
http_response_code(404);
header('Content-Type: application/json');
echo json_encode([
    'status' => 'error',
    'message' => 'Gambar tidak ditemukan di server.',
    'file' => $filename
]);
