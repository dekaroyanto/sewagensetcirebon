import { GensetProduct } from '../types';

export const GENSET_PRODUCTS: GensetProduct[] = [
  {
    id: 'genset-10kva',
    name: 'Genset Silent 10 kVA (8 kW)',
    kva: 10,
    kw: 8,
    phase: '1 & 3 Phase',
    engineBrand: 'Yanmar / Isuzu Diesel Engine',
    alternatorBrand: 'Stamford / Daewoo Copy Alternator',
    fuelType: 'Solar (Diesel)',
    fuelConsumption: '2.2 - 3.0 Liter / Jam (Load 75%)',
    noiseLevel: '60 dB @ 7 Meter (Sangat Hening)',
    dimensions: '165 x 78 x 95 cm',
    weight: '550 kg',
    tankCapacity: '40 Liter',
    category: 'small',
    categoryLabel: 'Daya Kecil (10 - 30 kVA)',
    tag: 'Hemat BBM & Praktis',
    idealFor: [
      'Acara Hajatan & Syukuran Rumah Tangga',
      'Stand Pameran / Bazaar / UMKM Food Truck',
      'Ruko & Minimarket saat Pemadaman PLN',
      'Studio Foto & Rekaman'
    ],
    features: [
      'Soundproof Box Super Silent',
      'Digital Control Panel SmartGen / Deepsea',
      'Low Fuel Consumption (Sangat Irit)',
      'Mudah ditempatkan di gang / halaman sempit'
    ],
    includedItems: [
      'Unit Genset Silent Siap Pakai',
      'Kabel Power Standar 20 Meter',
      'Operator Standby selama durasi acara',
      'Instalasi & Uji Coba Beban Awal'
    ],
    startingPriceEstimate: 'Mulai Rp 550.000 / Hari',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'genset-20kva',
    name: 'Genset Silent 20 kVA (16 kW)',
    kva: 20,
    kw: 16,
    phase: '3 Phase (380V)',
    engineBrand: 'Yanmar 4TNV88 / Fawde Silent',
    alternatorBrand: 'Stamford PI144D',
    fuelType: 'Solar (Diesel)',
    fuelConsumption: '3.8 - 4.8 Liter / Jam (Load 75%)',
    noiseLevel: '62 dB @ 7 Meter',
    dimensions: '185 x 85 x 110 cm',
    weight: '780 kg',
    tankCapacity: '65 Liter',
    category: 'small',
    categoryLabel: 'Daya Kecil (10 - 30 kVA)',
    tag: 'Paling Laris Pernikahan Rumah',
    idealFor: [
      'Resepsi Pernikahan Rumahan & Tenda',
      'Acara Musik Akustik & Sound System 5.000W',
      'Restoran, Cafe & Coffee Shop',
      'Kantor Cabang & Klinik Kesehatan'
    ],
    features: [
      'Tingkat Kebisingan Sangat Rendah',
      'Sistem Proteksi Overload & Temperatur',
      'Tegangan Stabil 220V/380V Tanpa Fluktuasi',
      'Dilengkapi Emergency Stop Button'
    ],
    includedItems: [
      'Unit Genset Silent 20 kVA',
      'Kabel Power Tembaga 25 Meter',
      '1 Orang Operator Teknisi Standby',
      'Gratis Setting & Pengujian Jalur Listrik'
    ],
    startingPriceEstimate: 'Mulai Rp 750.000 / Hari',
    image: 'https://d3ciiv7axt9x6p.cloudfront.net/blog/original/661f43445b8b6_ori.jpg'
  },
  {
    id: 'genset-30kva',
    name: 'Genset Silent 30 kVA (24 kW)',
    kva: 30,
    kw: 24,
    phase: '3 Phase (380V)',
    engineBrand: 'Perkins 1103A-33G / Isuzu 4JB1T',
    alternatorBrand: 'Stamford PI144G Original',
    fuelType: 'Solar (Diesel)',
    fuelConsumption: '5.2 - 6.5 Liter / Jam (Load 75%)',
    noiseLevel: '63 dB @ 7 Meter',
    dimensions: '210 x 95 x 120 cm',
    weight: '950 kg',
    tankCapacity: '90 Liter',
    category: 'small',
    categoryLabel: 'Daya Kecil (10 - 30 kVA)',
    tag: 'Favorit Wedding & Gathering',
    idealFor: [
      'Pernikahan Gedung Sedang / Ballroom Hotel Cirebon',
      'Konser Musik Semi-Outdoor & Sound 10.000W',
      'Gedung Serbaguna & Balai Pertemuan',
      'Proyek Pengelasan & Pengecoran Awal'
    ],
    features: [
      'Heavy Duty Diesel Engine Perkins/Isuzu',
      'Suara Halus Tidak Mengganggu Acara Pesta',
      'AVR Kualitas Tinggi (Tegangan Presisi)',
      'Canopy Powder Coating Tahan Panas & Hujan'
    ],
    includedItems: [
      'Unit Genset Silent 30 kVA',
      'Kabel Distribusi 30 Meter',
      'Operator Standby Penuh',
      'Panel Indikator & Pengaman Listrik'
    ],
    startingPriceEstimate: 'Mulai Rp 950.000 / Hari',
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'genset-45kva',
    name: 'Genset Silent 45 kVA (36 kW)',
    kva: 45,
    kw: 36,
    phase: '3 Phase (380V)',
    engineBrand: 'Cummins 4BT3.9-G2 / Perkins 1103A-33TG1',
    alternatorBrand: 'Stamford UCI224C',
    fuelType: 'Solar (Diesel)',
    fuelConsumption: '7.8 - 9.5 Liter / Jam (Load 75%)',
    noiseLevel: '65 dB @ 7 Meter',
    dimensions: '235 x 100 x 135 cm',
    weight: '1.200 kg',
    tankCapacity: '120 Liter',
    category: 'medium',
    categoryLabel: 'Daya Menengah (45 - 100 kVA)',
    tag: 'Rekomendasi Event Panggung & Lighting',
    idealFor: [
      'Panggung Konser Musik & Festival Seni Cirebon',
      'Sound System Gantung (Line Array) + Tata Lampu LED',
      'Gedung Konvensi / Convention Center',
      'Peralatan Tower Crane & Proyek Bangunan'
    ],
    features: [
      'Mesin Turbocharged Kuat Tarikan Beban Awal',
      'Filter Udara & Solar Ganda untuk Ketahanan Tinggi',
      'Sistem Peredam Busa Akustik Anti-Api (Fireproof)',
      'Monitoring Digital Ampere, Volt, Hz, Oil Pressure'
    ],
    includedItems: [
      'Unit Genset Silent 45 kVA',
      'Kabel Utama 35 Meter',
      'Operator & Teknisi Listrik Siaga',
      'Layanan Pengantaran & Setting Cepat di Lokasi'
    ],
    startingPriceEstimate: 'Mulai Rp 1.250.000 / Hari',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'genset-60kva',
    name: 'Genset Silent 60 kVA (48 kW)',
    kva: 60,
    kw: 48,
    phase: '3 Phase (380V)',
    engineBrand: 'Cummins 4BTA3.9-G2 / Perkins 1104A-44TG1',
    alternatorBrand: 'Stamford UCI224E',
    fuelType: 'Solar (Diesel)',
    fuelConsumption: '10.5 - 12.5 Liter / Jam (Load 75%)',
    noiseLevel: '65 dB @ 7 Meter',
    dimensions: '250 x 105 x 145 cm',
    weight: '1.450 kg',
    tankCapacity: '150 Liter',
    category: 'medium',
    categoryLabel: 'Daya Menengah (45 - 100 kVA)',
    tag: 'Pilihan Utama Wedding Skala Besar',
    idealFor: [
      'Pesta Pernikahan Mewah (AC Standing, Misty Fan, Videotron)',
      'Event Pameran Otomotif & Expo Dagang Cirebon',
      'Supermarket & Kantor Dinas Pemerintahan',
      'Proyek Infrastruktur Jalan & Jembatan'
    ],
    features: [
      'Kapasitas Handal untuk Beban Kejut AC & Videotron',
      'Pintu Akses Ganda untuk Pengecekan Mesin Cepat',
      'Indikator Suhu & Tekanan Oli Otomatis',
      'Emisi Gas Buang Bersih & Suara Sangat Meredam'
    ],
    includedItems: [
      'Unit Genset Silent 60 kVA',
      'Kabel Power Tembaga 40 Meter',
      'Operator Khusus Standby di Tempat',
      'Panel COS Manual / ATS Opsional'
    ],
    startingPriceEstimate: 'Mulai Rp 1.500.000 / Hari',
    image: 'https://images.unsplash.com/photo-1705051278299-7e64ba21437a?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'genset-100kva',
    name: 'Genset Silent 100 kVA (80 kW)',
    kva: 100,
    kw: 80,
    phase: '3 Phase (380V)',
    engineBrand: 'Cummins 6BT5.9-G2 / Perkins 1104C-44TAG2',
    alternatorBrand: 'Stamford UCI274C',
    fuelType: 'Solar (Diesel)',
    fuelConsumption: '16.5 - 19.5 Liter / Jam (Load 75%)',
    noiseLevel: '67 dB @ 7 Meter',
    dimensions: '290 x 115 x 160 cm',
    weight: '1.950 kg',
    tankCapacity: '220 Liter',
    category: 'medium',
    categoryLabel: 'Daya Menengah (45 - 100 kVA)',
    tag: 'Kapasitas Primadona Industri & Konser',
    idealFor: [
      'Konser Musik Skala Besar di Stadion / Lapangan Cirebon',
      'Backup Rumah Sakit & Laboratorium Medis',
      'Pabrik Rotan, Garmen, Pengolahan Makanan di Cirebon',
      'Pengecoran Proyek Bangunan Gedung Bertingkat'
    ],
    features: [
      'Mesin 6 Silinder Inline Turbo Intercooled bertenaga prima',
      'Sanggup Beroperasi 24 Jam Non-Stop',
      'Smart Controller DSE 6120 Auto Start / Stop',
      'Tangki BBM Harian Terintegrasi di Sasis'
    ],
    includedItems: [
      'Unit Genset Silent 100 kVA',
      'Kabel Power NYY 4x35mm² 50 Meter',
      '2 Orang Teknisi & Operator Berpengalaman',
      'Tool Kit, Pemadam Api Ringan (APAR), Grounding Rod'
    ],
    startingPriceEstimate: 'Mulai Rp 2.200.000 / Hari',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'genset-150kva',
    name: 'Genset Silent 150 kVA (120 kW)',
    kva: 150,
    kw: 120,
    phase: '3 Phase (380V)',
    engineBrand: 'Cummins 6CTA8.3-G2 / Perkins 1106A-70TAG2',
    alternatorBrand: 'Stamford UCI274F',
    fuelType: 'Solar (Diesel)',
    fuelConsumption: '24.0 - 28.5 Liter / Jam (Load 75%)',
    noiseLevel: '68 dB @ 7 Meter',
    dimensions: '330 x 125 x 175 cm',
    weight: '2.500 kg',
    tankCapacity: '300 Liter',
    category: 'large',
    categoryLabel: 'Daya Besar (150 - 250 kVA)',
    tag: 'Heavy Duty Backup Pabrik',
    idealFor: [
      'Kawasan Industri Arjawinangun, Plumbon & Kertajati',
      'Backup Darurat Mall & Hotel Berbintang',
      'Proyek Infrastruktur Tol Cipali & Pelabuhan Cirebon',
      'Event Festival Nasional Multi-Panggung'
    ],
    features: [
      'Torsi Luar Biasa untuk Beban Mesin Induksi & Motor Listrik',
      'Canopy Baja Tahan Karat dengan Busa Rockwool Tebal',
      'Dual Fuel Filter + Water Separator',
      'Opsi Sinkronisasi / Paralel Sistem'
    ],
    includedItems: [
      'Unit Genset Silent 150 kVA',
      'Kabel Power NYY 4x50mm² 50 Meter',
      'Operator Standby 24 Jam Bergantian',
      'Mobilisasi Truk Crane & Pengawasan Ahli'
    ],
    startingPriceEstimate: 'Mulai Rp 3.000.000 / Hari',
    image: 'https://www.truck1.id/img/xxl/3897/CAT-DE150GC-150-kVA-Stand-by-Generator-DPX-18209-Belanda_3897_6953988329778.jpg'
  },
  {
    id: 'genset-250kva',
    name: 'Genset Silent 250 kVA (200 kW)',
    kva: 250,
    kw: 200,
    phase: '3 Phase (380V)',
    engineBrand: 'Cummins 6LTAA8.9-G2 / Perkins 1506A-E88TAG3',
    alternatorBrand: 'Stamford UCDI274K',
    fuelType: 'Solar (Diesel)',
    fuelConsumption: '38.0 - 45.0 Liter / Jam (Load 75%)',
    noiseLevel: '70 dB @ 7 Meter',
    dimensions: '380 x 140 x 205 cm',
    weight: '3.600 kg',
    tankCapacity: '450 Liter',
    category: 'large',
    categoryLabel: 'Daya Besar (150 - 250 kVA)',
    tag: 'Pabrik & Cold Storage',
    idealFor: [
      'Pabrik Cold Storage Perikanan & Hasil Laut di Pelabuhan Cirebon',
      'Pabrik Semen, Baja, & Manufaktur Keramik',
      'Pusat Data (Data Center) & Telekomunikasi',
      'Kontrak Pemadaman Bergilir PLN Pabrik'
    ],
    features: [
      'Performa Maksimal untuk Operasi Kontinu Berat',
      'Elektronik Governor untuk Regulasi Frekuensi 50 Hz Presisi',
      'Sistem Pendingin Radiator Tropis 50°C',
      'Sertifikasi Emisi Internasional'
    ],
    includedItems: [
      'Unit Genset Silent 250 kVA',
      'Kabel Power Standar Heavy Duty',
      'Tim Teknisi Profesional Siaga',
      'Bantuan Analisa Kebutuhan Beban Lapangan'
    ],
    startingPriceEstimate: 'Mulai Rp 4.500.000 / Hari',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'genset-500kva',
    name: 'Genset Silent 500 kVA (400 kW)',
    kva: 500,
    kw: 400,
    phase: '3 Phase (380V)',
    engineBrand: 'Cummins QSX15-G8 / Perkins 2506C-E15TAG2 / Mitsubishi',
    alternatorBrand: 'Stamford HCI544C',
    fuelType: 'Solar (Diesel)',
    fuelConsumption: '75.0 - 90.0 Liter / Jam (Load 75%)',
    noiseLevel: '72 dB @ 7 Meter',
    dimensions: '480 x 165 x 240 cm',
    weight: '5.800 kg',
    tankCapacity: '800 Liter',
    category: 'heavy',
    categoryLabel: 'Mega Power (350 - 500+ kVA)',
    tag: 'Mega Power Proyek Strategis',
    idealFor: [
      'Mega Proyek Nasional & Bandara Internasional Kertajati (BIJB)',
      'Kawasan Industri Terpadu Cirebon - Majalengka',
      'Pabrik Kimia, Tekstil & Manufaktur Otomotif Skala Besar',
      'Festival Akbar Musik Internasional'
    ],
    features: [
      'Mesin Heavy Duty 15 Liter Turbocharged Aftercooled',
      'Full Digital Synchronization Ready (Multi-Genset Paralleling)',
      'Canopy Soundproof Kontainer 20 Feet Super Silent',
      'Monitoring Real-time Telemetri & Smart Alarm'
    ],
    includedItems: [
      'Unit Genset Silent 500 kVA',
      'Kabel Power Heavy Cross-Section',
      'Tim Engineer & Operator Dedicated',
      'Mobil Crane Pengangkat & Pengawalan Logistik'
    ],
    startingPriceEstimate: 'Hubungi WhatsApp untuk Penawaran Khusus',
    image: 'https://hartechsby.co.id/wp-content/uploads/genset40hdeIMG20240108105645-1024x768.jpg'
  },
  {
    id: 'ac-standing-5pk',
    name: 'AC Standing Floor 5 PK (45.000 BTU)',
    productType: 'ac',
    pk: 5,
    btu: '45.000 BTU/h',
    phase: '3 Phase (380V)',
    engineBrand: 'Daikin / Panasonic / Gree Commercial',
    fuelType: 'Listrik PLN / Genset',
    noiseLevel: '48 dB (Sangat Hening Indoor)',
    dimensions: '185 x 60 x 35 cm',
    weight: '65 kg (Indoor) + 85 kg (Outdoor)',
    category: 'ac',
    categoryLabel: 'AC Standing (3 - 5 PK)',
    tag: 'Paling Laris Wedding & VIP Tenda',
    idealFor: [
      'Pesta Pernikahan Tenda & Gedung Resepsi',
      'VIP Lounge, Ruang Tamu Undangan Khusus',
      'Pameran Mall, Expo & Hall Pertemuan Cirebon',
      'Ruang Transit Pejabat & Artis'
    ],
    features: [
      'Hembusan Angin Dingin Turbo 4 Arah Kuat & Merata',
      'Filter Udara Anti-Bakteri & Bau Tak Sedap',
      'Panel Display Digital & Remote Control',
      'Unit Mulus, Bersih, Berseragam Putih Elegan'
    ],
    includedItems: [
      'Unit Indoor Standing + Outdoor Unit 5 PK',
      'Pipa Tembaga Freon & Kabel Power Siap Colok',
      'Selang Pembuangan Air AC',
      'Teknisi Khusus Instalasi & Standby Suhu Acara'
    ],
    startingPriceEstimate: 'Mulai Rp 750.000 / Unit / Hari',
    image: 'https://www.oscarliving.co.id/cdn/shop/files/ac-air-conditioner-ac-standing-gree-gvc-18sts-2pk-gree-shopname-4242700.png?v=1770723613'
  },
  {
    id: 'ac-standing-3pk',
    name: 'AC Standing Floor 3 PK (28.000 BTU)',
    productType: 'ac',
    pk: 3,
    btu: '28.000 BTU/h',
    phase: '1 Phase (220V)',
    engineBrand: 'Daikin / Panasonic Heavy Duty',
    fuelType: 'Listrik PLN / Genset',
    noiseLevel: '45 dB (Hening Maksimal)',
    dimensions: '175 x 52 x 30 cm',
    weight: '48 kg (Indoor) + 60 kg (Outdoor)',
    category: 'ac',
    categoryLabel: 'AC Standing (3 - 5 PK)',
    tag: 'Favorit Ruang Akad & Dressing Room',
    idealFor: [
      'Ruang Akad Nikah / Pemberkatan Keluarga',
      'Kamar Rias Pengantin & Ruang Ganti Artis',
      'Tenda Prasmanan / Dining Area Tertutup',
      'Kantor Sementara & Posko Event'
    ],
    features: [
      'Hemat Listrik (1 Phase 220V Ramah Sumber Daya)',
      'Desain Ramping Tidak Memakan Tempat',
      'Suhu Cepat Turun dalam Waktu Singkat',
      'Kondisi Unit Selalu Higienis & Bersih'
    ],
    includedItems: [
      'Unit Indoor + Outdoor AC Standing 3 PK',
      'Instalasi Pipa Freon & Kabel Listrik',
      'Jasa Setting & Pengujian Dingin',
      'Dukungan Teknisi Standby'
    ],
    startingPriceEstimate: 'Mulai Rp 550.000 / Unit / Hari',
    image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'misty-fan-blower',
    name: 'Kipas Blower Air Kabut (Misty Fan 26")',
    productType: 'ac',
    phase: '1 Phase (220V)',
    engineBrand: 'Misty Fan Industrial Heavy Duty 26 Inch',
    fuelType: 'Listrik PLN / Genset',
    noiseLevel: '52 dB (Hembusan Angin Segar)',
    dimensions: '175 x 65 x 55 cm',
    weight: '25 kg',
    tankCapacity: '45 Liter Air',
    category: 'ac',
    categoryLabel: 'Kipas Blower Kabut',
    tag: 'Rekomendasi Area Semi-Outdoor',
    idealFor: [
      'Area Tenda Semi Terbuka & Halaman Resepsi',
      'Bazaar Makanan, Pasar Malam & Festival Kuliner',
      'Acara Olahraga, Fun Run & Konser Outdoor',
      'Antrian Tamu & Jalur Masuk Acara'
    ],
    features: [
      'Butiran Embun Kabut Mikro Super Halus (Tidak Bikin Basah)',
      'Tangki Air 45L Tahan Operasional 6-8 Jam Nonstop',
      'Osilasi Putar 90 Derajat Jangkauan Luas',
      'Roda Kaki Praktis Mudah Digeser di Lokasi'
    ],
    includedItems: [
      'Unit Kipas Misty Fan 26 Inch Siap Pakai',
      'Kabel Rol Listrik 10-15 Meter',
      'Pengisian Air Pertama & Pengujian Kabut',
      'Teknisi Siap Bantu Refill Air'
    ],
    startingPriceEstimate: 'Mulai Rp 250.000 / Unit / Hari',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paket-wedding-genset-ac',
    name: 'Paket Hemat Wedding: Genset 60 kVA + 4 Unit AC Standing 5 PK',
    productType: 'paket',
    kva: 60,
    kw: 48,
    pk: 20, // 4 x 5 PK
    phase: '3 Phase (380V)',
    engineBrand: 'Genset Silent Cummins + 4x AC Standing 5 PK',
    fuelType: 'Solar (Diesel)',
    noiseLevel: 'Super Silent (<65 dB)',
    dimensions: 'Paket Komplit Event Tenda / Gedung',
    weight: '1 Paket Lengkap',
    category: 'paket',
    categoryLabel: 'Paket Bundling Hemat',
    tag: 'Solusi All-In Wedding Mewah',
    idealFor: [
      'Pesta Resepsi Pernikahan 500 - 1.500 Undangan',
      'Tenda Dekorasi Mewah Full AC',
      'Gathering Perusahaan & Acara Akbar Instansi',
      'Gedung Serbaguna Tanpa AC Sentral'
    ],
    features: [
      'Pasokan Listrik + Suhu Sejuk Dingin Terjamin 100%',
      'Cukup 1 Vendor untuk Kelistrikan & Pendingin Pesta',
      'Distribusi Kabel Panel Rapi Tersembunyi Aman Dilalui Tamu',
      'Harga Paket Jauh Lebih Hemat dibanding Sewa Terpisah'
    ],
    includedItems: [
      '1 Unit Genset Silent 60 kVA (Siap BBM Solar Industri)',
      '4 Unit AC Standing 5 PK (Total 20 PK Sejuk Merata)',
      'Kabel Power Tembaga 50 Meter + Sub-Panel MCB',
      '2 Orang Teknisi Listrik & Teknisi AC Standby Sepanjang Acara'
    ],
    startingPriceEstimate: 'Hubungi WA untuk Harga Paket Spesial',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO2I6LEgUQOJf13Yjx7_HTY61XEUAJzahfmxSvy4KnEDzyVZtY5gvoUcSy&s=10'
  }
];
