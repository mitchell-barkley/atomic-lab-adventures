import React, { useState } from 'react';
import { Element, Compound } from '../types/chemistry';
import { combineElements } from '../utils/chemistry';
import { useToast } from '../hooks/use-toast';
import { Slider } from './ui/slider';

interface LaboratoryProps {
  onCompoundCreated: (compound: Compound) => void;
}

export const Laboratory: React.FC<LaboratoryProps> = ({ onCompoundCreated }) => {
  const [temperature, setTemperature] = useState(25);
  const [isCentrifugeActive, setIsCentrifugeActive] = useState(false);
  const { toast } = useToast();

  const getBurnerColor = () => {
    if (temperature <= 25) return 'bg-gray-500/20 border-gray-500';
    if (temperature < 100) return 'bg-yellow-500/20 border-yellow-500';
    if (temperature < 250) return 'bg-orange-500/20 border-orange-500';
    return 'bg-red-500/20 border-red-500';
  };

  const getBurnerTextColor = () => {
    if (temperature <= 25) return 'text-gray-600';
    if (temperature < 100) return 'text-yellow-600';
    if (temperature < 250) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleEquipmentDrop = (e: React.DragEvent, equipment: 'burner' | 'centrifuge') => {
    e.preventDefault();
    const tubeIndex = parseInt(e.dataTransfer.getData('testTube'));
    
    if (isNaN(tubeIndex)) return;

    if (equipment === 'burner') {
      toast({
        title: "Heating Test Tube",
        description: `Test tube #${tubeIndex + 1} is being heated to ${temperature}°C`,
      });
    } else if (equipment === 'centrifuge') {
      setIsCentrifugeActive(true);
      toast({
        title: "Centrifuge Active",
        description: `Separating contents of test tube #${tubeIndex + 1}`,
      });
      
      setTimeout(() => {
        setIsCentrifugeActive(false);
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

  return (
    <div className="flex flex-col gap-4 p-4 bg-secondary rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-foreground text-center">Laboratory Equipment</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Bunsen Burner Section */}
        <div 
          className="bg-primary/10 p-4 rounded-lg border-2 border-primary/30"
          onDrop={(e) => handleEquipmentDrop(e, 'burner')}
          onDragOver={handleDragOver}
        >
          <h3 className="text-base font-semibold text-foreground mb-3 text-center">Bunsen Burner</h3>
          <div className="flex flex-col items-center gap-3">
            <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center ${getBurnerColor()}`}>
              <span className={`font-bold ${getBurnerTextColor()}`}>
                {temperature <= 25 ? 'Off' : `${temperature}°C`}
              </span>
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
          className="bg-primary/10 p-4 rounded-lg border-2 border-primary/30"
          onDrop={(e) => handleEquipmentDrop(e, 'centrifuge')}
          onDragOver={handleDragOver}
        >
          <h3 className="text-base font-semibold text-foreground mb-3 text-center">Centrifuge</h3>
          <div className="flex flex-col items-center gap-3">
            <div className={`w-20 h-20 bg-blue-500/20 rounded-full border-2 border-blue-500 flex items-center justify-center transition-transform duration-500 ${isCentrifugeActive ? 'animate-spin' : ''}`}>
              <span className="text-blue-600 font-bold">Spin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};