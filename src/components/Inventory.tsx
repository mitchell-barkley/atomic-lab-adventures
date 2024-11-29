import React from 'react';
import { Compound } from '../types/chemistry';

interface InventoryProps {
  compounds: Compound[];
}

export const Inventory: React.FC<InventoryProps> = ({ compounds }) => {
  return (
    <div className="p-4 bg-secondary rounded-lg">
      <h2 className="text-xl font-bold text-foreground mb-4">Inventory</h2>
      <div className="grid grid-cols-4 gap-2">
        {compounds.map((compound, index) => (
          <div 
            key={index}
            className="p-2 bg-primary/20 rounded flex items-center justify-center"
          >
            <span className="text-foreground">{compound.formula}</span>
          </div>
        ))}
      </div>
    </div>
  );
};