export type ProductType = 'genset' | 'ac' | 'paket' | 'aksesoris';
export type ProductCategory = ProductType | 'small' | 'medium' | 'large' | 'heavy';

export interface Product {
  id: string; // UUID (Primary Key)
  name: string; // VARCHAR(150)
  product_type: ProductType; // ENUM('genset', 'ac', 'paket', 'aksesoris')
  price: number; // DECIMAL(12,2)
  image_url: string; // TEXT
  description: string; // TEXT (textarea containing specs & full details)
  created_at?: string; // TIMESTAMP
  updated_at?: string; // TIMESTAMP

  // Helper & transition aliases for seamless UI compatibility:
  category?: 'small' | 'medium' | 'large' | 'heavy' | 'ac' | 'paket' | 'aksesoris';
  categoryLabel?: string;
  image?: string; // alias to image_url
  startingPriceEstimate?: string;
  tag?: string;
  kva?: number;
  kw?: number;
  pk?: number;
  btu?: string;
  phase?: string;
  engineBrand?: string;
  alternatorBrand?: string;
  fuelType?: string;
  fuelConsumption?: string;
  noiseLevel?: string;
  dimensions?: string;
  weight?: string;
  tankCapacity?: string;
  idealFor?: string[];
  features?: string[];
  includedItems?: string[];
}

export type GensetProduct = Product;

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
