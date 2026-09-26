<?php
/**
 * File & Image Upload API Endpoint
 * Sewa Genset Cirebon (SGC) - Hostinger Backend
 */

require_once __DIR__ . '/db.php';

// Handle CORS & Anti-Caching
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Target upload directory
$uploadDir = dirname(__DIR__) . '/uploads';
if (!is_dir($uploadDir)) {
    if (!@mkdir($uploadDir, 0755, true)) {
        sendJsonResponse([
            'status' => 'error',
            'message' => 'Gagal membuat direktori uploads di server Hostinger. Silakan periksa izin folder (chmod 755).'
        ], 500);
    }
}

// Handle GET: list files in uploads folder
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $files = [];
    if (is_dir($uploadDir)) {
        foreach (scandir($uploadDir) as $f) {
            if ($f !== '.' && $f !== '..' && $f !== '.gitkeep' && $f !== '.htaccess') {
                $filePath = $uploadDir . '/' . $f;
                $files[] = [
                    'name' => $f,
                    'size' => is_file($filePath) ? filesize($filePath) : 0,
                    'url' => '/uploads/' . $f,
                    'modified' => is_file($filePath) ? date('Y-m-d H:i:s', filemtime($filePath)) : ''
                ];
            }
        }
    }
    sendJsonResponse([
        'status' => 'success',
        'upload_dir' => $uploadDir,
        'count' => count($files),
        'files' => $files
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['status' => 'error', 'message' => 'Hanya metode POST atau GET yang diizinkan.'], 405);
}

// 1. Check if a standard file was uploaded via $_FILES['image'] or $_FILES['file']
$file = null;
if (isset($_FILES['image']) && is_uploaded_file($_FILES['image']['tmp_name'])) {
    $file = $_FILES['image'];
} elseif (isset($_FILES['file']) && is_uploaded_file($_FILES['file']['tmp_name'])) {
    $file = $_FILES['file'];
}

// 2. Or check if base64 image data was sent via JSON body
$rawInput = getJsonInput();
$base64Image = $rawInput['image_base64'] ?? $rawInput['file_base64'] ?? null;

if (!$file && !$base64Image) {
    sendJsonResponse([
        'status' => 'error',
        'message' => 'Tidak ada file gambar yang dikirimkan. Gunakan form-data dengan nama field "image" atau sertakan data base64.'
    ], 400);
}

$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
$allowedMimeTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/x-png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
];
$maxFileSize = 10 * 1024 * 1024; // 10 Megabytes

$savedFilename = '';
$fileSize = 0;

if ($file) {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE   => 'Ukuran file melebihi upload_max_filesize di php.ini hosting.',
            UPLOAD_ERR_FORM_SIZE  => 'Ukuran file melebihi MAX_FILE_SIZE formulir.',
            UPLOAD_ERR_PARTIAL    => 'File hanya terunggah sebagian. Silakan coba lagi.',
            UPLOAD_ERR_NO_FILE    => 'Tidak ada file yang dipilih.',
            UPLOAD_ERR_NO_TMP_DIR => 'Folder sementara (tmp) di server tidak ditemukan.',
            UPLOAD_ERR_CANT_WRITE => 'Gagal menulis file ke disk server.',
            UPLOAD_ERR_EXTENSION  => 'Ekstensi file dihentikan oleh konfigurasi PHP server.'
        ];
        $msg = $errorMessages[$file['error']] ?? ('Error upload kode: ' . $file['error']);
        sendJsonResponse(['status' => 'error', 'message' => $msg], 400);
    }

    $fileSize = $file['size'];
    if ($fileSize > $maxFileSize) {
        sendJsonResponse([
            'status' => 'error',
            'message' => 'Ukuran file terlalu besar. Maksimum ukuran gambar adalah 10 MB.'
        ], 400);
    }

    $originalName = pathinfo($file['name'], PATHINFO_FILENAME);
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, $allowedExtensions)) {
        sendJsonResponse([
            'status' => 'error',
            'message' => 'Format file .' . htmlspecialchars($ext) . ' tidak diizinkan. Gunakan format JPG, PNG, WEBP, GIF, atau SVG.'
        ], 400);
    }

    // Verify MIME type using finfo if available
    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        // Special case for SVG
        if ($ext !== 'svg' && !in_array($mime, $allowedMimeTypes)) {
            sendJsonResponse([
                'status' => 'error',
                'message' => 'File bukan gambar yang valid (MIME: ' . htmlspecialchars($mime) . ').'
            ], 400);
        }
    }

    // Generate unique, clean filename: sgc_slug_YYYYMMDD_HHMMSS_random.ext
    $slug = preg_replace('/[^a-zA-Z0-9_-]/', '', substr($originalName, 0, 20));
    $slug = $slug ?: 'img';
    $savedFilename = 'sgc_' . $slug . '_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)) . '.' . $ext;
    $targetPath = $uploadDir . '/' . $savedFilename;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        sendJsonResponse([
            'status' => 'error',
            'message' => 'Gagal memindahkan file ke folder uploads. Periksa izin direktori di Hostinger.'
        ], 500);
    }
} elseif ($base64Image) {
    // Process base64 data URI (e.g. data:image/png;base64,...)
    if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $typeMatch)) {
        $ext = strtolower($typeMatch[1]);
        if ($ext === 'jpeg') $ext = 'jpg';
        if (!in_array($ext, $allowedExtensions)) {
            $ext = 'jpg';
        }
        $data = substr($base64Image, strpos($base64Image, ',') + 1);
        $decoded = base64_decode($data);
        if ($decoded === false) {
            sendJsonResponse(['status' => 'error', 'message' => 'Data base64 gambar tidak valid.'], 400);
        }

        $fileSize = strlen($decoded);
        if ($fileSize > $maxFileSize) {
            sendJsonResponse(['status' => 'error', 'message' => 'Ukuran gambar base64 melebihi 10 MB.'], 400);
        }

        $savedFilename = 'sgc_upload_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)) . '.' . $ext;
        $targetPath = $uploadDir . '/' . $savedFilename;
        if (@file_put_contents($targetPath, $decoded) === false) {
            sendJsonResponse(['status' => 'error', 'message' => 'Gagal menyimpan file base64 ke disk server.'], 500);
        }
    } else {
        sendJsonResponse(['status' => 'error', 'message' => 'Format base64 gambar tidak sesuai.'], 400);
    }
}

// Build public URL
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443) ? "https" : "http";
$host = $_SERVER['HTTP_HOST'] ?? 'sewagensetcirebon.com';
$relativeUrl = '/uploads/' . $savedFilename;
$fullUrl = $protocol . '://' . $host . $relativeUrl;

sendJsonResponse([
    'status' => 'success',
    'message' => 'Gambar berhasil diunggah ke server!',
    'url' => $relativeUrl,
    'full_url' => $fullUrl,
    'filename' => $savedFilename,
    'size' => $fileSize
]);
