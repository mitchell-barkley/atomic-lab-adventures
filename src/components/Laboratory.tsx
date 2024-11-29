import React, { useState } from 'react';
import { Element, Compound } from '../types/chemistry';
import { combineElements } from '../utils/chemistry';

interface LaboratoryProps {
  onCompoundCreated: (compound: Compound) => void;
}

export const Laboratory: React.FC<LaboratoryProps> = ({ onCompoundCreated }) => {
  const [activeElements, setActiveElements] = useState<Element[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementData = e.dataTransfer.getData('element');
    if (elementData) {
      const element = JSON.parse(elementData) as Element;
      const newElements = [...activeElements, element];
      setActiveElements(newElements);

      if (newElements.length >= 2) {
        const compound = combineElements(newElements);
        if (compound) {
          onCompoundCreated(compound);
          setActiveElements([]);
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex flex-col items-center gap-4 p-6 bg-secondary rounded-lg min-h-[300px]"
    >
      <div className="text-xl font-bold text-foreground mb-4">Laboratory Equipment</div>
      <div className="flex gap-4">
        <div className="w-32 h-48 bg-primary/20 rounded-lg flex items-center justify-center border-2 border-primary">
          <span className="text-foreground/60">Beaker</span>
        </div>
        <div className="w-24 h-48 bg-primary/20 rounded-lg flex items-center justify-center border-2 border-primary">
          <span className="text-foreground/60">Test Tube</span>
        </div>
      </div>
      <div className="mt-4">
        {activeElements.map((element, index) => (
          <span key={index} className="text-foreground mr-2">
            {element.symbol}
          </span>
        ))}
      </div>
    </div>
  );
};