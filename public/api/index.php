<?php
/**
 * REST API Router & Controller
 * Sewa Genset Cirebon (SGC) - Hostinger MySQL Backend
 */

require_once __DIR__ . '/db.php';

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Parse Request URI
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = dirname($_SERVER['SCRIPT_NAME']);
if ($basePath !== '/' && strpos($requestUri, $basePath) === 0) {
    $requestUri = substr($requestUri, strlen($basePath));
}

// Remove query strings
$parts = explode('?', $requestUri, 2);
$path = trim($parts[0], '/');

// Support fallback if path contains "index.php" or "api"
if (strpos($path, 'api/') === 0) {
    $path = substr($path, 4);
}
if (strpos($path, 'index.php/') === 0) {
    $path = substr($path, 10);
} elseif ($path === 'index.php') {
    $path = isset($_GET['endpoint']) ? trim($_GET['endpoint'], '/') : '';
}

$method = $_SERVER['REQUEST_METHOD'];
$segments = !empty($path) ? explode('/', $path) : [];
$resource = isset($segments[0]) ? $segments[0] : '';
$id = isset($segments[1]) ? $segments[1] : null;

$pdo = getDbConnection();

// -----------------------------------------------------------------------------
// 1. HEALTH / TEST DB ENDPOINT
// -----------------------------------------------------------------------------
if ($resource === 'health' || $resource === 'test-db') {
    if (!$pdo) {
        sendJsonResponse([
            'status' => 'error',
            'connected' => false,
            'message' => 'Gagal terhubung ke MySQL Hostinger. Silakan periksa kredensial di public/api/config.php.',
            'config' => [
                'host' => DB_HOST,
                'database' => DB_NAME,
                'user' => DB_USER,
                'port' => DB_PORT
            ]
        ], 500);
    }

    try {
        $stmt = $pdo->query("SELECT COUNT(*) AS total_tables FROM information_schema.tables WHERE table_schema = DATABASE()");
        $res = $stmt->fetch();
        sendJsonResponse([
            'status' => 'success',
            'connected' => true,
            'message' => 'Koneksi ke Database MySQL Hostinger Berhasil!',
            'database' => DB_NAME,
            'tables_count' => (int)($res['total_tables'] ?? 0),
            'server_time' => date('Y-m-d H:i:s')
        ]);
    } catch (Exception $e) {
        sendJsonResponse([
            'status' => 'error',
            'connected' => false,
            'message' => 'Koneksi tersambung tetapi terjadi error query: ' . $e->getMessage()
        ], 500);
    }
}

// -----------------------------------------------------------------------------
// 2. SETUP ENDPOINT
// -----------------------------------------------------------------------------
if ($resource === 'setup') {
    require __DIR__ . '/setup.php';
    exit;
}

// -----------------------------------------------------------------------------
// CHECK DB CONNECTION FOR OTHER ROUTES
// -----------------------------------------------------------------------------
if (!$pdo) {
    sendJsonResponse([
        'status' => 'error',
        'connected' => false,
        'message' => 'Database MySQL Hostinger belum terhubung. Konfigurasi kredensial di public/api/config.php atau periksa status database Anda di phpMyAdmin.',
        'config_hint' => 'DB_NAME: ' . DB_NAME . ' | DB_USER: ' . DB_USER
    ], 503);
}

// -----------------------------------------------------------------------------
// 3. AUTH ENDPOINTS (/auth/login, /auth/me)
// -----------------------------------------------------------------------------
if ($resource === 'auth') {
    $action = $id; // e.g. 'login', 'me'

    if ($action === 'login' && $method === 'POST') {
        $input = getJsonInput();
        $username = trim($input['username'] ?? '');
        $password = trim($input['password'] ?? '');

        if (empty($username) || empty($password)) {
            sendJsonResponse(['status' => 'error', 'message' => 'Username dan password wajib diisi.'], 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM `admin_users` WHERE `username` = ? OR `email` = ? LIMIT 1");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $token = generateAuthToken($user);
            unset($user['password_hash']);
            sendJsonResponse([
                'status' => 'success',
                'message' => 'Login berhasil. Selamat datang di Portal Admin SGC.',
                'token' => $token,
                'user' => $user
            ]);
        } else {
            sendJsonResponse(['status' => 'error', 'message' => 'Username atau password tidak sesuai.'], 401);
        }
    }

    if ($action === 'me' && $method === 'GET') {
        $headers = getallheaders();
        $auth = verifyAuthToken($headers);
        if (!$auth) {
            sendJsonResponse(['status' => 'error', 'message' => 'Sesi tidak valid atau telah berakhir.'], 401);
        }
        $stmt = $pdo->prepare("SELECT id, username, email, full_name, role FROM `admin_users` WHERE id = ?");
        $stmt->execute([$auth['user_id']]);
        $user = $stmt->fetch();
        sendJsonResponse(['status' => 'success', 'user' => $user]);
    }
}

// -----------------------------------------------------------------------------
// 4. DASHBOARD STATS (/stats)
// -----------------------------------------------------------------------------
if ($resource === 'stats' && $method === 'GET') {
    try {
        $totalGenset = $pdo->query("SELECT COUNT(*) FROM `products` WHERE product_type = 'genset'")->fetchColumn();
        $totalAc = $pdo->query("SELECT COUNT(*) FROM `products` WHERE product_type = 'ac'")->fetchColumn();
        $totalProducts = $pdo->query("SELECT COUNT(*) FROM `products`")->fetchColumn();
        $totalBookings = $pdo->query("SELECT COUNT(*) FROM `bookings`")->fetchColumn();
        $pendingBookings = $pdo->query("SELECT COUNT(*) FROM `bookings` WHERE status = 'Menunggu Konfirmasi'")->fetchColumn();
        $totalBlogs = $pdo->query("SELECT COUNT(*) FROM `blog_posts`")->fetchColumn();
        $totalTestimonials = $pdo->query("SELECT COUNT(*) FROM `testimonials`")->fetchColumn();
        $totalGallery = $pdo->query("SELECT COUNT(*) FROM `gallery_items`")->fetchColumn();

        sendJsonResponse([
            'status' => 'success',
            'data' => [
                'total_genset' => (int)$totalGenset,
                'total_ac' => (int)$totalAc,
                'total_products' => (int)$totalProducts,
                'total_bookings' => (int)$totalBookings,
                'pending_bookings' => (int)$pendingBookings,
                'total_blogs' => (int)$totalBlogs,
                'total_testimonials' => (int)$totalTestimonials,
                'total_gallery' => (int)$totalGallery,
            ]
        ]);
    } catch (Exception $e) {
        sendJsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}

// -----------------------------------------------------------------------------
// 5. PRODUCTS CRUD (/products)
// -----------------------------------------------------------------------------
if ($resource === 'products') {
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM `products` WHERE id = ?");
            $stmt->execute([$id]);
            $product = $stmt->fetch();
            if ($product) {
                $product['price'] = (float)$product['price'];
                $product['kva'] = $product['kva'] ? (int)$product['kva'] : null;
                $product['kw'] = $product['kw'] ? (int)$product['kw'] : null;
                $product['is_available'] = (bool)$product['is_available'];
                sendJsonResponse(['status' => 'success', 'data' => $product]);
            }
            sendJsonResponse(['status' => 'error', 'message' => 'Produk tidak ditemukan.'], 404);
        } else {
            $type = isset($_GET['product_type']) ? $_GET['product_type'] : null;
            $search = isset($_GET['search']) ? '%' . $_GET['search'] . '%' : null;

            $sql = "SELECT * FROM `products` WHERE 1=1";
            $params = [];
            if ($type && $type !== 'all') {
                $sql .= " AND product_type = ?";
                $params[] = $type;
            }
            if ($search) {
                $sql .= " AND (name LIKE ? OR description LIKE ?)";
                $params[] = $search;
                $params[] = $search;
            }
            $sql .= " ORDER BY sort_order ASC, created_at DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();
            foreach ($rows as &$r) {
                $r['price'] = (float)$r['price'];
                $r['kva'] = $r['kva'] ? (int)$r['kva'] : null;
                $r['kw'] = $r['kw'] ? (int)$r['kw'] : null;
                $r['is_available'] = (bool)$r['is_available'];
            }
            sendJsonResponse(['status' => 'success', 'count' => count($rows), 'data' => $rows]);
        }
    }

    if ($method === 'POST') {
        $data = getJsonInput();
        $prodId = !empty($data['id']) ? $data['id'] : 'sgc-' . time() . '-' . rand(100, 999);
        $name = $data['name'] ?? 'Unit Baru';
        $type = $data['product_type'] ?? 'genset';
        $price = (float)($data['price'] ?? 0);
        $imageUrl = $data['image_url'] ?? ($data['image'] ?? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800');
        $desc = $data['description'] ?? '';
        $kva = !empty($data['kva']) ? (int)$data['kva'] : null;
        $kw = !empty($data['kw']) ? (int)$data['kw'] : null;
        $isAvail = isset($data['is_available']) ? (int)$data['is_available'] : 1;
        $sortOrder = isset($data['sort_order']) ? (int)$data['sort_order'] : 0;

        $stmt = $pdo->prepare("INSERT INTO `products` (`id`, `name`, `product_type`, `price`, `image_url`, `description`, `kva`, `kw`, `is_available`, `sort_order`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$prodId, $name, $type, $price, $imageUrl, $desc, $kva, $kw, $isAvail, $sortOrder]);

        sendJsonResponse(['status' => 'success', 'message' => 'Produk berhasil ditambahkan!', 'id' => $prodId], 201);
    }

    if ($method === 'PUT' && $id) {
        $data = getJsonInput();
        $fields = [];
        $params = [];

        $allowed = ['name', 'product_type', 'price', 'image_url', 'description', 'kva', 'kw', 'is_available', 'sort_order'];
        foreach ($allowed as $f) {
            if (isset($data[$f])) {
                $fields[] = "`$f` = ?";
                $params[] = $data[$f];
            }
        }
        if (isset($data['image']) && !isset($data['image_url'])) {
            $fields[] = "`image_url` = ?";
            $params[] = $data['image'];
        }

        if (empty($fields)) {
            sendJsonResponse(['status' => 'error', 'message' => 'Tidak ada data yang diperbarui.'], 400);
        }

        $params[] = $id;
        $sql = "UPDATE `products` SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        sendJsonResponse(['status' => 'success', 'message' => 'Data produk berhasil diperbarui.']);
    }

    if ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM `products` WHERE id = ?");
        $stmt->execute([$id]);
        sendJsonResponse(['status' => 'success', 'message' => 'Produk berhasil dihapus.']);
    }
}

// -----------------------------------------------------------------------------
// 6. BOOKINGS CRUD (/bookings)
// -----------------------------------------------------------------------------
if ($resource === 'bookings') {
    if ($method === 'GET') {
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        $sql = "SELECT * FROM `bookings`";
        $params = [];
        if ($status && $status !== 'all') {
            $sql .= " WHERE status = ?";
            $params[] = $status;
        }
        $sql .= " ORDER BY created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $bookings = $stmt->fetchAll();

        foreach ($bookings as &$b) {
            if (!empty($b['additional_needs'])) {
                $decoded = json_decode($b['additional_needs'], true);
                $b['additional_needs'] = is_array($decoded) ? $decoded : explode(',', $b['additional_needs']);
            } else {
                $b['additional_needs'] = [];
            }
        }

        sendJsonResponse(['status' => 'success', 'count' => count($bookings), 'data' => $bookings]);
    }

    if ($method === 'POST') {
        $data = getJsonInput();
        $code = 'SGC-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));
        $fullName = $data['fullName'] ?? ($data['full_name'] ?? '');
        $company = $data['companyOrEvent'] ?? ($data['company_or_event'] ?? '');
        $phone = $data['phone'] ?? '';
        $gensetId = $data['selectedGensetId'] ?? ($data['selected_genset_id'] ?? '');
        $gensetName = $data['selectedGensetName'] ?? ($data['selected_genset_name'] ?? '');
        $unitQty = (int)($data['unitQuantity'] ?? ($data['unit_quantity'] ?? 1));
        $acQty = (int)($data['acQuantity'] ?? ($data['ac_quantity'] ?? 0));
        $rentalType = $data['rentalType'] ?? ($data['rental_type'] ?? 'Harian / Acara');
        $startDate = $data['startDate'] ?? ($data['start_date'] ?? date('Y-m-d'));
        $startTime = $data['startTime'] ?? ($data['start_time'] ?? '08:00 WIB');
        $duration = $data['duration'] ?? '1 Hari';
        $location = $data['eventLocation'] ?? ($data['event_location'] ?? '');
        $district = $data['districtCirebon'] ?? ($data['district_cirebon'] ?? 'Kota Cirebon');
        $pkgType = $data['packageType'] ?? ($data['package_type'] ?? 'Include BBM Solar & Operator');
        $needs = isset($data['additionalNeeds']) ? json_encode($data['additionalNeeds'], JSON_UNESCAPED_UNICODE) : (isset($data['additional_needs']) ? json_encode($data['additional_needs']) : '[]');
        $notes = $data['notes'] ?? '';

        $stmt = $pdo->prepare("INSERT INTO `bookings` (`booking_code`, `full_name`, `company_or_event`, `phone`, `selected_genset_id`, `selected_genset_name`, `unit_quantity`, `ac_quantity`, `rental_type`, `start_date`, `start_time`, `duration`, `event_location`, `district_cirebon`, `package_type`, `additional_needs`, `notes`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu Konfirmasi')");
        $stmt->execute([$code, $fullName, $company, $phone, $gensetId, $gensetName, $unitQty, $acQty, $rentalType, $startDate, $startTime, $duration, $location, $district, $pkgType, $needs, $notes]);

        sendJsonResponse([
            'status' => 'success',
            'message' => 'Permintaan sewa berhasil disimpan ke database!',
            'data' => [
                'booking_code' => $code,
                'id' => $pdo->lastInsertId()
            ]
        ], 201);
    }

    if ($method === 'PUT' && $id) {
        $data = getJsonInput();
        $status = $data['status'] ?? null;
        if (!$status) {
            sendJsonResponse(['status' => 'error', 'message' => 'Status diperlukan.'], 400);
        }
        $stmt = $pdo->prepare("UPDATE `bookings` SET `status` = ? WHERE `id` = ? OR `booking_code` = ?");
        $stmt->execute([$status, $id, $id]);
        sendJsonResponse(['status' => 'success', 'message' => 'Status booking berhasil diperbarui.']);
    }

    if ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM `bookings` WHERE `id` = ? OR `booking_code` = ?");
        $stmt->execute([$id, $id]);
        sendJsonResponse(['status' => 'success', 'message' => 'Data booking berhasil dihapus.']);
    }
}

// -----------------------------------------------------------------------------
// 7. BLOGS CRUD (/blogs)
// -----------------------------------------------------------------------------
if ($resource === 'blogs') {
    if ($method === 'GET') {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM `blog_posts` WHERE id = ? OR slug = ?");
            $stmt->execute([$id, $id]);
            $post = $stmt->fetch();
            if ($post) {
                $post['tags'] = json_decode($post['tags'], true) ?: [];
                $post['content'] = json_decode($post['content'], true) ?: [];
                sendJsonResponse(['status' => 'success', 'data' => $post]);
            }
            sendJsonResponse(['status' => 'error', 'message' => 'Artikel tidak ditemukan.'], 404);
        } else {
            $category = isset($_GET['category']) ? $_GET['category'] : null;
            $sql = "SELECT * FROM `blog_posts`";
            $params = [];
            if ($category && $category !== 'Semua') {
                $sql .= " WHERE category = ?";
                $params[] = $category;
            }
            $sql .= " ORDER BY created_at DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $posts = $stmt->fetchAll();
            foreach ($posts as &$p) {
                $p['tags'] = json_decode($p['tags'], true) ?: [];
                $p['content'] = json_decode($p['content'], true) ?: [];
            }
            sendJsonResponse(['status' => 'success', 'count' => count($posts), 'data' => $posts]);
        }
    }

    if ($method === 'POST') {
        $data = getJsonInput();
        $blogId = !empty($data['id']) ? $data['id'] : 'post-' . time();
        $title = $data['title'] ?? 'Artikel Baru';
        $slug = !empty($data['slug']) ? $data['slug'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        $summary = $data['summary'] ?? '';
        $category = $data['category'] ?? 'Tips & Panduan';
        $date = $data['date'] ?? date('d F Y');
        $readTime = $data['readTime'] ?? '3 Menit Baca';
        $author = $data['author'] ?? 'Tim Teknis SGC';
        $image = $data['image'] ?? 'https://images.unsplash.com/photo-1636867759143-c28c1e909bd3?w=800';
        $tags = is_array($data['tags'] ?? null) ? json_encode($data['tags'], JSON_UNESCAPED_UNICODE) : '[]';
        $content = is_array($data['content'] ?? null) ? json_encode($data['content'], JSON_UNESCAPED_UNICODE) : '[]';

        $stmt = $pdo->prepare("INSERT INTO `blog_posts` (`id`, `slug`, `title`, `summary`, `category`, `date`, `read_time`, `author`, `image`, `tags`, `content`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$blogId, $slug, $title, $summary, $category, $date, $readTime, $author, $image, $tags, $content]);

        sendJsonResponse(['status' => 'success', 'message' => 'Artikel berhasil diterbitkan!', 'id' => $blogId], 201);
    }

    if ($method === 'PUT' && $id) {
        $data = getJsonInput();
        $fields = [];
        $params = [];
        foreach (['slug', 'title', 'summary', 'category', 'date', 'read_time', 'author', 'image'] as $col) {
            if (isset($data[$col])) {
                $fields[] = "`$col` = ?";
                $params[] = $data[$col];
            }
        }
        if (isset($data['tags'])) {
            $fields[] = "`tags` = ?";
            $params[] = is_array($data['tags']) ? json_encode($data['tags'], JSON_UNESCAPED_UNICODE) : $data['tags'];
        }
        if (isset($data['content'])) {
            $fields[] = "`content` = ?";
            $params[] = is_array($data['content']) ? json_encode($data['content'], JSON_UNESCAPED_UNICODE) : $data['content'];
        }

        if (empty($fields)) {
            sendJsonResponse(['status' => 'error', 'message' => 'Tidak ada field yang diubah.'], 400);
        }

        $params[] = $id;
        $params[] = $id;
        $sql = "UPDATE `blog_posts` SET " . implode(', ', $fields) . " WHERE id = ? OR slug = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        sendJsonResponse(['status' => 'success', 'message' => 'Artikel berhasil diperbarui.']);
    }

    if ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM `blog_posts` WHERE id = ? OR slug = ?");
        $stmt->execute([$id, $id]);
        sendJsonResponse(['status' => 'success', 'message' => 'Artikel berhasil dihapus.']);
    }
}

// -----------------------------------------------------------------------------
// 8. GALLERY CRUD (/gallery)
// -----------------------------------------------------------------------------
if ($resource === 'gallery') {
    if ($method === 'GET') {
        $cat = isset($_GET['category']) ? $_GET['category'] : null;
        $sql = "SELECT * FROM `gallery_items`";
        $params = [];
        if ($cat && $cat !== 'Semua') {
            $sql .= " WHERE category = ?";
            $params[] = $cat;
        }
        $sql .= " ORDER BY created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $items = $stmt->fetchAll();
        sendJsonResponse(['status' => 'success', 'count' => count($items), 'data' => $items]);
    }

    if ($method === 'POST') {
        $data = getJsonInput();
        $galId = !empty($data['id']) ? $data['id'] : 'gal-' . time();
        $title = $data['title'] ?? 'Dokumentasi Acara';
        $category = $data['category'] ?? 'Wedding & Resepsi';
        $location = $data['location'] ?? 'Kota Cirebon';
        $gensetUsed = $data['gensetUsed'] ?? ($data['genset_used'] ?? 'Genset Silent SGC');
        $image = $data['image'] ?? 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=800';
        $client = $data['client'] ?? '';
        $duration = $data['duration'] ?? '';
        $peakLoad = $data['peakLoad'] ?? ($data['peak_load'] ?? '');
        $description = $data['description'] ?? '';

        $stmt = $pdo->prepare("INSERT INTO `gallery_items` (`id`, `title`, `category`, `location`, `genset_used`, `image`, `client`, `duration`, `peak_load`, `description`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$galId, $title, $category, $location, $gensetUsed, $image, $client, $duration, $peakLoad, $description]);

        sendJsonResponse(['status' => 'success', 'message' => 'Portofolio baru berhasil disimpan!', 'id' => $galId], 201);
    }

    if ($method === 'PUT' && $id) {
        $data = getJsonInput();
        $fields = [];
        $params = [];
        foreach (['title', 'category', 'location', 'image', 'client', 'duration', 'description'] as $k) {
            if (isset($data[$k])) {
                $fields[] = "`$k` = ?";
                $params[] = $data[$k];
            }
        }
        if (isset($data['gensetUsed'])) {
            $fields[] = "`genset_used` = ?";
            $params[] = $data['gensetUsed'];
        }
        if (isset($data['genset_used'])) {
            $fields[] = "`genset_used` = ?";
            $params[] = $data['genset_used'];
        }

        if (!empty($fields)) {
            $params[] = $id;
            $stmt = $pdo->prepare("UPDATE `gallery_items` SET " . implode(', ', $fields) . " WHERE id = ?");
            $stmt->execute($params);
        }
        sendJsonResponse(['status' => 'success', 'message' => 'Portofolio berhasil diperbarui.']);
    }

    if ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM `gallery_items` WHERE id = ?");
        $stmt->execute([$id]);
        sendJsonResponse(['status' => 'success', 'message' => 'Portofolio berhasil dihapus.']);
    }
}

// -----------------------------------------------------------------------------
// 9. TESTIMONIALS CRUD (/testimonials)
// -----------------------------------------------------------------------------
if ($resource === 'testimonials') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM `testimonials` ORDER BY created_at DESC");
        $testis = $stmt->fetchAll();
        foreach ($testis as &$t) {
            $t['rating'] = (int)$t['rating'];
            $t['verified'] = (bool)$t['verified'];
            $t['gensetUsed'] = $t['genset_used'];
            $t['companyOrEvent'] = $t['company_or_event'];
        }
        sendJsonResponse(['status' => 'success', 'count' => count($testis), 'data' => $testis]);
    }

    if ($method === 'POST') {
        $data = getJsonInput();
        $testiId = !empty($data['id']) ? $data['id'] : 'testi-' . time();
        $name = $data['name'] ?? 'Pelanggan Cirebon';
        $role = $data['role'] ?? 'Penyewa';
        $company = $data['companyOrEvent'] ?? ($data['company_or_event'] ?? 'Acara Keluarga');
        $loc = $data['location'] ?? 'Kota Cirebon';
        $rating = (int)($data['rating'] ?? 5);
        $date = $data['date'] ?? date('d F Y');
        $comment = $data['comment'] ?? '';
        $genset = $data['gensetUsed'] ?? ($data['genset_used'] ?? 'Genset Silent SGC');
        $avatarBg = $data['avatarBg'] ?? 'from-amber-500 to-amber-700';
        $verified = isset($data['verified']) ? (int)$data['verified'] : 1;

        $stmt = $pdo->prepare("INSERT INTO `testimonials` (`id`, `name`, `role`, `company_or_event`, `location`, `rating`, `date`, `comment`, `genset_used`, `avatar_bg`, `verified`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$testiId, $name, $role, $company, $loc, $rating, $date, $comment, $genset, $avatarBg, $verified]);

        sendJsonResponse(['status' => 'success', 'message' => 'Testimoni berhasil disimpan!', 'id' => $testiId], 201);
    }

    if ($method === 'PUT' && $id) {
        $data = getJsonInput();
        $fields = [];
        $params = [];
        foreach (['name', 'role', 'location', 'rating', 'comment', 'verified'] as $f) {
            if (isset($data[$f])) {
                $fields[] = "`$f` = ?";
                $params[] = $data[$f];
            }
        }
        if (isset($data['companyOrEvent'])) {
            $fields[] = "`company_or_event` = ?";
            $params[] = $data['companyOrEvent'];
        }
        if (isset($data['gensetUsed'])) {
            $fields[] = "`genset_used` = ?";
            $params[] = $data['gensetUsed'];
        }

        if (!empty($fields)) {
            $params[] = $id;
            $stmt = $pdo->prepare("UPDATE `testimonials` SET " . implode(', ', $fields) . " WHERE id = ?");
            $stmt->execute($params);
        }
        sendJsonResponse(['status' => 'success', 'message' => 'Testimoni berhasil diperbarui.']);
    }

    if ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM `testimonials` WHERE id = ?");
        $stmt->execute([$id]);
        sendJsonResponse(['status' => 'success', 'message' => 'Testimoni berhasil dihapus.']);
    }
}

// -----------------------------------------------------------------------------
// 10. FAQS CRUD (/faqs)
// -----------------------------------------------------------------------------
if ($resource === 'faqs') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM `faqs` ORDER BY sort_order ASC, id ASC");
        $faqs = $stmt->fetchAll();
        sendJsonResponse(['status' => 'success', 'count' => count($faqs), 'data' => $faqs]);
    }

    if ($method === 'POST') {
        $data = getJsonInput();
        $faqId = !empty($data['id']) ? $data['id'] : 'faq-' . time();
        $cat = $data['category'] ?? 'Pemesanan & Syarat';
        $q = $data['question'] ?? '';
        $a = $data['answer'] ?? '';
        $sort = (int)($data['sort_order'] ?? 0);

        $stmt = $pdo->prepare("INSERT INTO `faqs` (`id`, `category`, `question`, `answer`, `sort_order`) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$faqId, $cat, $q, $a, $sort]);

        sendJsonResponse(['status' => 'success', 'message' => 'FAQ berhasil ditambahkan!', 'id' => $faqId], 201);
    }

    if ($method === 'PUT' && $id) {
        $data = getJsonInput();
        $fields = [];
        $params = [];
        foreach (['category', 'question', 'answer', 'sort_order'] as $f) {
            if (isset($data[$f])) {
                $fields[] = "`$f` = ?";
                $params[] = $data[$f];
            }
        }
        if (!empty($fields)) {
            $params[] = $id;
            $stmt = $pdo->prepare("UPDATE `faqs` SET " . implode(', ', $fields) . " WHERE id = ?");
            $stmt->execute($params);
        }
        sendJsonResponse(['status' => 'success', 'message' => 'FAQ berhasil diperbarui.']);
    }

    if ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare("DELETE FROM `faqs` WHERE id = ?");
        $stmt->execute([$id]);
        sendJsonResponse(['status' => 'success', 'message' => 'FAQ berhasil dihapus.']);
    }
}

// -----------------------------------------------------------------------------
// 11. COMPANY SETTINGS (/company)
// -----------------------------------------------------------------------------
if ($resource === 'company') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM `company_settings` WHERE id = 1 LIMIT 1");
        $comp = $stmt->fetch();
        if ($comp) {
            $formatted = [
                'name' => $comp['name'],
                'shortName' => $comp['short_name'],
                'tagline' => $comp['tagline'],
                'description' => $comp['description'],
                'phone' => $comp['phone_number'],
                'whatsappNumber' => $comp['whatsapp_number'],
                'email' => $comp['email'],
                'address' => $comp['address'],
                'city' => $comp['city'],
                'operatingHours' => $comp['operating_hours'],
                'emergencyAvailable' => (bool)$comp['emergency_available'],
                'instagram' => $comp['instagram'],
                'facebook' => $comp['facebook'],
            ];
            sendJsonResponse(['status' => 'success', 'data' => $formatted]);
        }
        sendJsonResponse(['status' => 'error', 'message' => 'Pengaturan tidak ditemukan.'], 404);
    }

    if ($method === 'PUT' || $method === 'POST') {
        $data = getJsonInput();
        $fields = [];
        $params = [];

        $map = [
            'name' => 'name',
            'shortName' => 'short_name',
            'tagline' => 'tagline',
            'description' => 'description',
            'phone' => 'phone_number',
            'phone_number' => 'phone_number',
            'whatsappNumber' => 'whatsapp_number',
            'whatsapp_number' => 'whatsapp_number',
            'email' => 'email',
            'address' => 'address',
            'city' => 'city',
            'operatingHours' => 'operating_hours',
            'operating_hours' => 'operating_hours',
            'instagram' => 'instagram',
            'facebook' => 'facebook',
        ];

        foreach ($map as $key => $col) {
            if (isset($data[$key])) {
                $fields[] = "`$col` = ?";
                $params[] = $data[$key];
            }
        }

        if (!empty($fields)) {
            $sql = "UPDATE `company_settings` SET " . implode(', ', $fields) . " WHERE id = 1";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        sendJsonResponse(['status' => 'success', 'message' => 'Pengaturan perusahaan berhasil diperbarui!']);
    }
}

// Route Not Found
sendJsonResponse([
    'status' => 'error',
    'message' => 'Endpoint tidak ditemukan: /' . $path,
    'available_endpoints' => [
        '/api/health',
        '/api/stats',
        '/api/products',
        '/api/bookings',
        '/api/blogs',
        '/api/gallery',
        '/api/testimonials',
        '/api/faqs',
        '/api/company',
        '/api/auth/login',
        '/api/setup'
    ]
], 404);
