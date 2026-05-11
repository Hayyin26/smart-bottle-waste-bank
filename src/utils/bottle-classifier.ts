/**
 * Bottle Classification Utility
 * 
 * Mengklasifikasi botol berdasarkan berat ke dalam 3 kategori:
 * - BOTOL KECIL (12.5-18 gram) = 5 point
 * - BOTOL SEDANG (20-23 gram) = 10 point
 * - BOTOL BESAR (25-28 gram) = 15 point
 */

export type BottleType = 'KECIL' | 'SEDANG' | 'BESAR';

export interface BottleCategory {
  key: BottleType;
  name: string;
  minWeight: number;  // gram
  maxWeight: number;  // gram
  points: number;
  color: string;
}

export interface ClassificationResult {
  success: boolean;
  bottleType?: BottleType;
  categoryName?: string;
  points?: number;
  color?: string;
  error?: string;
}

// Konfigurasi kategori botol
export const BOTTLE_CATEGORIES: Record<BottleType, BottleCategory> = {
  KECIL: {
    key: 'KECIL',
    name: 'BOTOL KECIL',
    minWeight: 12.5,
    maxWeight: 18,
    points: 5,
    color: '#3B82F6', // Blue
  },
  SEDANG: {
    key: 'SEDANG',
    name: 'BOTOL SEDANG',
    minWeight: 20,
    maxWeight: 23,
    points: 10,
    color: '#10B981', // Green
  },
  BESAR: {
    key: 'BESAR',
    name: 'BOTOL BESAR',
    minWeight: 25,
    maxWeight: 28,
    points: 15,
    color: '#F59E0B', // Amber
  },
};

/**
 * Validasi berat botol
 * 
 * @param weight - Berat botol dalam gram
 * @returns true jika valid, false jika tidak
 */
export function isValidBottleWeight(weight: number): boolean {
  if (!weight || weight <= 0) return false;
  
  for (const category of Object.values(BOTTLE_CATEGORIES)) {
    if (weight >= category.minWeight && weight <= category.maxWeight) {
      return true;
    }
  }
  
  return false;
}

/**
 * Klasifikasi botol berdasarkan berat
 * 
 * @param weight - Berat botol dalam gram
 * @returns Hasil klasifikasi dengan kategori, nama, points, dan warna
 * 
 * @example
 * classifyBottle(15) 
 * // Returns: { success: true, bottleType: 'KECIL', categoryName: 'BOTOL KECIL', points: 5, color: '#3B82F6' }
 * 
 * classifyBottle(24)
 * // Returns: { success: false, error: 'Berat botol (24 gram) tidak sesuai kategori...' }
 */
export function classifyBottle(weight: number): ClassificationResult {
  // Validasi input
  if (!weight || typeof weight !== 'number' || weight <= 0) {
    return {
      success: false,
      error: 'Berat botol tidak valid. Masukkan angka positif dalam gram.',
    };
  }

  // Cari kategori yang sesuai
  for (const category of Object.values(BOTTLE_CATEGORIES)) {
    if (weight >= category.minWeight && weight <= category.maxWeight) {
      return {
        success: true,
        bottleType: category.key,
        categoryName: category.name,
        points: category.points,
        color: category.color,
      };
    }
  }

  // Tidak ada kategori yang sesuai
  const availableRanges = Object.values(BOTTLE_CATEGORIES)
    .map((cat) => `- ${cat.name}: ${cat.minWeight} - ${cat.maxWeight} gram`)
    .join('\n');

  return {
    success: false,
    error: `Berat botol (${weight} gram) tidak sesuai kategori.\nKategori tersedia:\n${availableRanges}`,
  };
}

/**
 * Dapatkan kategori botol berdasarkan type
 * 
 * @param bottleType - Tipe botol (KECIL, SEDANG, BESAR)
 * @returns Informasi lengkap kategori
 */
export function getBottleCategory(bottleType: BottleType): BottleCategory | null {
  return BOTTLE_CATEGORIES[bottleType] || null;
}

/**
 * Dapatkan semua kategori botol
 * 
 * @returns Array of categories
 */
export function getAllBottleCategories(): BottleCategory[] {
  return Object.values(BOTTLE_CATEGORIES);
}

/**
 * Hitung points untuk berat botol
 * 
 * @param weight - Berat botol dalam gram
 * @returns Jumlah points atau 0 jika invalid
 */
export function calculatePoints(weight: number): number {
  const result = classifyBottle(weight);
  return result.success ? result.points || 0 : 0;
}

/**
 * Format error message untuk UI
 * 
 * @param weight - Berat botol yang invalid
 * @returns Pesan error yang user-friendly
 */
export function getErrorMessage(weight: number): string {
  const result = classifyBottle(weight);
  return result.error || 'Terjadi kesalahan saat mengklasifikasi botol.';
}

/**
 * Get kategori botol berdasarkan berat
 * Alias untuk classifyBottle yang lebih pendek
 */
export const categorizeBottle = classifyBottle;

/**
 * Validasi range berat untuk kategori tertentu
 * 
 * @param bottleType - Tipe botol
 * @param weight - Berat botol
 * @returns true jika berat sesuai dengan kategori
 */
export function isWeightInCategory(bottleType: BottleType, weight: number): boolean {
  const category = BOTTLE_CATEGORIES[bottleType];
  if (!category) return false;
  return weight >= category.minWeight && weight <= category.maxWeight;
}

/**
 * Get range berat untuk kategori
 * 
 * @param bottleType - Tipe botol
 * @returns String range berat atau null
 */
export function getWeightRange(bottleType: BottleType): string | null {
  const category = BOTTLE_CATEGORIES[bottleType];
  if (!category) return null;
  return `${category.minWeight} - ${category.maxWeight} gram`;
}
