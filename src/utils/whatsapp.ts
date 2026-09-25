import { BookingFormData, GensetProduct } from '../types';
import { COMPANY_INFO } from '../data/company';

/**
 * Builds a structured, professional WhatsApp message from the booking form.
 */
export function generateBookingWhatsAppMessage(data: BookingFormData): string {
  const needsText = data.additionalNeeds.length > 0 
    ? data.additionalNeeds.map(item => `  - ${item}`).join('\n')
    : '  - Tidak ada (Paket Standar)';

  const message = `*FORMULIR PEMESANAN SEWA GENSET & AC*
*${COMPANY_INFO.name.toUpperCase()}*
--------------------------------------------------
Halo Admin Sewa Genset & AC Cirebon, saya ingin melakukan pemesanan sewa dengan rincian berikut:

📋 *DATA PENYEWA / PIC:*
• Nama Lengkap: *${data.fullName || '-'}*
• Instansi / Acara: *${data.companyOrEvent || '-'}*
• No. WhatsApp / HP: *${data.phone || '-'}*

⚡ *DETAIL UNIT & LAYANAN:*
• Pilihan Unit / Paket: *${data.selectedGensetName || 'Genset Silent / AC'}*
• Jumlah Unit: *${data.unitQuantity} Unit*
• Jenis Sewa: *${data.rentalType}*
• Durasi Pemakaian: *${data.duration || '-'}*
• Paket Layanan: *${data.packageType}*

📍 *LOKASI & JADWAL ACARA:*
• Tanggal Mulai: *${data.startDate || '-'}*
• Jam Mulai: *${data.startTime || '-'} WIB*
• Wilayah / Kecamatan: *${data.districtCirebon || '-'}*
• Alamat Lengkap: ${data.eventLocation || '-'}

🛠️ *KEBUTUHAN TAMBAHAN:*
${needsText}

📝 *CATATAN / PERMINTAAN KHUSUS:*
${data.notes ? `"${data.notes}"` : '-'}

--------------------------------------------------
Mohon konfirmasi ketersediaan unit dan rincian total penawaran resminya. Terima kasih! 🙏`;

  return message;
}

/**
 * Creates the full wa.me link for the booking message.
 */
export function getWhatsAppBookingUrl(data: BookingFormData): string {
  const message = generateBookingWhatsAppMessage(data);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encoded}`;
}

/**
 * Creates a quick WhatsApp URL for a specific genset or AC product.
 */
export function getProductQuickWhatsAppUrl(product: GensetProduct): string {
  const isAc = product.product_type === 'ac';
  const isPaket = product.product_type === 'paket';
  const isAksesoris = product.product_type === 'aksesoris';

  let typeLabel = 'Genset Silent';
  if (isAc) typeLabel = 'AC Standing & Pendingin';
  if (isPaket) typeLabel = 'Paket Wedding Bundling';
  if (isAksesoris) typeLabel = 'Aksesoris & Distribusi Listrik';

  const priceText = product.price > 0
    ? `Rp ${new Intl.NumberFormat('id-ID').format(product.price)} / Hari`
    : (product.startingPriceEstimate ? `Mulai Rp ${new Intl.NumberFormat('id-ID').format(product.startingPriceEstimate)}` : 'Hubungi Admin');

  const message = `Halo Admin *${COMPANY_INFO.name}*, saya tertarik untuk sewa unit berikut:

*${product.name}*
• Kategori: ${typeLabel}
• Estimasi Tarif: ${priceText}

Apakah unit ini tersedia untuk tanggal acara saya di wilayah Cirebon? Mohon info rincian ketersediaan dan penawarannya. Terima kasih! 🙏`;

  return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(message)}`;
}

export const getProductWhatsAppUrl = getProductQuickWhatsAppUrl;

/**
 * General quick consultation URL.
 */
export function getGeneralWhatsAppUrl(customTopic?: string): string {
  const text = customTopic
    ? `Halo Admin *${COMPANY_INFO.name}*, saya ingin konsultasi mengenai: ${customTopic}`
    : `Halo Admin *${COMPANY_INFO.name}*, saya ingin konsultasi sewa genset silent / AC standing untuk acara di Cirebon. Mohon info ketersediaan unit dan rekomendasinya. Terima kasih!`;

  return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`;
}

/**
 * Creates a prefilled WhatsApp inquiry URL for a specific portfolio project.
 */
export function getPortfolioWhatsAppUrl(item: { title: string; location: string; gensetUsed: string; category: string }): string {
  const message = `Halo Admin *${COMPANY_INFO.name}*, saya melihat dokumentasi portofolio acara Anda:

*${item.title}*
• Lokasi: ${item.location}
• Unit Digunakan: ${item.gensetUsed}
• Kategori: ${item.category}

Saya berencana mengadakan acara / memiliki kebutuhan serupa di wilayah Cirebon & sekitarnya. Mohon info rekomendasi unit dan estimasi biayanya. Terima kasih! 🙏`;

  return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(message)}`;
}

/**
 * Copies text to clipboard and returns success boolean.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textarea);
    return result;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

