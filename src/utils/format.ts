import { ProductType } from "../types";

/**
 * Format price in Indonesian Rupiah (DECIMAL to IDR format)
 * Returns 'Harga Negotiable' for UI display to hide exact prices
 */
export function formatPrice(price: number): string {
  if (!price || price <= 0) return "Hubungi WA";
  return "Rp " + Number(price).toLocaleString("id-ID");
}

/**
 * Format raw number to Indonesian Rupiah currency string
 */
export function formatCurrency(price: number): string {
  if (!price || price <= 0) return "Hubungi WA";
  return "Rp " + Number(price).toLocaleString("id-ID");
}

/**
 * Get human-readable label for product_type ENUM
 */
export function getProductTypeLabel(type: ProductType | string): string {
  switch (type) {
    case "genset":
      return "Genset Silent";
    case "ac":
      return "AC Standing & Pendingin";
    case "paket":
      return "Paket Wedding";
    case "aksesoris":
      return "Aksesoris & Distribusi";
    default:
      return "Unit Sewa";
  }
}

/**
 * Get UI badge styling for product_type ENUM
 */
export function getProductTypeBadge(type: ProductType | string): {
  label: string;
  badgeClass: string;
  dotColor: string;
} {
  switch (type) {
    case "genset":
      return {
        label: "Genset Silent",
        badgeClass: "bg-amber-500 text-slate-950 font-bold",
        dotColor: "bg-amber-400",
      };
    case "ac":
      return {
        label: "AC Standing",
        badgeClass: "bg-cyan-500 text-slate-950 font-bold",
        dotColor: "bg-cyan-400",
      };
    case "paket":
      return {
        label: "Paket Wedding",
        badgeClass: "bg-purple-600 text-white font-bold",
        dotColor: "bg-purple-400",
      };
    case "aksesoris":
      return {
        label: "Aksesoris & Panel",
        badgeClass: "bg-blue-600 text-white font-bold",
        dotColor: "bg-blue-400",
      };
    default:
      return {
        label: "Unit Sewa",
        badgeClass: "bg-slate-700 text-white font-bold",
        dotColor: "bg-slate-400",
      };
  }
}

const MONTHS_INDONESIAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * Format string tanggal ke format standar Indonesia: "tanggal bulan tahun"
 * Contoh: "2026-10-15" -> "15 Oktober 2026"
 */
export function formatDateIndonesian(dateStr?: string | null): string {
  if (!dateStr) return "-";
  const str = String(dateStr).trim();
  if (!str) return "-";

  // Check if string matches YYYY-MM-DD pattern at start (handles YYYY-MM-DD and YYYY-MM-DD HH:MM:SS / ISO)
  const ymdMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const monthIdx = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    if (monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
      return `${day} ${MONTHS_INDONESIAN[monthIdx]} ${year}`;
    }
  }

  // Check if string matches DD-MM-YYYY pattern
  const dmyMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const monthIdx = parseInt(dmyMatch[2], 10) - 1;
    const year = dmyMatch[3];
    if (monthIdx >= 0 && monthIdx < 12 && !isNaN(day)) {
      return `${day} ${MONTHS_INDONESIAN[monthIdx]} ${year}`;
    }
  }

  // Check standard JavaScript Date parsing if string contains separators
  if (str.includes("-") || str.includes("/") || str.includes(",")) {
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      const day = parsed.getDate();
      const monthIdx = parsed.getMonth();
      const year = parsed.getFullYear();
      return `${day} ${MONTHS_INDONESIAN[monthIdx]} ${year}`;
    }
  }

  return str;
}
