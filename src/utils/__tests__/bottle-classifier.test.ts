/**
 * Unit Tests for Bottle Classifier Utility
 * Tests classification logic for different bottle weights
 */

import {
  classifyBottle,
  isValidBottleWeight,
  BOTTLE_CATEGORIES,
  BottleType,
} from '@/utils/bottle-classifier';

describe('Bottle Classifier Utility', () => {
  describe('BOTTLE_CATEGORIES constant', () => {
    it('should have all three bottle categories defined', () => {
      expect(BOTTLE_CATEGORIES).toHaveProperty('KECIL');
      expect(BOTTLE_CATEGORIES).toHaveProperty('SEDANG');
      expect(BOTTLE_CATEGORIES).toHaveProperty('BESAR');
    });

    it('should have correct properties for BOTOL KECIL', () => {
      const kecil = BOTTLE_CATEGORIES.KECIL;
      expect(kecil.name).toBe('BOTOL KECIL');
      expect(kecil.minWeight).toBe(12.5);
      expect(kecil.maxWeight).toBe(18);
      expect(kecil.points).toBe(5);
      expect(kecil.color).toBe('#3B82F6');
    });

    it('should have correct properties for BOTOL SEDANG', () => {
      const sedang = BOTTLE_CATEGORIES.SEDANG;
      expect(sedang.name).toBe('BOTOL SEDANG');
      expect(sedang.minWeight).toBe(20);
      expect(sedang.maxWeight).toBe(23);
      expect(sedang.points).toBe(10);
      expect(sedang.color).toBe('#10B981');
    });

    it('should have correct properties for BOTOL BESAR', () => {
      const besar = BOTTLE_CATEGORIES.BESAR;
      expect(besar.name).toBe('BOTOL BESAR');
      expect(besar.minWeight).toBe(25);
      expect(besar.maxWeight).toBe(28);
      expect(besar.points).toBe(15);
      expect(besar.color).toBe('#F59E0B');
    });
  });

  describe('isValidBottleWeight function', () => {
    it('should return true for valid KECIL weight', () => {
      expect(isValidBottleWeight(12.5)).toBe(true);
      expect(isValidBottleWeight(15)).toBe(true);
      expect(isValidBottleWeight(18)).toBe(true);
    });

    it('should return true for valid SEDANG weight', () => {
      expect(isValidBottleWeight(20)).toBe(true);
      expect(isValidBottleWeight(21.5)).toBe(true);
      expect(isValidBottleWeight(23)).toBe(true);
    });

    it('should return true for valid BESAR weight', () => {
      expect(isValidBottleWeight(25)).toBe(true);
      expect(isValidBottleWeight(26.5)).toBe(true);
      expect(isValidBottleWeight(28)).toBe(true);
    });

    it('should return false for invalid weights', () => {
      expect(isValidBottleWeight(10)).toBe(false);
      expect(isValidBottleWeight(19)).toBe(false);
      expect(isValidBottleWeight(24)).toBe(false);
      expect(isValidBottleWeight(30)).toBe(false);
    });

    it('should return false for zero and negative weights', () => {
      expect(isValidBottleWeight(0)).toBe(false);
      expect(isValidBottleWeight(-5)).toBe(false);
    });

    it('should return false for null and undefined', () => {
      expect(isValidBottleWeight(null as any)).toBe(false);
      expect(isValidBottleWeight(undefined as any)).toBe(false);
    });
  });

  describe('classifyBottle function', () => {
    describe('Success cases - BOTOL KECIL', () => {
      it('should classify 15 gram as BOTOL KECIL', () => {
        const result = classifyBottle(15);
        expect(result.success).toBe(true);
        expect(result.bottleType).toBe('KECIL');
        expect(result.categoryName).toBe('BOTOL KECIL');
        expect(result.points).toBe(5);
        expect(result.color).toBe('#3B82F6');
      });

      it('should classify minimum weight KECIL (12.5) correctly', () => {
        const result = classifyBottle(12.5);
        expect(result.success).toBe(true);
        expect(result.bottleType).toBe('KECIL');
        expect(result.points).toBe(5);
      });

      it('should classify maximum weight KECIL (18) correctly', () => {
        const result = classifyBottle(18);
        expect(result.success).toBe(true);
        expect(result.bottleType).toBe('KECIL');
        expect(result.points).toBe(5);
      });
    });

    describe('Success cases - BOTOL SEDANG', () => {
      it('should classify 21.5 gram as BOTOL SEDANG', () => {
        const result = classifyBottle(21.5);
        expect(result.success).toBe(true);
        expect(result.bottleType).toBe('SEDANG');
        expect(result.categoryName).toBe('BOTOL SEDANG');
        expect(result.points).toBe(10);
        expect(result.color).toBe('#10B981');
      });

      it('should classify minimum weight SEDANG (20) correctly', () => {
        const result = classifyBottle(20);
        expect(result.success).toBe(true);
        expect(result.bottleType).toBe('SEDANG');
        expect(result.points).toBe(10);
      });

      it('should classify maximum weight SEDANG (23) correctly', () => {
        const result = classifyBottle(23);
        expect(result.success).toBe(true);
        expect(result.bottleType).toBe('SEDANG');
        expect(result.points).toBe(10);
      });
    });

    describe('Success cases - BOTOL BESAR', () => {
      it('should classify 26.5 gram as BOTOL BESAR', () => {
        const result = classifyBottle(26.5);
        expect(result.success).toBe(true);
        expect(result.bottleType).toBe('BESAR');
        expect(result.categoryName).toBe('BOTOL BESAR');
        expect(result.points).toBe(15);
        expect(result.color).toBe('#F59E0B');
      });

      it('should classify minimum weight BESAR (25) correctly', () => {
        const result = classifyBottle(25);
        expect(result.success).toBe(true);
        expect(result.bottleType).toBe('BESAR');
        expect(result.points).toBe(15);
      });

      it('should classify maximum weight BESAR (28) correctly', () => {
        const result = classifyBottle(28);
        expect(result.success).toBe(true);
        expect(result.bottleType).toBe('BESAR');
        expect(result.points).toBe(15);
      });
    });

    describe('Error cases - Invalid input', () => {
      it('should return error for zero weight', () => {
        const result = classifyBottle(0);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error).toContain('tidak valid');
      });

      it('should return error for negative weight', () => {
        const result = classifyBottle(-5);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('should return error for null', () => {
        const result = classifyBottle(null as any);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('should return error for undefined', () => {
        const result = classifyBottle(undefined as any);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('should return error for non-numeric input', () => {
        const result = classifyBottle('15' as any);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('Error cases - Out of range weights', () => {
      it('should return error for weight too low (below KECIL minimum)', () => {
        const result = classifyBottle(10);
        expect(result.success).toBe(false);
        expect(result.error).toContain('tidak sesuai kategori');
      });

      it('should return error for weight in gap between KECIL and SEDANG', () => {
        const result = classifyBottle(19);
        expect(result.success).toBe(false);
        expect(result.error).toContain('tidak sesuai kategori');
      });

      it('should return error for weight in gap between SEDANG and BESAR', () => {
        const result = classifyBottle(24);
        expect(result.success).toBe(false);
        expect(result.error).toContain('tidak sesuai kategori');
      });

      it('should return error for weight too high (above BESAR maximum)', () => {
        const result = classifyBottle(30);
        expect(result.success).toBe(false);
        expect(result.error).toContain('tidak sesuai kategori');
      });
    });

    describe('Error message format', () => {
      it('should include available categories in error message', () => {
        const result = classifyBottle(50);
        expect(result.error).toContain('Kategori tersedia');
        expect(result.error).toContain('BOTOL KECIL');
        expect(result.error).toContain('BOTOL SEDANG');
        expect(result.error).toContain('BOTOL BESAR');
      });

      it('should include weight in error message', () => {
        const result = classifyBottle(99);
        expect(result.error).toContain('99');
      });
    });

    describe('Edge cases with floating point', () => {
      it('should handle floating point numbers correctly', () => {
        const result1 = classifyBottle(15.123);
        expect(result1.success).toBe(true);
        expect(result1.bottleType).toBe('KECIL');

        const result2 = classifyBottle(21.999);
        expect(result2.success).toBe(true);
        expect(result2.bottleType).toBe('SEDANG');
      });

      it('should handle very small decimals', () => {
        const result = classifyBottle(12.50001);
        expect(result.success).toBe(true);
        expect(result.bottleType).toBe('KECIL');
      });
    });
  });

  describe('Return value structure', () => {
    it('should have required properties on success', () => {
      const result = classifyBottle(15);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('bottleType');
      expect(result).toHaveProperty('categoryName');
      expect(result).toHaveProperty('points');
      expect(result).toHaveProperty('color');
    });

    it('should have error property on failure', () => {
      const result = classifyBottle(50);
      expect(result).toHaveProperty('error');
      expect(result.error).toBeTruthy();
    });

    it('should not have bottleType when failed', () => {
      const result = classifyBottle(50);
      expect(result.bottleType).toBeUndefined();
    });
  });
});
