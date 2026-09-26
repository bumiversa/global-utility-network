export type Category = 'length' | 'weight';

export type LengthUnit = 'meter' | 'kilometer' | 'feet' | 'inch';
export type WeightUnit = 'kilogram' | 'gram' | 'pound' | 'ounce';
export type Unit = LengthUnit | WeightUnit;

export type ConversionResult = 
  | { ok: true; value: number }
  | { ok: false; error: string };

const LENGTH_FACTORS: Record<LengthUnit, number> = {
  meter: 1,
  kilometer: 1000,
  feet: 0.3048,
  inch: 0.0254,
};

const WEIGHT_FACTORS: Record<WeightUnit, number> = {
  kilogram: 1,
  gram: 0.001,
  pound: 0.45359237,
  ounce: 0.028349523125,
};

// Explicit Type Guards
export function isLengthUnit(value: string): value is LengthUnit {
  return value in LENGTH_FACTORS;
}

export function isWeightUnit(value: string): value is WeightUnit {
  return value in WEIGHT_FACTORS;
}

export function convertUnits(
  value: number,
  sourceUnit: string,
  targetUnit: string,
  category: string
): ConversionResult {
  // 1. Input Validation (Finite Invariant)
  if (!Number.isFinite(value)) {
    return { ok: false, error: "Value must be a valid finite number." };
  }

  // 2. Category & Unit Validation
  if (category === 'length') {
    if (!isLengthUnit(sourceUnit) || !isLengthUnit(targetUnit)) {
      return { ok: false, error: "Invalid unit for this category." };
    }
    
    const baseValue = value * LENGTH_FACTORS[sourceUnit];
    const resultValue = baseValue / LENGTH_FACTORS[targetUnit];
    
    // Finite Result Invariant
    if (!Number.isFinite(resultValue)) {
      return { ok: false, error: "Result is outside the supported numeric range." };
    }
    
    return { ok: true, value: resultValue };
  }

  if (category === 'weight') {
    if (!isWeightUnit(sourceUnit) || !isWeightUnit(targetUnit)) {
      return { ok: false, error: "Invalid unit for this category." };
    }
    
    const baseValue = value * WEIGHT_FACTORS[sourceUnit];
    const resultValue = baseValue / WEIGHT_FACTORS[targetUnit];
    
    // Finite Result Invariant
    if (!Number.isFinite(resultValue)) {
      return { ok: false, error: "Result is outside the supported numeric range." };
    }
    
    return { ok: true, value: resultValue };
  }

  return { ok: false, error: "Invalid conversion category." };
}