import React, { useState } from 'react';
import { PeriodicTable } from '../components/PeriodicTable';
import { Laboratory } from '../components/Laboratory';
import { Inventory } from '../components/Inventory';
import { Compound, Element } from '../types/chemistry';

const Index = () => {
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const handleCompoundCreated = (compound: Compound) => {
    setCompounds([...compounds, compound]);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-center text-foreground mb-8">
        Chemistry Lab
      </h1>
      
      <div className="max-w-7xl mx-auto grid grid-cols-[300px_1fr_300px] gap-8">
        <Laboratory onCompoundCreated={handleCompoundCreated} />
        <div className="w-full">
          <PeriodicTable onElementDrag={setSelectedElement} />
        </div>
        <Inventory compounds={compounds} />
      </div>
    </div>
  );
};

export default Index;