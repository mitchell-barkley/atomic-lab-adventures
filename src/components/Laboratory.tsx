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

  const handleCentrifuge = () => {
    setIsCentrifugeActive(true);
    setTimeout(() => {
      setIsCentrifugeActive(false);
      // Distribute beaker elements across test tubes based on some property
      // This is a simplified example - you might want to implement more complex separation logic
      const newTestTubes = Array(6).fill([]).map(() => []);
      beakerElements.forEach((element, index) => {
        const tubeIndex = index % 6;
        newTestTubes[tubeIndex] = [...newTestTubes[tubeIndex], element];
      });
      setTestTubeElements(newTestTubes);
      setBeakerElements([]);
      toast({
        title: "Centrifuge complete",
        description: "Elements have been separated into test tubes",
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-secondary rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-foreground text-center">Laboratory Equipment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Bunsen Burner Section */}
        <div className="bg-primary/10 p-6 rounded-lg border-2 border-primary/30">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Bunsen Burner</h3>
          <div className="flex flex-col items-center gap-4">
            <Slider
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
              min={25}
              max={500}
              step={5}
              className="w-full"
            />
            <span className="text-sm font-medium text-foreground">{temperature}°C</span>
          </div>
        </div>

        {/* Beaker Section */}
        <div className="bg-primary/10 p-6 rounded-lg border-2 border-primary/30">
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
          <div className="flex justify-center gap-4 mt-4">
            <Button 
              onClick={() => handleMix('beaker')}
              disabled={beakerElements.length < 2}
              variant="secondary"
              className="w-24"
            >
              Mix
            </Button>
            <Button
              onClick={handleCentrifuge}
              disabled={beakerElements.length === 0 || isCentrifugeActive}
              variant="secondary"
              className={`w-24 ${isCentrifugeActive ? 'animate-spin' : ''}`}
            >
              Centrifuge
            </Button>
          </div>
        </div>

        {/* Test Tubes Section */}
        <div className="bg-primary/10 p-6 rounded-lg border-2 border-primary/30">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Test Tubes</h3>
          <div className="grid grid-cols-3 gap-2">
            {testTubeElements.map((tubeElements, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-sm text-foreground font-medium">#{index + 1}</span>
                <div 
                  className="w-full h-32 bg-primary/20 rounded-lg flex flex-col items-center justify-start gap-1 border-2 border-primary p-1 overflow-y-auto"
                  onDrop={(e) => handleDrop(e, 'testTube', index)}
                  onDragOver={handleDragOver}
                >
                  {tubeElements.map((element, elemIndex) => (
                    <div 
                      key={elemIndex} 
                      className="bg-primary/40 px-2 py-1 rounded-md text-foreground font-medium w-full text-center text-sm"
                    >
                      {element.symbol}
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => handleMix('testTube', index)}
                  disabled={!tubeElements.length || tubeElements.length < 2}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  Mix
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};