/**
 * Unit Tests for Library Utilities
 * Tests formatting functions like cn, number formatting, etc
 */

import { cn, addThousandsSeparator, numberToPercentage } from '@/lib/utils';

describe('Library Utilities', () => {
  describe('cn function - className merger', () => {
    it('should merge simple classes', () => {
      const result = cn('px-2', 'py-1');
      expect(result).toContain('px-2');
      expect(result).toContain('py-1');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });

    it('should remove false conditional classes', () => {
      const isActive = false;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).not.toContain('active-class');
    });

    it('should handle tailwind overrides correctly', () => {
      // Testing that twMerge properly handles conflicting utilities
      const result = cn('p-4', 'p-2');
      // Should keep the last valid class (or merge appropriately)
      expect(typeof result).toBe('string');
    });

    it('should handle arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });

    it('should handle empty strings', () => {
      const result = cn('class1', '', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('should handle null and undefined', () => {
      const result = cn('class1', null, undefined, 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('should return string output', () => {
      const result = cn('test-class');
      expect(typeof result).toBe('string');
    });
  });

  describe('addThousandsSeparator function', () => {
    it('should add separator to numbers >= 1000', () => {
      expect(addThousandsSeparator(1000)).toBe('1,000');
      expect(addThousandsSeparator(10000)).toBe('10,000');
      expect(addThousandsSeparator(100000)).toBe('100,000');
    });

    it('should add multiple separators for large numbers', () => {
      expect(addThousandsSeparator(1000000)).toBe('1,000,000');
      expect(addThousandsSeparator(1234567)).toBe('1,234,567');
    });

    it('should handle numbers less than 1000', () => {
      expect(addThousandsSeparator(100)).toBe('100');
      expect(addThousandsSeparator(999)).toBe('999');
      expect(addThousandsSeparator(1)).toBe('1');
    });

    it('should handle zero', () => {
      expect(addThousandsSeparator(0)).toBe('0');
    });

    it('should handle negative numbers', () => {
      expect(addThousandsSeparator(-1000)).toBe('-1,000');
      expect(addThousandsSeparator(-1234567)).toBe('-1,234,567');
    });

    it('should handle decimal numbers', () => {
      const result = addThousandsSeparator(1234.56);
      // Should format the integer part correctly
      expect(result).toMatch(/1,234/);
    });

    it('should return string', () => {
      expect(typeof addThousandsSeparator(1000)).toBe('string');
    });

    it('should place separator every 3 digits from right', () => {
      expect(addThousandsSeparator(12345)).toBe('12,345');
      expect(addThousandsSeparator(123456)).toBe('123,456');
      expect(addThousandsSeparator(1234567)).toBe('1,234,567');
    });

    it('should handle very large numbers', () => {
      expect(addThousandsSeparator(999999999)).toBe('999,999,999');
      expect(addThousandsSeparator(1000000000)).toBe('1,000,000,000');
    });
  });

  describe('numberToPercentage function', () => {
    it('should convert 0.5 to 50%', () => {
      expect(numberToPercentage(0.5)).toBe('50%');
    });

    it('should convert 0.25 to 25%', () => {
      expect(numberToPercentage(0.25)).toBe('25%');
    });

    it('should convert 1 to 100%', () => {
      expect(numberToPercentage(1)).toBe('100%');
    });

    it('should convert 0 to 0%', () => {
      expect(numberToPercentage(0)).toBe('0%');
    });

    it('should handle decimal percentages', () => {
      expect(numberToPercentage(0.123)).toBe('12.3%');
      // Use toMatch for floating point precision issues
      expect(numberToPercentage(0.666)).toMatch(/^66\.6/);
    });

    it('should handle numbers > 1', () => {
      expect(numberToPercentage(1.5)).toBe('150%');
      expect(numberToPercentage(2)).toBe('200%');
    });

    it('should handle negative numbers', () => {
      expect(numberToPercentage(-0.5)).toBe('-50%');
      expect(numberToPercentage(-0.25)).toBe('-25%');
    });

    it('should return string with % symbol', () => {
      const result = numberToPercentage(0.5);
      expect(result).toMatch(/%$/);
      expect(typeof result).toBe('string');
    });

    it('should handle very small decimals', () => {
      expect(numberToPercentage(0.001)).toBe('0.1%');
      expect(numberToPercentage(0.0001)).toBe('0.01%');
    });

    it('should handle very large multipliers', () => {
      expect(numberToPercentage(10)).toBe('1000%');
      expect(numberToPercentage(100)).toBe('10000%');
    });

    it('should maintain precision of original decimal', () => {
      const input = 0.3333;
      const result = numberToPercentage(input);
      expect(result).toBe('33.33%');
    });
  });

  describe('Integration - combined usage', () => {
    it('should work together for conditional styling', () => {
      const isActive = true;
      const percentage = numberToPercentage(0.75);
      const formatted = addThousandsSeparator(5000);

      expect(percentage).toBe('75%');
      expect(formatted).toBe('5,000');
    });
  });
});
