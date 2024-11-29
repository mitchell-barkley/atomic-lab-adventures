import React from 'react';
import { Element } from '../types/chemistry';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface TestTubeProps {
  index: number;
  elements: Element[];
  onMix: (index: number) => void;
  onEmpty: (index: number) => void;
  onRemoveElement: (tubeIndex: number, elementIndex: number) => void;
  onDrop: (e: React.DragEvent, tubeIndex: number) => void;
  onDragStart: (e: React.DragEvent, tubeIndex: number) => void;
}

export const TestTube: React.FC<TestTubeProps> = ({
  index,
  elements,
  onMix,
  onEmpty,
  onRemoveElement,
  onDrop,
  onDragStart,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm text-foreground font-medium">#{index + 1}</span>
      <div 
        className="w-full h-24 bg-primary/20 rounded-lg flex flex-col items-center justify-start gap-1 border-2 border-primary p-1 overflow-y-auto cursor-move hover:border-primary/60 transition-colors"
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDrop={(e) => onDrop(e, index)}
        onDragOver={handleDragOver}
      >
        {elements.map((element, elemIndex) => (
          <div 
            key={elemIndex} 
            className="bg-primary/40 px-2 py-1 rounded-md text-foreground font-medium w-full text-center text-sm relative group"
          >
            {element.symbol}
            <button
              onClick={() => onRemoveElement(index, elemIndex)}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove element"
            >
              <X className="h-3 w-3 text-foreground/80 hover:text-foreground" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col w-full gap-1">
        <Button 
          variant="secondary"
          size="sm"
          onClick={() => onMix(index)}
          disabled={elements.length < 2}
        >
          Mix
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEmpty(index)}
          disabled={elements.length === 0}
        >
          Empty
        </Button>
      </div>
    </div>
  );
};