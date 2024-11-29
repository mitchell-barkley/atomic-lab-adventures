import { Element, Compound } from '../types/chemistry';

export const combineElements = (elements: Element[]): Compound | null => {
  // Simple example for H2O
  const hydrogenCount = elements.filter(e => e.symbol === 'H').length;
  const oxygenCount = elements.filter(e => e.symbol === 'O').length;

  if (hydrogenCount === 2 && oxygenCount === 1) {
    return {
      formula: 'H2O',
      name: 'Water',
      elements: elements,
      properties: {
        molarMass: 18.015,
        state: 'liquid'
      }
    };
  }

  return null;
};