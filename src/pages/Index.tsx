import React, { useState } from 'react';
import { PeriodicTable } from '../components/PeriodicTable';
import { Laboratory } from '../components/Laboratory';
import { Inventory } from '../components/Inventory';
import { Compound, Element } from '../types/chemistry';

const Index = () => {
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [testTubeElements, setTestTubeElements] = useState<Element[][]>(Array(6).fill([]));

  const handleCompoundCreated = (compound: Compound) => {
    setCompounds([...compounds, compound]);
  };

  const handleDrop = (e: React.DragEvent, tubeIndex: number) => {
    e.preventDefault();
    const elementData = e.dataTransfer.getData('element');
    if (elementData) {
      const element = JSON.parse(elementData) as Element;
      const newTestTubes = [...testTubeElements];
      newTestTubes[tubeIndex] = [...(newTestTubes[tubeIndex] || []), element];
      setTestTubeElements(newTestTubes);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTestTubeDragStart = (e: React.DragEvent, tubeIndex: number) => {
    e.dataTransfer.setData('testTube', tubeIndex.toString());
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-center text-foreground mb-8">
        Chemistry Lab
      </h1>
      
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-[1fr_300px] gap-8">
          <Laboratory onCompoundCreated={handleCompoundCreated} />
          <Inventory compounds={compounds} />
        </div>

        <div className="space-y-8">
          <PeriodicTable onElementDrag={setSelectedElement} />
          
          {/* Test Tubes Section */}
          <div className="bg-secondary p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Test Tubes</h3>
            <div className="grid grid-cols-6 gap-4">
              {testTubeElements.map((tubeElements, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center gap-2"
                  draggable
                  onDragStart={(e) => handleTestTubeDragStart(e, index)}
                >
                  <span className="text-sm text-foreground font-medium">#{index + 1}</span>
                  <div 
                    className="w-full h-32 bg-primary/20 rounded-lg flex flex-col items-center justify-start gap-1 border-2 border-primary p-1 overflow-y-auto cursor-move hover:border-primary/60 transition-colors"
                    onDrop={(e) => handleDrop(e, index)}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;