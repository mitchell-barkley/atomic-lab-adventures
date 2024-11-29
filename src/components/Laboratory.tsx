import React, { useState } from 'react';
import { Element, Compound } from '../types/chemistry';
import { combineElements } from '../utils/chemistry';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

interface LaboratoryProps {
  onCompoundCreated: (compound: Compound) => void;
}

export const Laboratory: React.FC<LaboratoryProps> = ({ onCompoundCreated }) => {
  const [beakerElements, setBeakerElements] = useState<Element[]>([]);
  const [testTubeElements, setTestTubeElements] = useState<Element[]>([]);
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent, container: 'beaker' | 'testTube') => {
    e.preventDefault();
    const elementData = e.dataTransfer.getData('element');
    if (elementData) {
      const element = JSON.parse(elementData) as Element;
      if (container === 'beaker') {
        setBeakerElements([...beakerElements, element]);
      } else {
        setTestTubeElements([...testTubeElements, element]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleMix = (container: 'beaker' | 'testTube') => {
    const elements = container === 'beaker' ? beakerElements : testTubeElements;
    if (elements.length < 2) {
      toast({
        title: "Not enough elements",
        description: "You need at least two elements to create a compound.",
        variant: "destructive",
      });
      return;
    }

    const compound = combineElements(elements);
    if (compound) {
      onCompoundCreated(compound);
      if (container === 'beaker') {
        setBeakerElements([]);
      } else {
        setTestTubeElements([]);
      }
      toast({
        title: "Success!",
        description: `Created ${compound.name} (${compound.formula})`,
      });
    } else {
      toast({
        title: "Invalid combination",
        description: "These elements cannot form a compound.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-secondary rounded-lg min-h-[300px]">
      <div className="text-xl font-bold text-foreground mb-4">Laboratory Equipment</div>
      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-4">
          <span className="text-foreground font-medium">Beaker</span>
          <div 
            className="w-32 h-48 bg-primary/20 rounded-lg flex flex-col items-center justify-center border-2 border-primary p-2"
            onDrop={(e) => handleDrop(e, 'beaker')}
            onDragOver={handleDragOver}
          >
            {beakerElements.map((element, index) => (
              <div 
                key={index} 
                className="bg-primary/40 px-2 py-1 rounded mb-1 text-foreground"
              >
                {element.symbol}
              </div>
            ))}
          </div>
          <Button 
            onClick={() => handleMix('beaker')}
            disabled={beakerElements.length < 2}
            variant="secondary"
          >
            Mix
          </Button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <span className="text-foreground font-medium">Test Tube</span>
          <div 
            className="w-24 h-48 bg-primary/20 rounded-lg flex flex-col items-center justify-center border-2 border-primary p-2"
            onDrop={(e) => handleDrop(e, 'testTube')}
            onDragOver={handleDragOver}
          >
            {testTubeElements.map((element, index) => (
              <div 
                key={index} 
                className="bg-primary/40 px-2 py-1 rounded mb-1 text-foreground"
              >
                {element.symbol}
              </div>
            ))}
          </div>
          <Button 
            onClick={() => handleMix('testTube')}
            disabled={testTubeElements.length < 2}
            variant="secondary"
          >
            Mix
          </Button>
        </div>
      </div>
    </div>
  );
};