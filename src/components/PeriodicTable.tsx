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
    const positions: { [key: number]: string } = {
      1: "col-start-1 row-start-1",
      2: "col-start-18 row-start-1",
      3: "col-start-1 row-start-2",
      4: "col-start-2 row-start-2",
      5: "col-start-13 row-start-2",
      6: "col-start-14 row-start-2",
      7: "col-start-15 row-start-2",
      8: "col-start-16 row-start-2",
    };
    return positions[atomicNumber] || "";
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