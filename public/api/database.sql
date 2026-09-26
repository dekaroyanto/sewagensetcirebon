-- ==============================================================================
-- DATABASE SCHEMA & DEFAULT DATA FOR SEWA GENSET CIREBON (SGC)
-- Hostinger MySQL / phpMyAdmin Compatible
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. TABEL ADMIN USERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Akun Default: Username: admin | Password: admin123
INSERT INTO `admin_users` (`id`, `username`, `email`, `password_hash`, `full_name`, `role`)
VALUES (1, 'admin', 'admin@sewagensetcirebon.com', '$2y$12$T8dbl0IZCzzRApbq9ubXqeyi7q8fS9PqKSlq6vGaDqGGirYyd6IxW', 'Administrator SGC', 'admin')
ON DUPLICATE KEY UPDATE `username` = `username`;

-- ------------------------------------------------------------------------------
-- 2. TABEL PRODUCTS (Genset, AC Standing, Paket, Aksesoris)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `product_type` ENUM('genset', 'ac', 'paket', 'aksesoris') NOT NULL DEFAULT 'genset',
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `image_url` TEXT NOT NULL,
  `description` TEXT NOT NULL,
  `kva` INT NULL,
  `kw` INT NULL,
  `pk` INT NULL,
  `phase` VARCHAR(50) NULL,
  `tag` VARCHAR(100) NULL,
  `category_label` VARCHAR(100) NULL,
  `starting_price_estimate` DECIMAL(12,2) NULL,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `name`, `product_type`, `price`, `image_url`, `description`, `kva`, `kw`, `is_available`, `sort_order`) VALUES
('sgc-10kva', 'Genset Silent 10 kVA (8 kW)', 'genset', 550000.00, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 'Kapasitas Daya: 10 kVA / 8 kW (Beban Rekomendasi ~7 kW)\nMesin: Yanmar / Isuzu 3-Silinder Diesel Engine\nAlternator: Stamford / Daewoo Copy Alternator 100% Tembaga\nTipe Listrik: 1 & 3 Phase (220V / 380V)\nTingkat Suara: Super Silent 60 dB (Jarak 7 Meter)\nBahan Bakar: Solar Diesel (Konsumsi 2.2 - 3.0 L/Jam @ Load 75%)\nKapasitas Tangki: 40 Liter\nDimensi: 165 x 78 x 95 cm | Berat: 550 kg\n\nRekomendasi Penggunaan:\n• Acara hajatan & syukuran keluarga skala rumahan\n• Stand pameran, bazaar UMKM, dan food truck outdoor\n• Backup minimarket & ruko saat pemadaman PLN\n• Studio foto, shooting video, dan sound kecil\n\nPaket Sewa Sudah Termasuk:\n• 1 Unit Genset Silent Siap Pakai\n• Kabel Power Standar 20 Meter\n• Operator Teknisi Standby selama Acara\n• Instalasi & Uji Coba Beban di Lokasi', 10, 8, 1, 1),
('sgc-20kva', 'Genset Silent 20 kVA (16 kW)', 'genset', 750000.00, 'https://d3ciiv7axt9x6p.cloudfront.net/blog/original/661f43445b8b6_ori.jpg', 'Kapasitas Daya: 20 kVA / 16 kW (Beban Rekomendasi ~13.5 kW)\nMesin: Yanmar 4TNV88 / Fawde Silent Series\nAlternator: Stamford PI144D Original\nTipe Listrik: 3 Phase (380V / 220V)\nTingkat Suara: Super Silent 62 dB (Jarak 7 Meter)\nBahan Bakar: Solar Diesel (Konsumsi 3.8 - 4.8 L/Jam @ Load 75%)\nKapasitas Tangki: 65 Liter\nDimensi: 185 x 85 x 110 cm | Berat: 780 kg\n\nRekomendasi Penggunaan:\n• Resepsi pernikahan rumahan & tenda dekorasi\n• Acara musik akustik & sound system 5.000 Watt\n• Restoran, cafe, ruko & klinik kesehatan\n• Kantor cabang & event semi-outdoor\n\nPaket Sewa Sudah Termasuk:\n• 1 Unit Genset Silent 20 kVA Kondisi Prima\n• Kabel Power Tembaga 25 Meter\n• 1 Orang Operator Teknisi Standby\n• Pengujian Jalur Listrik & Setting Beban Aman', 20, 16, 1, 2),
('sgc-30kva', 'Genset Silent 30 kVA (24 kW)', 'genset', 950000.00, 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80', 'Kapasitas Daya: 30 kVA / 24 kW (Beban Rekomendasi ~20 kW)\nMesin: Perkins 1103A-33G / Isuzu 4JB1T\nAlternator: Stamford PI144G Original\nTipe Listrik: 3 Phase (380V / 220V)\nTingkat Suara: Super Silent 63 dB (Jarak 7 Meter)\nBahan Bakar: Solar Diesel (Konsumsi 5.2 - 6.5 L/Jam @ Load 75%)\nKapasitas Tangki: 90 Liter\nDimensi: 210 x 95 x 120 cm | Berat: 950 kg\n\nRekomendasi Penggunaan:\n• Pernikahan gedung sedang / ballroom hotel di Cirebon\n• Konser musik semi-outdoor & sound system 10.000 Watt\n• Backup supermarket, SPBU & minimarket modern', 30, 24, 1, 3),
('sgc-45kva', 'Genset Silent 45 kVA (36 kW)', 'genset', 1250000.00, 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', 'Kapasitas Daya: 45 kVA / 36 kW (Beban Rekomendasi ~30 kW)\nMesin: Perkins 1103A-33TG1 / Cummins 4BT3.9-G2\nAlternator: Stamford UCI224C\nTipe Listrik: 3 Phase (380V / 220V)\nTingkat Suara: Super Silent 64 dB (Jarak 7 Meter)\nBahan Bakar: Solar Diesel (Konsumsi 8.0 - 10.0 L/Jam @ Load 75%)\nKapasitas Tangki: 120 Liter\n\nRekomendasi Penggunaan:\n• Wedding ballroom dengan 4-6 unit AC standing\n• Panggung konser musik & tata lampu panggung besar', 45, 36, 1, 4),
('sgc-60kva', 'Genset Silent 60 kVA (48 kW)', 'genset', 1500000.00, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80', 'Kapasitas Daya: 60 kVA / 48 kW (Beban Rekomendasi ~40 kW)\nMesin: Perkins 1104A-44TG1 / Cummins 4BTA3.9-G2\nAlternator: Stamford UCI224E\nTipe Listrik: 3 Phase (380V / 220V)\nTingkat Suara: Super Silent 65 dB (Jarak 7 Meter)\nBahan Bakar: Solar Diesel (Konsumsi 11.0 - 13.5 L/Jam @ Load 75%)\nKapasitas Tangki: 150 Liter\n\nRekomendasi Penggunaan:\n• Resepsi pernikahan besar tenda tertutup ber-AC penuh\n• Panggung konser musik outdoor dan lighting megah\n• Pabrik rotan & industri manufaktur Cirebon', 60, 48, 1, 5),
('sgc-100kva', 'Genset Silent 100 kVA (80 kW)', 'genset', 2100000.00, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 'Kapasitas Daya: 100 kVA / 80 kW (Beban Rekomendasi ~68 kW)\nMesin: Cummins 6BT5.9-G2 / Perkins 1104C-44TAG2\nAlternator: Stamford UCI274C\nTipe Listrik: 3 Phase (380V / 220V)\nTingkat Suara: Super Silent 66 dB (Jarak 7 Meter)\nBahan Bakar: Solar Diesel (Konsumsi 18.0 - 22.0 L/Jam @ Load 75%)\nKapasitas Tangki: 220 Liter', 100, 80, 1, 6),
('sgc-ac-5pk', 'AC Standing Floor 5 PK (45.000 BTU)', 'ac', 750000.00, 'https://www.oscarliving.co.id/cdn/shop/files/ac-air-conditioner-ac-standing-gree-gvc-18sts-2pk-gree-shopname-4242700.png?v=1770723613', 'Kapasitas Pendingin: 5 PK (45.000 BTU/h)\nMerk Komersial: Daikin / Panasonic / Gree Commercial\nKebutuhan Listrik: 3 Phase (380V) ~ 5.2 kW\nTingkat Suara: 48 dB (Sangat Hening Indoor)\nDimensi: 185 x 60 x 35 cm | Berat: 65 kg (Indoor) + 85 kg (Outdoor)\n\nRekomendasi Penggunaan:\n• Pesta pernikahan tenda dekorasi & ballroom gedung resepsi\n• VIP lounge, ruang tamu undangan khusus, ruang transit pejabat\n• Pameran mall, expo produk & hall pertemuan Cirebon', NULL, NULL, 1, 7),
('sgc-ac-3pk', 'AC Standing Floor 3 PK (28.000 BTU)', 'ac', 550000.00, 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80', 'Kapasitas Pendingin: 3 PK (28.000 BTU/h)\nMerk Komersial: Daikin / Panasonic Heavy Duty\nKebutuhan Listrik: 1 Phase (220V) ~ 3.1 kW\nTingkat Suara: 45 dB (Hening Maksimal)\n\nRekomendasi Penggunaan:\n• Ruang akad nikah / ruang sakral keluarga pengantin\n• Kamar rias pengantin & ruang transit artis\n• Tenda prasmanan / dining area tertutup', NULL, NULL, 1, 8),
('sgc-misty-fan', 'Kipas Blower Air Kabut (Misty Fan 26")', 'ac', 250000.00, 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80', 'Tipe: Kipas Blower Air Kabut Industrial (Misty Fan 26 Inch)\nDaya Listrik: 1 Phase (220V) ~ 260 Watt (Sangat Hemat Listrik)\nTingkat Suara: 52 dB (Hembusan Angin Segar Menyejukkan)\nTangki Air: 45 Liter (Durasi Kabut 6 - 8 Jam Nonstop)\n\nRekomendasi Penggunaan:\n• Area tenda semi-terbuka & halaman resepsi pernikahan\n• Bazaar makanan, pasar malam & festival kuliner outdoor\n• Acara olahraga, fun run & konser musik terbuka', NULL, NULL, 1, 9),
('sgc-paket-wedding', 'Paket Hemat Wedding: Genset 60 kVA + 4 AC Standing 5 PK', 'paket', 4350000.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO2I6LEgUQOJf13Yjx7_HTY61XEUAJzahfmxSvy4KnEDzyVZtY5gvoUcSy&s=10', 'Kelengkapan Paket Bundling:\n• 1 Unit Genset Silent 60 kVA (48 kW) Full Soundproof\n• 4 Unit AC Standing Floor 5 PK (Total Daya Dingin 20 PK / 180.000 BTU)\n• Kabel Power Tembaga 50 Meter + Sub-Panel MCB Distribusi Rapi\n• 2 Orang Teknisi Khusus (1 Teknisi Genset + 1 Teknisi AC Standby Acara)\n\nRekomendasi Penggunaan:\n• Resepsi pernikahan tenda tertutup 500 - 1.500 undangan\n• Tenda dekorasi mewah full air conditioning\n• Gathering akbar perusahaan & halal bihalal instansi', 60, 48, 1, 10),
('sgc-panel-ats', 'Panel Otomatis ATS (Automatic Transfer Switch) 100A - 400A', 'aksesoris', 350000.00, 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80', 'Kapasitas Proteksi: 100A - 400A (3 Phase 380V / 220V)\nKomponen Utama: Breaker Schneider / ABB Industrial Grade\nFitur Cerdas: Otomatis menyalakan genset dan memindahkan sumber listrik dalam 3 - 5 detik saat PLN padam tanpa lonjakan fluktuasi.', NULL, NULL, 1, 11)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ------------------------------------------------------------------------------
-- 3. TABEL BOOKINGS (Permintaan Sewa Masuk)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_code` VARCHAR(30) UNIQUE NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `company_or_event` VARCHAR(150) NULL,
  `phone` VARCHAR(50) NOT NULL,
  `selected_genset_id` VARCHAR(64) NULL,
  `selected_genset_name` VARCHAR(150) NULL,
  `unit_quantity` INT NOT NULL DEFAULT 1,
  `ac_quantity` INT NOT NULL DEFAULT 0,
  `rental_type` VARCHAR(100) NOT NULL,
  `start_date` VARCHAR(50) NOT NULL,
  `start_time` VARCHAR(50) NOT NULL,
  `duration` VARCHAR(50) NOT NULL,
  `event_location` TEXT NOT NULL,
  `district_cirebon` VARCHAR(100) NOT NULL,
  `package_type` VARCHAR(150) NOT NULL,
  `additional_needs` TEXT NULL,
  `notes` TEXT NULL,
  `status` ENUM('Menunggu Konfirmasi', 'Dikonfirmasi', 'Sedang Berjalan', 'Selesai', 'Dibatalkan') NOT NULL DEFAULT 'Menunggu Konfirmasi',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bookings` (`booking_code`, `full_name`, `company_or_event`, `phone`, `selected_genset_id`, `selected_genset_name`, `unit_quantity`, `ac_quantity`, `rental_type`, `start_date`, `start_time`, `duration`, `event_location`, `district_cirebon`, `package_type`, `notes`, `status`) VALUES
('SGC-2026-001', 'Hj. Siti Rohmah', 'Pernikahan Putri Pertama', '081234567890', 'sgc-60kva', 'Genset Silent 60 kVA (48 kW)', 1, 4, 'Harian / Acara', '2026-10-15', '08:00 WIB', '1 Hari Penuh', 'Gedung Islamic Centre Cirebon', 'Kejaksan', 'Include BBM Solar & Operator', 'Mohon standby H-1 malam untuk instalasi kabel.', 'Dikonfirmasi'),
('SGC-2026-002', 'Bpk. Fajar Ramadhan', 'Konser Musik Akustik Kampus', '081987654321', 'sgc-30kva', 'Genset Silent 30 kVA (24 kW)', 1, 0, 'Harian / Acara', '2026-10-20', '13:00 WIB', '1 Hari', 'Kampus UGJ Cirebon', 'Kesambi', 'Include BBM Solar & Operator', 'Butuh kabel power 40 meter menuju panggung.', 'Menunggu Konfirmasi')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

-- ------------------------------------------------------------------------------
-- 4. TABEL BLOG POSTS (Artikel & Edukasi)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` VARCHAR(64) PRIMARY KEY,
  `slug` VARCHAR(200) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `read_time` VARCHAR(50) NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `image` TEXT NOT NULL,
  `tags` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `blog_posts` (`id`, `slug`, `title`, `summary`, `category`, `date`, `read_time`, `author`, `image`, `tags`, `content`) VALUES
('post-1', 'panduan-memilih-kapasitas-genset-pernikahan-cirebon', 'Panduan Lengkap Memilih Kapasitas Genset untuk Pernikahan & Resepsi di Cirebon', 'Jangan sampai AC mati atau sound system mendengung di hari bahagia Anda! Ketahui estimasi daya yang tepat untuk pesta rumahan, gedung, hingga tenda outdoor di wilayah Cirebon.', 'Tips & Panduan', '28 Februari 2026', '4 Menit Baca', 'Tim Teknis SGC', 'https://images.unsplash.com/photo-1636867759143-c28c1e909bd3?q=80&w=1074&auto=format&fit=crop', '["Wedding Cirebon", "Tips Genset", "Kapasitas Daya", "SGC Power"]', '["Pernikahan merupakan salah satu momen paling berharga dalam hidup. Namun, seringkali kendala listrik seperti trip sekring atau pemadaman tiba-tiba dari PLN dapat merusak jalannya acara sakral ini.", "Untuk resepsi tenda perumahan 300-500 undangan, genset silent 20 kVA hingga 30 kVA adalah pilihan ideal.", "Sedangkan untuk ballroom hotel dengan videotron & 4+ unit AC standing, sangat disarankan memakai genset 60 kVA."]');

-- ------------------------------------------------------------------------------
-- 5. TABEL GALLERY ITEMS (Portofolio Proyek & Acara)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `gallery_items` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `location` VARCHAR(200) NOT NULL,
  `genset_used` VARCHAR(150) NOT NULL,
  `image` TEXT NOT NULL,
  `client` VARCHAR(150) NULL,
  `duration` VARCHAR(100) NULL,
  `peak_load` VARCHAR(100) NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `gallery_items` (`id`, `title`, `category`, `location`, `genset_used`, `image`, `client`, `duration`, `peak_load`, `description`) VALUES
('gal-1', 'Resepsi Pernikahan Mewah di Ballroom Hotel Cirebon', 'Wedding & Resepsi', 'Grage Hotel, Kota Cirebon', 'Genset Silent 60 kVA + 4 Unit AC Standing 5 PK', 'https://plus.unsplash.com/premium_photo-1661907977530-eb64ddbfb88a?q=80&w=1221&auto=format&fit=crop', 'Wedding Organizer Harmony & Keluarga Mempelai', '2 Hari (Setup & Live Event)', '42 kW', 'Penyediaan pasokan daya listrik utama untuk pesta pernikahan dengan lighting panggung besar, catering buffet, dan 4 unit AC Standing 5 PK.'),
('gal-2', 'Konser Musik & Festival Panggung Utama Bima', 'Konser & Musik', 'Stadion Bima, Kota Cirebon', 'Genset Silent 150 kVA Paralleling System', 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=736&auto=format&fit=crop', 'Cirebon Youth Fest Production', '3 Hari Penuh', '115 kW', 'Suplai kelistrikan panggung raksasa dengan sistem sinkronisasi otomatis ganda guna mengantisipasi beban lonjakan sound line array.');

-- ------------------------------------------------------------------------------
-- 6. TABEL TESTIMONIALS (Ulasan Klien)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `role` VARCHAR(150) NOT NULL,
  `company_or_event` VARCHAR(150) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `date` VARCHAR(50) NOT NULL,
  `comment` TEXT NOT NULL,
  `genset_used` VARCHAR(150) NOT NULL,
  `avatar_bg` VARCHAR(50) DEFAULT 'from-amber-500 to-amber-700',
  `verified` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `testimonials` (`id`, `name`, `role`, `company_or_event`, `location`, `rating`, `date`, `comment`, `genset_used`, `verified`) VALUES
('testi-1', 'Bpk. Dimas Prasetyo', 'Ketua Panitia & Wedding Organizer', 'Cirebon Royal Wedding Planner', 'Grage Grand Business Hotel Cirebon', 5, '14 Februari 2026', 'Sangat puas dengan pelayanan Sewa Genset Cirebon! Kami sewa unit Silent 60 kVA untuk resepsi pernikahan klien di ballroom dengan beban 8 unit AC standing dan videotron panggung. Suara gensetnya super hening tidak terdengar sama sekali ke dalam ruangan, voltase stabil 100%, dan operator standby dari pagi sampai selesai.', 'Genset Silent 60 kVA Cummins', 1),
('testi-2', 'Ibu Rina Setyowati', 'Event Director', 'Festival Musik & Kuliner Ciayumajakuning', 'Stadion Bima, Kota Cirebon', 5, '02 Februari 2026', 'Pemesanan via WhatsApp cepat sekali direspon! Admin sangat paham kebutuhan sound system panggung 15.000 Watt dan lighting panggung. Kami pesan unit 100 kVA. Truk pengantaran datang 3 jam sebelum jadwal soundcheck, teknisinya ramah dan sangat menguasai instalasi kabel rapi.', 'Genset Silent 100 kVA Perkins', 1),
('testi-3', 'Ir. Agus Wijaya', 'Site Project Manager', 'PT Pembangunan Graha Cirebon', 'Proyek Ruko & Hunian Modern Sumber, Kab. Cirebon', 5, '20 Januari 2026', 'Kami menyewa genset 45 kVA untuk kebutuhan pengelasan dan alat berat pengecoran selama 2 minggu karena trafo PLN belum tersambung. Genset performanya tangguh, BBM solar irit, tidak ada kendala trip sekalipun. Harga sewa mingguan sangat kompetitif!', 'Genset Silent 45 kVA Perkins', 1);

-- ------------------------------------------------------------------------------
-- 7. TABEL FAQS (Tanya Jawab)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` VARCHAR(64) PRIMARY KEY,
  `category` VARCHAR(100) NOT NULL,
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `faqs` (`id`, `category`, `question`, `answer`, `sort_order`) VALUES
('faq-1', 'Pemesanan & Syarat', 'Bagaimana cara memesan / booking genset di Sewa Genset Cirebon?', 'Pemesanan sangat mudah! Anda cukup mengisi formulir pemesanan online di website ini, lalu klik tombol "Kirim Pesan ke WhatsApp". Sistem kami akan otomatis menyusun rincian pesanan Anda dan langsung meneruskannya ke WhatsApp admin resmi kami di 08170696959. Admin kami akan langsung mengonfirmasi ketersediaan unit dan mengirimkan invoice/surat penawaran.', 1),
('faq-2', 'Pemesanan & Syarat', 'Berapa hari sebelumnya sebaiknya saya melakukan booking genset?', 'Untuk acara di akhir pekan (Jumat - Minggu) seperti pesta pernikahan dan konser musik, kami menyarankan booking minimal 3-7 hari sebelumnya guna mengamankan unit silent favorit Anda. Namun untuk kebutuhan mendadak / darurat mati lampu (Emergency), kami siap melayani pengiriman di hari yang sama selama unit ready.', 2),
('faq-3', 'Pengiriman & Lokasi', 'Wilayah mana saja yang dijangkau oleh Sewa Genset Cirebon?', 'Kami melayani seluruh Kota Cirebon (Kejaksan, Kesambi, Lemahwungkuk, Harjamukti, Pekalipan), Kabupaten Cirebon (Sumber, Palimanan, Weru, Kedawung, Arjawinangun, Losari, Ciledug), Kabupaten Kuningan, Kabupaten Majalengka (termasuk kawasan Kertajati), dan Kabupaten Indramayu (Ciayumajakuning).', 3),
('faq-4', 'Teknis & Operator', 'Apakah sewa genset sudah termasuk operator yang mendampingi?', 'Ya! Seluruh paket sewa harian dan event kami sudah termasuk operator teknisi bersertifikat yang standby di dekat genset selama acara berlangsung. Operator bertugas menghidupkan, memantau tegangan voltase, ampere, suhu mesin, dan mengantisipasi jika terjadi fluktuasi beban listrik.', 4),
('faq-5', 'Darurat 24 Jam', 'Apakah melayani panggilan darurat pemadaman PLN di tengah malam?', 'Ya, layanan hotline WhatsApp kami di 08170696959 aktif 24 jam setiap hari untuk melayani backup darurat rumah sakit, pabrik, peternakan, maupun instansi vital yang mengalami pemadaman listrik darurat.', 5);

-- ------------------------------------------------------------------------------
-- 8. TABEL COMPANY SETTINGS (Pengaturan Kontak & Profil)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `company_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `name` VARCHAR(150) NOT NULL DEFAULT 'Sewa Genset Cirebon (SGC)',
  `short_name` VARCHAR(50) NOT NULL DEFAULT 'SGC',
  `tagline` VARCHAR(255) NOT NULL DEFAULT 'Rental Genset Silent & AC Standing No. 1 di Kota Cirebon & Sekitarnya',
  `description` TEXT NOT NULL,
  `whatsapp_number` VARCHAR(50) NOT NULL DEFAULT '08170696959',
  `phone_number` VARCHAR(50) NOT NULL DEFAULT '08170696959',
  `email` VARCHAR(100) NOT NULL DEFAULT 'gensetcirebon.rental@gmail.com',
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL DEFAULT 'Kota Cirebon',
  `operating_hours` VARCHAR(100) NOT NULL DEFAULT '24 Jam Nonstop Setiap Hari',
  `emergency_available` TINYINT(1) NOT NULL DEFAULT 1,
  `instagram` VARCHAR(100) DEFAULT '@sewagensetcirebon',
  `facebook` VARCHAR(100) DEFAULT 'Sewa Genset Cirebon',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `company_settings` (`id`, `name`, `short_name`, `tagline`, `description`, `whatsapp_number`, `phone_number`, `email`, `address`, `city`)
VALUES (1, 'Sewa Genset Cirebon (SGC)', 'SGC', 'Rental Genset Silent & AC Standing No. 1 di Kota Cirebon & Sekitarnya', 'Pusat persewaan genset silent (10-500+ kVA), AC standing 3-5 PK, kipas misty fan, dan paket pendingin pesta terlengkap, handal, dan profesional untuk pernikahan, konser musik, gathering, proyek industri, dan backup darurat di wilayah Ciayumajakuning.', '08170696959', '08170696959', 'gensetcirebon.rental@gmail.com', 'Kota Cirebon, Jawa Barat, Indonesia', 'Kota Cirebon')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

SET FOREIGN_KEY_CHECKS = 1;
