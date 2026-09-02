import { GalleryItem } from '../types';

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Resepsi Pernikahan Mewah di Ballroom Hotel Cirebon',
    category: 'Wedding & Resepsi',
    location: 'Grage Hotel, Kota Cirebon',
    gensetUsed: 'Genset Silent 60 kVA + 4 Unit AC 5 PK',
    client: 'Wedding Organizer Harmony & Keluarga Mempelai',
    duration: '2 Hari (Setup & Live Event)',
    peakLoad: '42 kW (Lighting, Sound & Cooling System)',
    equipmentIncluded: ['Kabel Power 4x35mm (50m)', 'Panel Distribusi ATS', '2 Operator Siaga Standby', 'BBM Solar Industri Dex'],
    description: 'Penyediaan pasokan daya listrik utama untuk pesta pernikahan dengan lighting panggung besar, catering buffet, dan 4 unit AC Standing 5 PK. Menjaga tegangan tetap stabil 380V/220V tanpa kedip dan suara unit sangat hening.',
    highlightQuote: 'Tegangan sangat stabil tanpa kedip sama sekali, tamu sangat nyaman karena mesin tidak bersuara bising.',
    image: 'https://plus.unsplash.com/premium_photo-1661907977530-eb64ddbfb88a?q=80&w=1221&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'gal-2',
    title: 'Konser Musik & Festival Panggung Utama Bima',
    category: 'Konser & Musik',
    location: 'Stadion Bima, Kota Cirebon',
    gensetUsed: 'Genset Silent 150 kVA Paralleling System',
    client: 'Cirebon Youth Fest Production',
    duration: '3 Hari Penuh',
    peakLoad: '115 kW (Sound System Line Array 50.000W & LED Wall)',
    equipmentIncluded: ['Synchronizing Panel Paralleling', 'Kabel Tembaga Murni 4x70mm', 'Distribusi Box 3-Phase', '4 Tim Teknisi Elektrikal'],
    description: 'Suplai kelistrikan panggung raksasa dengan sistem sinkronisasi otomatis ganda guna mengantisipasi beban lonjakan dari rig lighting moving beam dan sound line array berkekuatan tinggi.',
    highlightQuote: 'Sistem parallel genset SGC berjalan mulus tanpa jeda selama 14 jam konser non-stop.',
    image: 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'gal-3',
    title: 'Pembangunan Proyek Infrastruktur & Jembatan',
    category: 'Proyek & Pembangunan',
    location: 'Kec. Sumber, Kabupaten Cirebon',
    gensetUsed: 'Genset Silent 45 kVA Engine Perkins Heavy Duty',
    client: 'PT Konstruksi Wira Mandiri',
    duration: 'Kontrak Bulanan (3 Bulan)',
    peakLoad: '32 kW (Mesin Las, Crane & Penerangan Malam)',
    equipmentIncluded: ['Tangki BBM Solar Tambahan 500L', 'Panel ATS Heavy Duty', 'Maintenance Rutin 250 Jam', 'Kabel Power Tahan Gesek'],
    description: 'Operasional nonstop 24 jam untuk mendukung pengecoran malam hari dan mesin las berat proyek. Dilengkapi program maintenance berkala filter oli dan solar langsung di lokasi tanpa henti kerja.',
    highlightQuote: 'Ketahanan genset sangat teruji pada medan proyek terbuka dengan durabilitas tinggi.',
    image: 'https://images.unsplash.com/photo-1708786910201-eb908f463782?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'gal-4',
    title: 'Operasional Backup Cold Storage Perikanan Ekspor',
    category: 'Pabrik & Industri',
    location: 'Kawasan Pelabuhan Kejawanan, Cirebon',
    gensetUsed: 'Genset Silent 250 kVA Cummins Heavy Duty',
    client: 'PT Samudra Bahari Cold Chain',
    duration: 'Kontrak Siaga Bulanan (Backup Terjadwal)',
    peakLoad: '190 kW (Kompresor Pembeku & Conveyor)',
    equipmentIncluded: ['Panel AMF / ATS Otomatis 5 Detik', 'Instalasi Grounding & Earthing Khusus', 'Fuel Refill System', 'Teknisi Siaga 24 Jam'],
    description: 'Sistem proteksi darurat untuk mencegah kerugian hasil laut bernilai ratusan juta rupiah saat pemeliharaan jaringan transmisi tegangan menengah PLN. Waktu transfer otomatis hanya 5 detik.',
    highlightQuote: 'Otomatisasi ATS sangat cepat, temperatur cold storage terjaga stabil tanpa fluktuasi.',
    image: 'https://images.unsplash.com/photo-1780445392484-38a4852a1fd8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'gal-5',
    title: 'Acara Seminar Komunitas',
    category: 'Instansi & Pemerintahan',
    location: 'Alun-Alun Kejaksan, Kota Cirebon',
    gensetUsed: 'Genset Silent 100 kVA + 8 Misty Fan Blower',
    client: 'Dinas Kebudayaan & Pariwisata Kota Cirebon',
    duration: '4 Hari Acara',
    peakLoad: '72 kW (Booth UMKM, Panggung Utama & Pendingin Area)',
    equipmentIncluded: ['Panel Pembagi Arus MCB 32A/63A', 'Misty Fan High Velocity', 'Kabel Rubber Fleksibel', 'Tim Safety & Grounding'],
    description: 'Penyaluran daya listrik yang tertata rapi menggunakan cable protector karet di area publik pejalan kaki sehingga aman bagi ribuan pengunjung dan stand UMKM.',
    highlightQuote: 'Instalasi kabel sangat rapi dan aman, jalur pengunjung tetap nyaman dan bebas bahaya tersandung.',
    image: 'https://images.unsplash.com/photo-1635321101901-7ac6eec3d371?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'gal-6',
    title: 'Hajatan Resepsi Tenda Semi-Outdoor Ramah Warga',
    category: 'Wedding & Resepsi',
    location: 'Perumahan Kesambi, Kota Cirebon',
    gensetUsed: 'Genset Silent 20 kVA Super Hening (<58 dB)',
    client: 'Keluarga Bpk. H. Sudirman',
    duration: '1 Hari (08.00 - 23.00 WIB)',
    peakLoad: '14 kW (Sound Akustik, Dekorasi Fairy Lights & 2 AC 3 PK)',
    equipmentIncluded: ['Kabel Power 25m', 'Double Muffler Silencer', '1 Operator Ramah', 'BBM Full Tank'],
    description: 'Penempatan unit genset di gang perumahan padat penduduk dengan teknologi peredam ganda sehingga tetangga sekitar tidak terganggu suara deru mesin sama sekali.',
    highlightQuote: 'Tetangga memuji karena gensetnya betul-betul senyap, acara syukuran berjalan lancar tanpa keluhan suara.',
    image: 'https://images.unsplash.com/photo-1758810411905-04fb6f9396e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];
