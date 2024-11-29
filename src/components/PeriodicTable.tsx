import React from 'react';
import { Element } from '../types/chemistry';
import { PERIODIC_TABLE_DATA } from '../data/elements';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface PeriodicTableProps {
  onElementDrag: (element: Element) => void;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({ onElementDrag }) => {
  const handleDragStart = (element: Element) => (e: React.DragEvent) => {
    e.dataTransfer.setData('element', JSON.stringify(element));
    onElementDrag(element);
  };

  // Helper function to position elements in the grid
  const getGridPosition = (atomicNumber: number) => {
    // Period 1
    if (atomicNumber === 1) return "col-start-1 row-start-1";
    if (atomicNumber === 2) return "col-start-18 row-start-1";
    
    // Period 2
    if (atomicNumber === 3) return "col-start-1 row-start-2";
    if (atomicNumber === 4) return "col-start-2 row-start-2";
    if (atomicNumber >= 5 && atomicNumber <= 10) 
      return `col-start-${atomicNumber + 8} row-start-2`;

    // Period 3
    if (atomicNumber === 11) return "col-start-1 row-start-3";
    if (atomicNumber === 12) return "col-start-2 row-start-3";
    if (atomicNumber >= 13 && atomicNumber <= 18) 
      return `col-start-${atomicNumber} row-start-3`;

    // Period 4
    if (atomicNumber >= 19 && atomicNumber <= 36) 
      return `col-start-${(atomicNumber - 18)} row-start-4`;

    // Period 5
    if (atomicNumber >= 37 && atomicNumber <= 54) 
      return `col-start-${(atomicNumber - 36)} row-start-5`;

    // Period 6 (including lanthanides)
    if (atomicNumber >= 55 && atomicNumber <= 56) 
      return `col-start-${(atomicNumber - 54)} row-start-6`;
    if (atomicNumber >= 72 && atomicNumber <= 86) 
      return `col-start-${(atomicNumber - 68)} row-start-6`;

    // Period 7 (including actinides)
    if (atomicNumber >= 87 && atomicNumber <= 88) 
      return `col-start-${(atomicNumber - 86)} row-start-7`;
    if (atomicNumber >= 104 && atomicNumber <= 118) 
      return `col-start-${(atomicNumber - 100)} row-start-7`;

    // Lanthanides (Period 6)
    if (atomicNumber >= 57 && atomicNumber <= 71) 
      return `col-start-${(atomicNumber - 54)} row-start-9`;

    // Actinides (Period 7)
    if (atomicNumber >= 89 && atomicNumber <= 103) 
      return `col-start-${(atomicNumber - 86)} row-start-10`;

    return "";
  };

  return (
    <div className="p-4 bg-secondary rounded-lg max-w-[1200px] mx-auto">
      <div className="grid grid-cols-18 gap-1 relative">
        {PERIODIC_TABLE_DATA.map((element) => (
          <TooltipProvider key={element.symbol}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  draggable
                  onDragStart={handleDragStart(element)}
                  className={`w-14 h-14 flex flex-col items-center justify-center bg-primary 
                           hover:bg-primary/80 rounded cursor-move transition-colors p-1 
                           animate-fade-in ${getGridPosition(element.atomicNumber)}`}
                >
                  <span className="text-xs text-foreground/60">{element.atomicNumber}</span>
                  <span className="text-lg font-bold text-foreground">{element.symbol}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="p-2 max-w-xs">
                <div className="space-y-1">
                  <p className="font-bold">{element.name}</p>
                  <p>Atomic Number: {element.atomicNumber}</p>
                  <p>Atomic Mass: {element.atomicMass}</p>
                  <p>Category: {element.category}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};