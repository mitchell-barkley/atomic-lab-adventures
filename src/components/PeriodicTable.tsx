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

  return (
    <div className="grid grid-cols-18 gap-1 p-4 bg-secondary rounded-lg max-w-[1200px] mx-auto">
      {PERIODIC_TABLE_DATA.map((element) => (
        <TooltipProvider key={element.symbol}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                draggable
                onDragStart={handleDragStart(element)}
                className="w-14 h-14 flex flex-col items-center justify-center bg-primary hover:bg-primary/80 
                         rounded cursor-move transition-colors p-1 animate-fade-in"
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
  );
};