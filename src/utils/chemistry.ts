import { Element, Compound } from '../types/chemistry';

const COMPOUNDS = {
  H2O: {
    name: 'Water',
    elements: ['H', 'H', 'O'],
    molarMass: 18.015,
    state: 'liquid' as const,
  },
  CO2: {
    name: 'Carbon Dioxide',
    elements: ['C', 'O', 'O'],
    molarMass: 44.009,
    state: 'gas' as const,
  },
  C55H72O5N4Mg: {
    name: 'Chlorophyll',
    elements: [
      ...Array(55).fill('C'),
      ...Array(72).fill('H'),
      ...Array(5).fill('O'),
      ...Array(4).fill('N'),
      'Mg'
    ],
    molarMass: 893.51,
    state: 'solid' as const,
  },
  NaCl: {
    name: 'Sodium Chloride',
    elements: ['Na', 'Cl'],
    molarMass: 58.44,
    state: 'solid' as const,
  },
};

export const combineElements = (elements: Element[]): Compound | null => {
  // Sort elements by symbol to normalize the order
  const sortedSymbols = elements.map(e => e.symbol).sort();
  
  // Count occurrences of each element
  const elementCounts = sortedSymbols.reduce((acc, symbol) => {
    acc[symbol] = (acc[symbol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Generate formula from counts
  const formula = Object.entries(elementCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([symbol, count]) => `${symbol}${count > 1 ? count : ''}`)
    .join('');

  // Check if this formula exists in our compounds database
  const compound = COMPOUNDS[formula as keyof typeof COMPOUNDS];
  
  if (compound) {
    return {
      formula,
      name: compound.name,
      elements,
      properties: {
        molarMass: compound.molarMass,
        state: compound.state,
      },
    };
  }

  return null;
};