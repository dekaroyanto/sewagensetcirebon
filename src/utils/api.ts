import { 
  BlogPost, 
  FAQItem, 
  GalleryItem, 
  Product, 
  Testimonial, 
  BookingFormData, 
  BookingRecord, 
  DashboardStats,
  AdminUser,
  CompanySettings
} from '../types';
import { GENSET_PRODUCTS } from '../data/gensets';
import { BLOG_POSTS } from '../data/blogPosts';
import { GALLERY_ITEMS } from '../data/gallery';
import { TESTIMONIALS } from '../data/testimonials';
import { FAQ_LIST } from '../data/faqs';
import { COMPANY_INFO } from '../data/company';

// Di Hostinger, /api mengakses public_html/api/index.php secara langsung
export const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Global event dispatcher to automatically notify all components to re-fetch latest data
 */
export function notifyDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sgc_data_changed', { detail: { timestamp: Date.now() } }));
  }
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('sgc_admin_token');
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// =============================================================================
// PUBLIC FRONTEND API CALLS (DENGAN ANTI-CACHE & REAL-TIME REFETCH)
// =============================================================================

/**
 * Mengambil semua katalog produk (Genset, AC Standing, Paket, Aksesoris)
 */
export async function getProducts(category?: string, search?: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('product_type', category);
    if (search) params.append('search', search);
    params.append('_t', Date.now().toString());

    const res = await fetch(`${API_BASE}/products?${params.toString()}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { return GENSET_PRODUCTS; }
    return json.data || GENSET_PRODUCTS;
  } catch (err) {
    console.warn('Backend API belum terhubung atau offline, menggunakan fallback static:', err);
    return GENSET_PRODUCTS;
  }
}

/**
 * Mengambil rincian spesifikasi 1 produk
 */
export async function getProductDetail(id: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}?_t=${Date.now()}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { return GENSET_PRODUCTS.find(p => p.id === id); }
    return json.data;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback for product detail:', err);
    return GENSET_PRODUCTS.find(p => p.id === id);
  }
}

/**
 * Mengambil testimoni klien yang terverifikasi
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${API_BASE}/testimonials?_t=${Date.now()}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { return TESTIMONIALS; }
    return json.data || TESTIMONIALS;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback for testimonials:', err);
    return TESTIMONIALS;
  }
}

/**
 * Mengirim ulasan / testimoni baru dari pengunjung web
 */
export async function submitTestimonial(data: Partial<Testimonial>): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const text = await res.text();
    let result: any = { success: true, message: 'Ulasan Anda telah dicatat.' };
    try { result = JSON.parse(text); } catch {}
    if (result.success !== false) notifyDataChanged();
    return result;
  } catch (err) {
    console.error('Error submitting testimonial to backend:', err);
    return {
      success: true,
      message: 'Ulasan Anda telah dicatat.',
    };
  }
}

/**
 * Menyimpan order / booking ke database MySQL Hostinger
 */
export async function submitBooking(formData: BookingFormData): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });
    const text = await res.text();
    let result: any = null;
    try { result = JSON.parse(text); } catch {
      result = { success: res.ok, message: 'Pesanan telah diterima.' };
    }
    if (result.success !== false) notifyDataChanged();
    return result;
  } catch (err) {
    console.error('Error sending booking to backend:', err);
    return {
      success: false,
      message: 'Gagal menghubungkan ke server database MySQL Hostinger.',
    };
  }
}

/**
 * Mengambil galeri foto dokumentasi proyek/acara
 */
export async function getGallery(category?: string): Promise<GalleryItem[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'Semua') params.append('category', category);
    params.append('_t', Date.now().toString());

    const res = await fetch(`${API_BASE}/gallery?${params.toString()}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { return GALLERY_ITEMS; }
    return json.data || GALLERY_ITEMS;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback for gallery:', err);
    return GALLERY_ITEMS;
  }
}

/**
 * Mengambil daftar FAQ
 */
export async function getFaqs(): Promise<FAQItem[]> {
  try {
    const res = await fetch(`${API_BASE}/faqs?_t=${Date.now()}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { return FAQ_LIST; }
    return json.data || FAQ_LIST;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback for FAQs:', err);
    return FAQ_LIST;
  }
}

/**
 * Mengambil artikel berita & edukasi
 */
export async function getBlogPosts(category?: string): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'Semua') params.append('category', category);
    params.append('_t', Date.now().toString());

    const res = await fetch(`${API_BASE}/blogs?${params.toString()}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { return BLOG_POSTS; }
    return json.data || BLOG_POSTS;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback for blogs:', err);
    return BLOG_POSTS;
  }
}

/**
 * Mengambil informasi kontak dan profil perusahaan
 */
export async function getCompanyInfo(): Promise<typeof COMPANY_INFO> {
  try {
    const res = await fetch(`${API_BASE}/company?_t=${Date.now()}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { return COMPANY_INFO; }
    return { ...COMPANY_INFO, ...json.data };
  } catch (err) {
    return COMPANY_INFO;
  }
}

// =============================================================================
// ADMIN PORTAL & CRUD OPERATIONS (DENGAN SINKRONISASI REAL-TIME)
// =============================================================================

/**
 * Login Admin ke backend
 */
export async function loginAdmin(username: string, password: string): Promise<{ success: boolean; token?: string; user?: AdminUser; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      return {
        success: false,
        message: 'Backend API belum ter-deploy di server atau belum merespons JSON (Status HTTP ' + res.status + '). Pastikan file public/api/ sudah dipush ke GitHub dan ter-deploy di Hostinger.'
      };
    }

    if (res.ok && json.token) {
      localStorage.setItem('sgc_admin_token', json.token);
      localStorage.setItem('sgc_admin_user', JSON.stringify(json.user));
      return { success: true, token: json.token, user: json.user };
    }
    return { success: false, message: json.message || 'Login gagal.' };
  } catch (err: any) {
    return { success: false, message: 'Tidak dapat terhubung ke server backend API Hostinger: ' + err.message };
  }
}

/**
 * Cek sesi admin yang sedang login
 */
export async function checkAdminAuth(): Promise<AdminUser | null> {
  const token = localStorage.getItem('sgc_admin_token');
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me?_t=${Date.now()}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) {
      localStorage.removeItem('sgc_admin_token');
      localStorage.removeItem('sgc_admin_user');
      return null;
    }
    const text = await res.text();
    const json = JSON.parse(text);
    return json.user;
  } catch (err) {
    return null;
  }
}

/**
 * Logout admin
 */
export function logoutAdmin() {
  localStorage.removeItem('sgc_admin_token');
  localStorage.removeItem('sgc_admin_user');
}

/**
 * Mengambil ringkasan statistik dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await fetch(`${API_BASE}/stats?_t=${Date.now()}`, { 
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Status: ' + res.status);
    const text = await res.text();
    const json = JSON.parse(text);
    return json.data;
  } catch (err) {
    return {
      total_genset: 6,
      total_ac: 3,
      total_products: 11,
      total_bookings: 2,
      pending_bookings: 1,
      total_blogs: 3,
      total_testimonials: 6,
      total_gallery: 4
    };
  }
}

/**
 * Cek koneksi live ke MySQL Hostinger
 */
export async function testDatabaseConnection(): Promise<{ connected: boolean; message: string; database?: string; tables_count?: number; config?: any }> {
  try {
    const res = await fetch(`${API_BASE}/test-db?_t=${Date.now()}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      return {
        connected: false,
        message: 'Endpoint backend API belum ter-deploy di server Hostinger (Status HTTP ' + res.status + '). Silakan push ke GitHub terlebih dahulu.'
      };
    }
    return {
      connected: json.connected ?? (res.ok && json.status === 'success'),
      message: json.message || (res.ok ? 'Koneksi sukses' : 'Koneksi gagal'),
      database: json.database,
      tables_count: json.tables_count,
      config: json.config
    };
  } catch (err: any) {
    return {
      connected: false,
      message: 'Gagal menghubungi server API: ' + err.message
    };
  }
}

/**
 * Eksekusi inisialisasi tabel otomatis (setup.php)
 */
export async function runDatabaseSetup(): Promise<{ success: boolean; message: string; tables?: string[] }> {
  try {
    const res = await fetch(`${API_BASE}/setup`, { 
      method: 'POST', 
      headers: getAuthHeaders() 
    });
    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      return {
        success: false,
        message: 'Setup script belum tersedia di server Hostinger (Status HTTP ' + res.status + '). Silakan push ke GitHub terlebih dahulu.'
      };
    }
    if (json.success !== false) notifyDataChanged();
    return {
      success: json.success ?? res.ok,
      message: json.message,
      tables: json.tables
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Gagal mengeksekusi setup: ' + err.message
    };
  }
}

// -----------------------------------------------------------------------------
// HELPER: SAFE JSON PARSER UNTUK RESPONSE MUTASI
// -----------------------------------------------------------------------------
async function parseResponseJson(res: Response, defaultSuccessMsg: string = 'Operasi berhasil'): Promise<any> {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return json;
  } catch {
    return {
      success: res.ok,
      message: res.ok ? defaultSuccessMsg : `Respons server tidak valid (HTTP ${res.status})`
    };
  }
}

// -----------------------------------------------------------------------------
// CRUD PRODUK & GENSET
// -----------------------------------------------------------------------------
export async function createProduct(product: Partial<Product>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    const json = await parseResponseJson(res, 'Produk berhasil ditambahkan.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    const json = await parseResponseJson(res, 'Produk berhasil diperbarui.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await parseResponseJson(res, 'Produk berhasil dihapus.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

// -----------------------------------------------------------------------------
// CRUD DATA BOOKING
// -----------------------------------------------------------------------------
export async function getBookings(status?: string): Promise<BookingRecord[]> {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'Semua') params.append('status', status);
    params.append('_t', Date.now().toString());

    const res = await fetch(`${API_BASE}/bookings?${params.toString()}`, { 
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('HTTP error: ' + res.status);
    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { return []; }
    return json.data || [];
  } catch (err) {
    console.warn('Gagal memuat booking:', err);
    return [];
  }
}

export async function updateBookingStatus(id: number | string, status: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const json = await parseResponseJson(res, 'Status pesanan berhasil diubah.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

export async function deleteBooking(id: number | string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await parseResponseJson(res, 'Pesanan berhasil dihapus.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

// -----------------------------------------------------------------------------
// CRUD ARTIKEL & BLOG
// -----------------------------------------------------------------------------
export async function createBlogPost(post: Partial<BlogPost>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(post)
    });
    const json = await parseResponseJson(res, 'Artikel berhasil diterbitkan.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(post)
    });
    const json = await parseResponseJson(res, 'Artikel berhasil diperbarui.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await parseResponseJson(res, 'Artikel berhasil dihapus.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

// -----------------------------------------------------------------------------
// CRUD PORTOFOLIO / GALERI
// -----------------------------------------------------------------------------
export async function createGalleryItem(item: Partial<GalleryItem>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const json = await parseResponseJson(res, 'Portofolio berhasil ditambahkan.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

export async function updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const json = await parseResponseJson(res, 'Portofolio berhasil diperbarui.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

export async function deleteGalleryItem(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await parseResponseJson(res, 'Portofolio berhasil dihapus.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

// -----------------------------------------------------------------------------
// CRUD TESTIMONI
// -----------------------------------------------------------------------------
export async function createTestimonialAdmin(data: Partial<Testimonial>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const json = await parseResponseJson(res, 'Testimoni berhasil ditambahkan.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const json = await parseResponseJson(res, 'Testimoni berhasil diperbarui.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

export async function deleteTestimonial(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await parseResponseJson(res, 'Testimoni berhasil dihapus.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

// -----------------------------------------------------------------------------
// CRUD FAQS
// -----------------------------------------------------------------------------
export async function createFaq(data: Partial<FAQItem>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/faqs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const json = await parseResponseJson(res, 'FAQ berhasil ditambahkan.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

export async function updateFaq(id: string, data: Partial<FAQItem>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/faqs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const json = await parseResponseJson(res, 'FAQ berhasil diperbarui.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

export async function deleteFaq(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/faqs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await parseResponseJson(res, 'FAQ berhasil dihapus.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}

// -----------------------------------------------------------------------------
// UPDATE INFORMASI PERUSAHAAN
// -----------------------------------------------------------------------------
export async function updateCompanySettings(data: Partial<CompanySettings>): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/company`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const json = await parseResponseJson(res, 'Pengaturan perusahaan berhasil disimpan.');
    if (json.success !== false) notifyDataChanged();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Koneksi gagal' };
  }
}
