export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  category: string;
}

export interface Compound {
  formula: string;
  name: string;
  elements: Element[];
  properties: {
    molarMass: number;
    state: 'solid' | 'liquid' | 'gas';
  };
}