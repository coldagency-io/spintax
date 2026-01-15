# @coldagency/spintax

[![npm version](https://img.shields.io/npm/v/@coldagency/spintax.svg)](https://www.npmjs.com/package/@coldagency/spintax)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A powerful spintax parser with **nested syntax support** for cold email and content generation. Built by [Cold Agency](https://www.coldagency.io/) - B2B lead generation experts.

## Features

- **Nested spintax support** - Handle complex patterns like `{Hello|Hi {there|friend}}`
- **Multiple generation modes** - Random, sequential, or all combinations
- **Zero dependencies** - Lightweight and fast
- **TypeScript ready** - Full type definitions included
- **Battle-tested** - Used in production for millions of cold emails

## Installation

```bash
npm install @coldagency/spintax
```

```bash
yarn add @coldagency/spintax
```

```bash
pnpm add @coldagency/spintax
```

## Quick Start

```typescript
import { spin, generate, analyze } from '@coldagency/spintax';

// Generate a single random variation
const text = spin('{Hello|Hi|Hey} {there|friend}, how are you?');
// => "Hi friend, how are you?"

// Generate multiple variations
const { variations } = generate('{Hello|Hi} {world|there}', { count: 4 });
// => ["Hello world", "Hi there", "Hello there", "Hi world"]

// Analyze spintax complexity
const stats = analyze('{A|B|C} {1|2|3} {X|Y}');
// => { totalCombinations: 18, spinElements: 3, averageOptionsPerSpin: 2.67 }
```

## API Reference

### `spin(text: string): string`

Generate a single random variation from spintax text.

```typescript
spin('{Good morning|Hello|Hi} {friend|there}');
// => "Hello friend"
```

### `generate(text: string, options?: GenerateOptions): SpintaxResult`

Generate multiple variations with configurable options.

**Options:**
- `count` (number, default: 10) - Number of variations to generate
- `mode` ('random' | 'all' | 'sequential', default: 'random') - Generation mode

```typescript
// Random variations (default)
generate('{A|B} {1|2}', { count: 3 });
// => { variations: ["A 2", "B 1", "A 1"], stats: {...} }

// All possible combinations
generate('{Hello|Hi} {world|there}', { mode: 'all' });
// => { variations: ["Hello world", "Hello there", "Hi world", "Hi there"], stats: {...} }

// Sequential (first N in order)
generate('{A|B|C} {1|2|3}', { mode: 'sequential', count: 5 });
// => { variations: ["A 1", "A 2", "A 3", "B 1", "B 2"], stats: {...} }
```

### `analyze(text: string): SpintaxStats`

Get statistics about spintax complexity without generating variations.

```typescript
analyze('{Hello|Hi|Hey} {world|there|friend|mate}');
// => {
//   totalCombinations: 12,
//   spinElements: 2,
//   averageOptionsPerSpin: 3.5
// }
```

### `validate(text: string): boolean`

Check if spintax syntax is valid (balanced braces).

```typescript
validate('{Hello|Hi}');  // => true
validate('{Hello|Hi');   // => false (unclosed brace)
validate('Hello}');      // => false (unexpected close)
```

### `extractOptions(text: string): string[][]`

Extract all spin options for review.

```typescript
extractOptions('{Hello|Hi} world {friend|mate}');
// => [["Hello", "Hi"], ["friend", "mate"]]
```

## Nested Spintax

This library fully supports nested spintax patterns:

```typescript
spin('{Hello|Hi {there|friend|{dear|lovely} reader}}');
// Possible outputs:
// - "Hello"
// - "Hi there"
// - "Hi friend"
// - "Hi dear reader"
// - "Hi lovely reader"

// Complex nesting
const template = `
{Dear|Hello} {friend|{valued|esteemed} {customer|client}},

{I hope this {email|message} finds you well|Hope you're doing great}.
`;

const stats = analyze(template);
console.log(`This template has ${stats.totalCombinations} unique variations`);
```

## Use Cases

### Cold Email Personalization

```typescript
const emailTemplate = `
{Hi|Hello|Hey} {{firstName}},

{I noticed|I saw|Came across} {your company|{companyName}} and {thought|wanted} to reach out.

{Would you be open to|Are you interested in|Could we schedule} a {quick|brief|short} {call|chat|conversation}?

{Best|Cheers|Thanks},
{Your Name}
`;

// Generate 50 unique email variations
const { variations } = generate(emailTemplate, { count: 50 });
```

### A/B Testing Copy

```typescript
const headlines = generate(
  '{Boost|Increase|Skyrocket} your {sales|revenue|conversions} by {50%|2x|10x}',
  { mode: 'all' }
);
// => 27 unique headline variations to test
```

### Content Generation

```typescript
const productDescriptions = generate(
  'This {amazing|incredible|fantastic} product will {help you|allow you to|let you} {save time|work smarter|be more productive}',
  { count: 10 }
);
```

## Performance

- Handles templates with **millions of combinations** efficiently
- Random mode avoids generating all combinations upfront
- Memory-efficient for large-scale email campaigns

## About Cold Agency

Built with love by [Cold Agency](https://www.coldagency.io/) - we help B2B companies generate qualified leads through cold email and LinkedIn outreach.

**Need help with your outbound?** [Book a free strategy call](https://www.coldagency.io/)

[![Stripe Climate](https://img.shields.io/badge/Stripe%20Climate-Contributor-green?logo=stripe)](https://climate.stripe.com/gVZWt9)

We contribute 1% of our revenue to carbon removal.

[![Figma](https://img.shields.io/badge/Figma-Free%20Templates-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/community/file/1593641104107940515/linked-carousel-templates) Get some free LinkedIn Carousel templates

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Star this repo** if you find it useful!
