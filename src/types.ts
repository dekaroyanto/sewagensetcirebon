export type ProductCategory = 'genset' | 'ac' | 'paket';

export interface GensetProduct {
  id: string;
  name: string;
  productType?: 'genset' | 'ac' | 'paket';
  kva?: number;
  kw?: number;
  pk?: number; // For AC units (e.g. 3 PK, 5 PK)
  btu?: string; // For AC cooling power (e.g. "45.000 BTU/h")
  phase: '1 Phase (220V)' | '3 Phase (380V)' | '1 & 3 Phase';
  engineBrand: string;
  alternatorBrand?: string;
  fuelType?: 'Solar (Diesel)' | 'Bensin (Gasoline)' | 'Listrik PLN / Genset';
  fuelConsumption?: string; // e.g. "3.5 - 5 Liter / Jam (Beban 75%)"
  noiseLevel: string; // e.g. "62 dB (Jarak 7 Meter)"
  dimensions: string; // e.g. "180 x 85 x 110 cm"
  weight: string; // e.g. "750 kg"
  tankCapacity?: string; // e.g. "65 Liter"
  category: 'small' | 'medium' | 'large' | 'heavy' | 'ac' | 'paket';
  categoryLabel: string;
  tag?: string; // e.g. "Paling Laris", "Rekomendasi Wedding", "Heavy Duty"
  idealFor: string[];
  features: string[];
  includedItems: string[];
  startingPriceEstimate: string; // e.g. "Mulai Rp 600.000 / Hari"
  image: string;
}

export interface BookingFormData {
  fullName: string;
  companyOrEvent: string;
  phone: string;
  selectedGensetId: string;
  selectedGensetName: string;
  unitQuantity: number;
  acQuantity?: number; // Optional count for AC units
  rentalType: 'Harian / Acara' | 'Mingguan' | 'Bulanan' | 'Kontrak Proyek' | 'Darurat / Emergency 24 Jam';
  startDate: string;
  startTime: string;
  duration: string;
  eventLocation: string;
  districtCirebon: string; // e.g. "Kejaksan", "Kesambi", "Sumber", etc.
  packageType: 'Include BBM Solar & Operator' | 'Include Operator Saja (BBM dari Penyewa)' | 'Unit Only (Lepas Kunci - S&K Berlaku)' | 'Paket Sewa AC + Instalasi Dingin';
  additionalNeeds: string[];
  notes: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: 'Tips & Panduan' | 'Seputar Genset' | 'Event & Proyek' | 'Berita Cirebon';
  date: string;
  readTime: string;
  author: string;
  image: string;
  tags: string[];
  content: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  companyOrEvent: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  gensetUsed: string;
  avatarBg: string;
  verified: boolean;
}

export interface FAQItem {
  id: string;
  category: 'Pemesanan & Syarat' | 'Pengiriman & Lokasi' | 'Teknis & Operator' | 'BBM & Biaya' | 'Darurat 24 Jam';
  question: string;
  answer: string;
}

export interface ServiceArea {
  name: string;
  type: 'Kota' | 'Kabupaten';
  subDistricts: string[];
  deliveryEstimate: string;
  featured: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Wedding & Resepsi' | 'Konser & Musik' | 'Proyek & Pembangunan' | 'Pabrik & Industri' | 'Instansi & Pemerintahan';
  location: string;
  gensetUsed: string;
  image: string;
  client?: string;
  duration?: string;
  peakLoad?: string;
  equipmentIncluded?: string[];
  description?: string;
  highlightQuote?: string;
}
