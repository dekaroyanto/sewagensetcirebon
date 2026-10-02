/**
 * Opsi Pilihan Unit Genset & AC Manual (Terpisah dari Tabel Katalog Produk)
 * Disesuaikan untuk Frontend, Backend, dan Admin Dashboard Sewa Genset Cirebon
 */

export const GENSET_MANUAL_OPTIONS = [
  'Tanpa Genset',
  '10 KVA',
  '15 KVA',
  '30 KVA',
  '40 KVA',
  '50 KVA',
  '60 KVA',
  '80 KVA',
  '100 KVA',
  '150 KVA',
  '200 KVA',
  '250 KVA',
  '500 KVA',
] as const;

export type GensetManualOption = typeof GENSET_MANUAL_OPTIONS[number];

export const AC_MANUAL_OPTIONS = [
  'Tanpa AC / Pendingin',
  'AC Standing 5 PK',
] as const;

export type AcManualOption = typeof AC_MANUAL_OPTIONS[number];

export const RENTAL_DURATIONS = [
  '1 Hari (8 Jam Operasional)',
  '1 Hari (12 Jam Operasional)',
  '1 Hari (24 Jam Standby Penuh)',
  '2 Hari Acara',
  '3 Hari Acara',
  '1 Minggu (7 Hari)',
  '2 Minggu',
  '1 Bulan (Kontrak Bulanan)',
  'Kontrak Proyek Jangka Panjang'
] as const;

export type RentalDuration = typeof RENTAL_DURATIONS[number];

/**
 * Pemetaan cerdas jika pengguna mengklik "Pilih & Sewa" dari kartu katalog
 */
export function matchGensetOption(val?: string | number | null): GensetManualOption {
  if (!val) return 'Tanpa Genset';
  const str = String(val).trim().toUpperCase();
  if (str.includes('TANPA') || str.includes('TIDAK') || str === '0') return 'Tanpa Genset';

  // Cek exact match
  for (const opt of GENSET_MANUAL_OPTIONS) {
    if (opt.toUpperCase() === str) return opt;
  }

  // Coba ambil angka kVA
  const match = str.match(/(\d+)\s*(?:KVA|KW)?/i);
  if (match) {
    const kvaNum = parseInt(match[1], 10);
    const candidate = `${kvaNum} KVA`;
    if (GENSET_MANUAL_OPTIONS.includes(candidate as any)) {
      return candidate as GensetManualOption;
    }

    // Jika KVA tidak ada di daftar (misal 20 kVA, 45 kVA), cari yang terdekat
    const validKvas = [10, 15, 30, 40, 50, 60, 80, 100, 150, 200, 250, 500];
    let closest = validKvas[0];
    let minDiff = Math.abs(kvaNum - closest);
    for (const k of validKvas) {
      const diff = Math.abs(kvaNum - k);
      if (diff < minDiff) {
        minDiff = diff;
        closest = k;
      }
    }
    return `${closest} KVA` as GensetManualOption;
  }

  return 'Tanpa Genset';
}

/**
 * Pemetaan cerdas jika pengguna memilih AC dari katalog
 */
export function matchAcOption(val?: string | number | null): AcManualOption {
  if (!val) return 'Tanpa AC / Pendingin';
  const str = String(val).trim().toUpperCase();
  if (str.includes('TANPA') || str.includes('TIDAK') || str === '0') return 'Tanpa AC / Pendingin';
  return 'AC Standing 5 PK';
}
