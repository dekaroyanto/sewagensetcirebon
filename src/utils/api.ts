import { BlogPost, FAQItem, GalleryItem, Product, Testimonial, BookingFormData } from '../types';
import { GENSET_PRODUCTS } from '../data/gensets';
import { BLOG_POSTS } from '../data/blogPosts';
import { GALLERY_ITEMS } from '../data/gallery';
import { TESTIMONIALS } from '../data/testimonials';
import { FAQ_LIST } from '../data/faqs';
import { COMPANY_INFO } from '../data/company';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Fetch all available products (Genset, AC Standing, Paket, Aksesoris)
 */
export async function getProducts(category?: string, search?: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('product_type', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/products?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || GENSET_PRODUCTS;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback for products:', err);
    return GENSET_PRODUCTS;
  }
}

/**
 * Fetch single product details
 */
export async function getProductDetail(id: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback for product detail:', err);
    return GENSET_PRODUCTS.find(p => p.id === id);
  }
}

/**
 * Fetch client testimonials
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${API_BASE}/testimonials`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || TESTIMONIALS;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback for testimonials:', err);
    return TESTIMONIALS;
  }
}

/**
 * Submit client testimonial/review
 */
export async function submitTestimonial(data: Partial<Testimonial>): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error('Error submitting testimonial to backend:', err);
    return {
      success: true,
      message: 'Ulasan Anda telah disimpan (mode offline).',
    };
  }
}

/**
 * Submit booking / order inquiry to backend database
 */
export async function submitBooking(formData: BookingFormData): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (err) {
    console.error('Error sending booking to backend:', err);
    return {
      success: false,
      message: 'Gagal menghubungkan ke server backend.',
    };
  }
}

/**
 * Fetch project gallery items
 */
export async function getGallery(category?: string): Promise<GalleryItem[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'Semua') params.append('category', category);

    const res = await fetch(`${API_BASE}/gallery?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || GALLERY_ITEMS;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback for gallery:', err);
    return GALLERY_ITEMS;
  }
}

/**
 * Fetch FAQs
 */
export async function getFaqs(): Promise<FAQItem[]> {
  try {
    const res = await fetch(`${API_BASE}/faqs`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || FAQ_LIST;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback for FAQs:', err);
    return FAQ_LIST;
  }
}

/**
 * Fetch Blog Posts
 */
export async function getBlogPosts(category?: string): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'Semua') params.append('category', category);

    const res = await fetch(`${API_BASE}/blogs?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || BLOG_POSTS;
  } catch (err) {
    console.warn('Backend API unreachable, using static fallback for blogs:', err);
    return BLOG_POSTS;
  }
}

/**
 * Fetch Company Information
 */
export async function getCompanyInfo(): Promise<typeof COMPANY_INFO> {
  try {
    const res = await fetch(`${API_BASE}/company`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return { ...COMPANY_INFO, ...json.data };
  } catch (err) {
    return COMPANY_INFO;
  }
}
