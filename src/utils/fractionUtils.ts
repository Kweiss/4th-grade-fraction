import { Fraction, ComparisonMethod } from '../types';

// Re-export types for convenience
export type { Fraction, ComparisonMethod } from '../types';

/**
 * Greatest Common Divisor
 */
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Least Common Multiple
 */
export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

/**
 * Simplify a fraction
 */
export function simplify(fraction: Fraction): Fraction {
  const divisor = gcd(fraction.numerator, fraction.denominator);
  return {
    numerator: fraction.numerator / divisor,
    denominator: fraction.denominator / divisor,
  };
}

/**
 * Compare fractions using common denominators
 */
export function compareWithCommonDenominator(f1: Fraction, f2: Fraction): '>' | '<' | '=' {
  const commonDenom = lcm(f1.denominator, f2.denominator);
  const num1 = f1.numerator * (commonDenom / f1.denominator);
  const num2 = f2.numerator * (commonDenom / f2.denominator);
  
  if (num1 > num2) return '>';
  if (num1 < num2) return '<';
  return '=';
}

/**
 * Compare fractions using cross-multiplication
 */
export function compareWithCrossMultiplication(f1: Fraction, f2: Fraction): '>' | '<' | '=' {
  const product1 = f1.numerator * f2.denominator;
  const product2 = f2.numerator * f1.denominator;
  
  if (product1 > product2) return '>';
  if (product1 < product2) return '<';
  return '=';
}

/**
 * Compare fractions using benchmarks (0, 1/2, 1)
 */
export function compareWithBenchmarks(f1: Fraction, f2: Fraction): '>' | '<' | '=' | null {
  const val1 = f1.numerator / f1.denominator;
  const val2 = f2.numerator / f2.denominator;
  
  // Check if both are clearly on different sides of benchmarks
  const benchmarks = [0, 0.5, 1];
  
  for (const benchmark of benchmarks) {
    const diff1 = Math.abs(val1 - benchmark);
    const diff2 = Math.abs(val2 - benchmark);
    
    if (diff1 < 0.1 && diff2 > 0.2 && val1 < benchmark && val2 > benchmark) {
      return '<';
    }
    if (diff1 < 0.1 && diff2 > 0.2 && val1 > benchmark && val2 < benchmark) {
      return '>';
    }
  }
  
  // If one is clearly less than 1/2 and other is clearly greater
  if (val1 < 0.4 && val2 > 0.6) return '<';
  if (val1 > 0.6 && val2 < 0.4) return '>';
  
  // If benchmark method isn't clear, return null to use another method
  return null;
}

/**
 * Compare fractions - tries benchmarks first, falls back to cross-multiplication
 */
export function compareFractions(f1: Fraction, f2: Fraction, method?: ComparisonMethod): '>' | '<' | '=' {
  if (method === 'benchmark') {
    const result = compareWithBenchmarks(f1, f2);
    if (result !== null) return result;
    // Fall back if benchmark method is unclear
    return compareWithCrossMultiplication(f1, f2);
  }
  
  if (method === 'common-denominator') {
    return compareWithCommonDenominator(f1, f2);
  }
  
  // Default to cross-multiplication
  return compareWithCrossMultiplication(f1, f2);
}

/**
 * Convert fraction to decimal
 */
export function toDecimal(fraction: Fraction): number {
  return fraction.numerator / fraction.denominator;
}

/**
 * Format fraction as string (e.g., "3/4")
 */
export function formatFraction(fraction: Fraction): string {
  return `${fraction.numerator}/${fraction.denominator}`;
}

/**
 * Generate a random fraction with constraints
 */
export function generateFraction(minDenom: number = 2, maxDenom: number = 12, simplified: boolean = true): Fraction {
  const denominator = Math.floor(Math.random() * (maxDenom - minDenom + 1)) + minDenom;
  const numerator = Math.floor(Math.random() * (denominator - 1)) + 1; // Ensure proper fraction (< 1)
  
  const fraction = { numerator, denominator };
  return simplified ? simplify(fraction) : fraction;
}

/**
 * Generate a pair of fractions for comparison
 */
export function generateExercisePair(difficulty: number): { fraction1: Fraction; fraction2: Fraction } {
  // Difficulty 1-2: Easy (small denominators, larger gaps)
  // Difficulty 3: Medium (medium denominators, medium gaps)
  // Difficulty 4-5: Hard (larger denominators, smaller gaps, closer values)
  
  let minDenom, maxDenom, gapMultiplier;
  
  if (difficulty <= 2) {
    minDenom = 2;
    maxDenom = 6;
    gapMultiplier = 0.3;
  } else if (difficulty === 3) {
    minDenom = 4;
    maxDenom = 10;
    gapMultiplier = 0.2;
  } else {
    minDenom = 6;
    maxDenom = 12;
    gapMultiplier = 0.1;
  }
  
  // Generate first fraction
  const fraction1 = generateFraction(minDenom, maxDenom);
  const val1 = toDecimal(fraction1);
  
  // Generate second fraction with controlled gap
  let fraction2: Fraction;
  let val2: number;
  let attempts = 0;
  
  do {
    fraction2 = generateFraction(minDenom, maxDenom);
    val2 = toDecimal(fraction2);
    attempts++;
  } while (Math.abs(val1 - val2) < gapMultiplier && attempts < 20);
  
  // Randomly decide which is first (to avoid bias)
  if (Math.random() < 0.5) {
    return { fraction1, fraction2 };
  } else {
    return { fraction1: fraction2, fraction2: fraction1 };
  }
}

