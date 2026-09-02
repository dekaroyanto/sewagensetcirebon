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
  const isAc = product.category === 'ac';
  const isPaket = product.category === 'paket';

  let specLine = `• Kapasitas: ${product.kva} kVA (${product.kw} kW)`;
  if (isAc) {
    specLine = `• Kapasitas: ${product.pk ? `${product.pk} PK` : 'Kipas Blower'} ${product.btu ? `(${product.btu})` : ''}`;
  } else if (isPaket) {
    specLine = `• Paket: Genset 60 kVA + 4 Unit AC Standing 5 PK`;
  }

  const message = `Halo Admin *${COMPANY_INFO.name}*, saya tertarik untuk sewa unit:

*${product.name}*
${specLine}
• Kategori: ${product.categoryLabel}
• Estimasi Harga: ${product.startingPriceEstimate}

Apakah unit ini tersedia untuk tanggal acara saya di Cirebon? Mohon info rincian ketersediaannya. Terima kasih!`;

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

