import React, { useState } from 'react';
import { Element, Compound } from '../types/chemistry';
import { combineElements } from '../utils/chemistry';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Slider } from './ui/slider';

interface LaboratoryProps {
  onCompoundCreated: (compound: Compound) => void;
}

export const Laboratory: React.FC<LaboratoryProps> = ({ onCompoundCreated }) => {
  const [beakerElements, setBeakerElements] = useState<Element[]>([]);
  const [testTubeElements, setTestTubeElements] = useState<Element[][]>(Array(6).fill([]));
  const [temperature, setTemperature] = useState(25);
  const [isCentrifugeActive, setIsCentrifugeActive] = useState(false);
  const [activeTestTube, setActiveTestTube] = useState<number | null>(null);
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent, container: 'beaker' | 'testTube', tubeIndex?: number) => {
    e.preventDefault();
    const elementData = e.dataTransfer.getData('element');
    if (elementData) {
      const element = JSON.parse(elementData) as Element;
      if (container === 'beaker') {
        setBeakerElements([...beakerElements, element]);
      } else if (container === 'testTube' && typeof tubeIndex === 'number') {
        const newTestTubes = [...testTubeElements];
        newTestTubes[tubeIndex] = [...(newTestTubes[tubeIndex] || []), element];
        setTestTubeElements(newTestTubes);
      }
    }
  };

  const handleTestTubeDragStart = (e: React.DragEvent, tubeIndex: number) => {
    e.dataTransfer.setData('testTube', tubeIndex.toString());
    setActiveTestTube(tubeIndex);
  };

  const handleEquipmentDrop = (e: React.DragEvent, equipment: 'burner' | 'centrifuge') => {
    e.preventDefault();
    const tubeIndex = parseInt(e.dataTransfer.getData('testTube'));
    
    if (isNaN(tubeIndex) || !testTubeElements[tubeIndex]?.length) return;

    if (equipment === 'burner') {
      toast({
        title: "Heating Test Tube",
        description: `Test tube #${tubeIndex + 1} is being heated to ${temperature}°C`,
      });
      // Add any specific heating logic here
    } else if (equipment === 'centrifuge') {
      setIsCentrifugeActive(true);
      toast({
        title: "Centrifuge Active",
        description: `Separating contents of test tube #${tubeIndex + 1}`,
      });
      
      setTimeout(() => {
        setIsCentrifugeActive(false);
        // Add any specific separation logic here
        toast({
          title: "Centrifuge Complete",
          description: "Contents have been separated",
        });
      }, 2000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleMix = (container: 'beaker' | 'testTube', tubeIndex?: number) => {
    const elements = container === 'beaker' 
      ? beakerElements 
      : (tubeIndex !== undefined ? testTubeElements[tubeIndex] : []);

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
      } else if (tubeIndex !== undefined) {
        const newTestTubes = [...testTubeElements];
        newTestTubes[tubeIndex] = [];
        setTestTubeElements(newTestTubes);
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
    <div className="flex flex-col gap-6 p-8 bg-secondary rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-foreground text-center">Laboratory Equipment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bunsen Burner Section */}
        <div 
          className="bg-primary/10 p-6 rounded-lg border-2 border-primary/30"
          onDrop={(e) => handleEquipmentDrop(e, 'burner')}
          onDragOver={handleDragOver}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Bunsen Burner</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-orange-500/20 rounded-full border-2 border-orange-500 flex items-center justify-center">
              <span className="text-orange-600 font-bold">{temperature}°C</span>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
              min={25}
              max={500}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Centrifuge Section */}
        <div 
          className="bg-primary/10 p-6 rounded-lg border-2 border-primary/30"
          onDrop={(e) => handleEquipmentDrop(e, 'centrifuge')}
          onDragOver={handleDragOver}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Centrifuge</h3>
          <div className="flex flex-col items-center gap-4">
            <div className={`w-24 h-24 bg-blue-500/20 rounded-full border-2 border-blue-500 flex items-center justify-center transition-transform duration-500 ${isCentrifugeActive ? 'animate-spin' : ''}`}>
              <span className="text-blue-600 font-bold">Spin</span>
            </div>
          </div>
        </div>

        {/* Beaker Section */}
        <div className="bg-primary/10 p-6 rounded-lg border-2 border-primary/30 md:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Beaker</h3>
          <div 
            className="w-full h-48 bg-primary/20 rounded-lg flex flex-col items-center justify-start gap-2 border-2 border-primary p-2 overflow-y-auto"
            onDrop={(e) => handleDrop(e, 'beaker')}
            onDragOver={handleDragOver}
          >
            {beakerElements.map((element, index) => (
              <div 
                key={index} 
                className="bg-primary/40 px-3 py-1.5 rounded-md text-foreground font-medium w-full text-center"
              >
                {element.symbol}
              </div>
            ))}
          </div>
          <Button 
            onClick={() => handleMix('beaker')}
            disabled={beakerElements.length < 2}
            variant="secondary"
            className="w-full mt-4"
          >
            Mix
          </Button>
        </div>
      </div>
    </div>
  );
};