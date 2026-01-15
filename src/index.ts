/**
 * @coldagency/spintax - A powerful spintax parser with nested syntax support
 * https://www.coldagency.io/
 */

export interface SpintaxStats {
  /** Total number of possible unique combinations */
  totalCombinations: number;
  /** Number of spin elements (bracketed sections) found */
  spinElements: number;
  /** Average options per spin element */
  averageOptionsPerSpin: number;
}

export interface GenerateOptions {
  /** Number of variations to generate (default: 10) */
  count?: number;
  /** Generation mode */
  mode?: 'random' | 'all' | 'sequential';
}

export interface SpintaxResult {
  /** Generated text variations */
  variations: string[];
  /** Statistics about the spintax */
  stats: SpintaxStats & { generatedCount: number };
}

/**
 * Parse spintax text into segments
 * Supports nested spintax like: {Hello|Hi {there|friend}}
 */
function parseSpintax(text: string): string[][] {
  const segments: string[][] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    const openBrace = text.indexOf('{', currentIndex);

    if (openBrace === -1) {
      segments.push([text.slice(currentIndex)]);
      break;
    }

    if (openBrace > currentIndex) {
      segments.push([text.slice(currentIndex, openBrace)]);
    }

    let depth = 1;
    let closeBrace = openBrace + 1;
    while (closeBrace < text.length && depth > 0) {
      if (text[closeBrace] === '{') depth++;
      if (text[closeBrace] === '}') depth--;
      closeBrace++;
    }
    closeBrace--;

    if (depth !== 0) {
      segments.push([text.slice(openBrace, openBrace + 1)]);
      currentIndex = openBrace + 1;
      continue;
    }

    const content = text.slice(openBrace + 1, closeBrace);
    const options = splitOptions(content);
    segments.push(options);

    currentIndex = closeBrace + 1;
  }

  return segments;
}

/**
 * Split spintax options respecting nested braces
 */
function splitOptions(content: string): string[] {
  const options: string[] = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === '{') {
      depth++;
      current += char;
    } else if (char === '}') {
      depth--;
      current += char;
    } else if (char === '|' && depth === 0) {
      options.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  if (current) {
    options.push(current);
  }

  return options;
}

/**
 * Process nested spintax within an option
 */
function processNestedSpintax(text: string): string[] {
  if (!text.includes('{')) {
    return [text];
  }
  const segments = parseSpintax(text);
  return generateAllCombinations(segments);
}

/**
 * Generate all possible combinations from segments
 */
function generateAllCombinations(segments: string[][]): string[] {
  if (segments.length === 0) return [''];

  const [first, ...rest] = segments;
  const restCombinations = generateAllCombinations(rest);

  const results: string[] = [];
  for (const option of first) {
    const processedOptions = processNestedSpintax(option);
    for (const processed of processedOptions) {
      for (const restCombo of restCombinations) {
        results.push(processed + restCombo);
      }
    }
  }

  return results;
}

/**
 * Generate random variations from segments
 */
function generateRandomVariations(segments: string[][], count: number): string[] {
  const results: string[] = [];
  const seen = new Set<string>();
  const maxAttempts = count * 10;
  let attempts = 0;

  while (results.length < count && attempts < maxAttempts) {
    attempts++;
    let variation = '';

    for (const segment of segments) {
      const randomIndex = Math.floor(Math.random() * segment.length);
      let option = segment[randomIndex];

      if (option.includes('{')) {
        const nestedSegments = parseSpintax(option);
        const nestedVariations = generateRandomVariations(nestedSegments, 1);
        option = nestedVariations[0] || option;
      }

      variation += option;
    }

    if (!seen.has(variation)) {
      seen.add(variation);
      results.push(variation);
    }
  }

  return results;
}

/**
 * Generate sequential variations from segments
 */
function generateSequentialVariations(segments: string[][], count: number): string[] {
  const all = generateAllCombinations(segments);
  return all.slice(0, count);
}

/**
 * Count total possible combinations (including nested)
 */
function countCombinations(segments: string[][]): number {
  let total = 1;
  for (const segment of segments) {
    let segmentTotal = 0;
    for (const option of segment) {
      if (option.includes('{')) {
        const nestedSegments = parseSpintax(option);
        segmentTotal += countCombinations(nestedSegments);
      } else {
        segmentTotal += 1;
      }
    }
    total *= segmentTotal;
  }
  return total;
}

/**
 * Analyze spintax text and return statistics
 *
 * @example
 * ```ts
 * const stats = analyze('{Hello|Hi} {world|there}');
 * // { totalCombinations: 4, spinElements: 2, averageOptionsPerSpin: 2 }
 * ```
 */
export function analyze(text: string): SpintaxStats {
  const segments = parseSpintax(text);
  const spinElements = segments.filter(s => s.length > 1).length;
  const totalOptions = segments.reduce((sum, s) => sum + s.length, 0);

  return {
    totalCombinations: countCombinations(segments),
    spinElements,
    averageOptionsPerSpin: spinElements > 0 ? totalOptions / segments.length : 0,
  };
}

/**
 * Generate a single random variation from spintax text
 *
 * @example
 * ```ts
 * const text = spin('{Hello|Hi} {world|there}');
 * // "Hi world" or "Hello there" etc.
 * ```
 */
export function spin(text: string): string {
  const segments = parseSpintax(text);
  const variations = generateRandomVariations(segments, 1);
  return variations[0] || text;
}

/**
 * Generate multiple variations from spintax text
 *
 * @example
 * ```ts
 * // Random variations
 * const variations = generate('{Hello|Hi} {world|there}', { count: 3 });
 *
 * // All possible combinations
 * const all = generate('{Hello|Hi} {world|there}', { mode: 'all' });
 *
 * // Sequential (first N combinations)
 * const first5 = generate('{A|B|C} {1|2|3}', { mode: 'sequential', count: 5 });
 * ```
 */
export function generate(text: string, options: GenerateOptions = {}): SpintaxResult {
  const { count = 10, mode = 'random' } = options;
  const segments = parseSpintax(text);
  const stats = analyze(text);

  let variations: string[];

  switch (mode) {
    case 'all':
      const maxAll = Math.min(stats.totalCombinations, 1000);
      variations = generateAllCombinations(segments).slice(0, maxAll);
      break;
    case 'sequential':
      variations = generateSequentialVariations(segments, Math.min(count, 1000));
      break;
    case 'random':
    default:
      variations = generateRandomVariations(segments, Math.min(count, 100));
      break;
  }

  return {
    variations,
    stats: {
      ...stats,
      generatedCount: variations.length,
    },
  };
}

/**
 * Validate spintax syntax
 * Returns true if the spintax is valid, false otherwise
 *
 * @example
 * ```ts
 * validate('{Hello|Hi}'); // true
 * validate('{Hello|Hi');  // false (unclosed brace)
 * ```
 */
export function validate(text: string): boolean {
  let depth = 0;
  for (const char of text) {
    if (char === '{') depth++;
    if (char === '}') depth--;
    if (depth < 0) return false;
  }
  return depth === 0;
}

/**
 * Extract all unique options from spintax text
 * Useful for reviewing what variations are possible
 *
 * @example
 * ```ts
 * const options = extractOptions('{Hello|Hi} {world|there|friend}');
 * // [['Hello', 'Hi'], ['world', 'there', 'friend']]
 * ```
 */
export function extractOptions(text: string): string[][] {
  const segments = parseSpintax(text);
  return segments.filter(s => s.length > 1);
}

// Default export for convenience
export default {
  spin,
  generate,
  analyze,
  validate,
  extractOptions,
};
