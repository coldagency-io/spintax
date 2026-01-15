import { describe, it, expect } from 'vitest';
import { spin, generate, analyze, validate, extractOptions } from './index';

describe('spintax', () => {
  describe('spin', () => {
    it('should return one of the options', () => {
      const result = spin('{Hello|Hi}');
      expect(['Hello', 'Hi']).toContain(result);
    });

    it('should handle nested spintax', () => {
      const result = spin('{A|B {1|2}}');
      expect(['A', 'B 1', 'B 2']).toContain(result);
    });

    it('should return plain text unchanged', () => {
      expect(spin('Hello world')).toBe('Hello world');
    });
  });

  describe('generate', () => {
    it('should generate specified count of variations', () => {
      const { variations } = generate('{A|B} {1|2}', { count: 3 });
      expect(variations.length).toBeLessThanOrEqual(3);
    });

    it('should generate all combinations in all mode', () => {
      const { variations } = generate('{A|B} {1|2}', { mode: 'all' });
      expect(variations).toHaveLength(4);
      expect(variations).toContain('A 1');
      expect(variations).toContain('A 2');
      expect(variations).toContain('B 1');
      expect(variations).toContain('B 2');
    });

    it('should generate sequential variations', () => {
      const { variations } = generate('{A|B} {1|2}', { mode: 'sequential', count: 2 });
      expect(variations).toEqual(['A 1', 'A 2']);
    });
  });

  describe('analyze', () => {
    it('should count combinations correctly', () => {
      const stats = analyze('{A|B} {1|2|3}');
      expect(stats.totalCombinations).toBe(6);
      expect(stats.spinElements).toBe(2);
    });

    it('should handle nested spintax', () => {
      const stats = analyze('{A|B {1|2}}');
      expect(stats.totalCombinations).toBe(3); // A, B 1, B 2
    });
  });

  describe('validate', () => {
    it('should return true for valid spintax', () => {
      expect(validate('{Hello|Hi}')).toBe(true);
      expect(validate('{A|B {1|2}}')).toBe(true);
      expect(validate('Plain text')).toBe(true);
    });

    it('should return false for invalid spintax', () => {
      expect(validate('{Hello|Hi')).toBe(false);
      expect(validate('Hello}')).toBe(false);
      expect(validate('{{A|B}')).toBe(false);
    });
  });

  describe('extractOptions', () => {
    it('should extract all spin options', () => {
      const options = extractOptions('{Hello|Hi} world {1|2|3}');
      expect(options).toEqual([['Hello', 'Hi'], ['1', '2', '3']]);
    });
  });
});
