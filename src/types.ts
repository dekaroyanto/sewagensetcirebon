export type ProductType = 'genset' | 'ac' | 'paket' | 'aksesoris';
export type ProductCategory = ProductType | 'small' | 'medium' | 'large' | 'heavy';

export interface Product {
  id: string; // UUID (Primary Key)
  name: string; // VARCHAR(150)
  product_type: ProductType; // ENUM('genset', 'ac', 'paket', 'aksesoris')
  price: number; // DECIMAL(12,2)
  image_url: string; // TEXT
  description: string; // TEXT (textarea containing specs & full details)
  image?: string;
  phase?: string;
  tag?: string;
  categoryLabel?: string;
  startingPriceEstimate?: number;
  is_available?: boolean;
  sort_order?: number;
}

export type GensetProduct = Product;

export interface BookingFormData {
  fullName: string;
  companyOrEvent: string;
  phone: string;
  // Genset unit selection
  selectedGensetId: string;
  selectedGensetName: string;
  gensetQuantity: number;
  gensetDuration: string;
  // AC unit selection
  selectedAcId: string;
  selectedAcName: string;
  acQuantity: number;
  acDuration: string;
  // Event & Schedule
  startDate: string;
  startTime: string;
  eventLocation: string;
  // Notes
  notes: string;

  // Legacy / optional fields for backwards compatibility
  unitQuantity?: number;
  rentalType?: string;
  duration?: string;
  districtCirebon?: string;
  packageType?: string;
  additionalNeeds?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: 'Tips & Panduan' | 'Seputar Genset' | 'Event & Proyek' | 'Berita Cirebon';
  product_type?: string;
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

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

export interface DashboardStats {
  total_genset: number;
  total_ac: number;
  total_products: number;
  total_bookings: number;
  pending_bookings: number;
  total_blogs: number;
  total_testimonials: number;
  total_gallery: number;
}

export type BookingStatus = 'Menunggu Konfirmasi' | 'Dikonfirmasi' | 'Sedang Berjalan' | 'Selesai' | 'Dibatalkan';

export interface BookingRecord {
  id: number;
  booking_code: string;
  full_name: string;
  company_or_event?: string;
  phone: string;
  selected_genset_id?: string;
  selected_genset_name?: string;
  genset_quantity?: number;
  genset_duration?: string;
  selected_ac_id?: string;
  selected_ac_name?: string;
  ac_quantity?: number;
  ac_duration?: string;
  unit_quantity: number;
  rental_type?: string;
  start_date: string;
  start_time: string;
  duration?: string;
  event_location: string;
  district_cirebon?: string;
  package_type?: string;
  additional_needs?: string[];
  notes?: string;
  status: BookingStatus;
  created_at?: string;
}

export interface CompanySettings {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  operatingHours: string;
  emergencyAvailable: boolean;
  instagram?: string;
  facebook?: string;
}

export interface MediaFileItem {
  name: string;
  size: number;
  size_formatted: string;
  url: string;
  modified: string;
  is_used: boolean;
  used_in: string[];
}

export interface MediaStorageStats {
  total_files: number;
  total_bytes: number;
  total_formatted: string;
  used_files: number;
  used_bytes: number;
  used_formatted: string;
  unused_files: number;
  unused_bytes: number;
  unused_formatted: string;
}

export interface MediaScanResponse {
  status: 'success' | 'error';
  message?: string;
  stats: MediaStorageStats;
  files: MediaFileItem[];
  unused_files: MediaFileItem[];
  used_files: MediaFileItem[];
}

export interface MediaCleanupResponse {
  status: 'success' | 'error';
  message: string;
  deleted_count: number;
  freed_bytes: number;
  freed_formatted: string;
  deleted_files: string[];
  skipped_count?: number;
  skipped_files?: string[];
}


