import React, { useState } from 'react';
import { PeriodicTable } from '../components/PeriodicTable';
import { Laboratory } from '../components/Laboratory';
import { Inventory } from '../components/Inventory';
import { Compound, Element } from '../types/chemistry';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { combineElements } from '../utils/chemistry';
import { X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [testTubeElements, setTestTubeElements] = useState<Element[][]>(Array(6).fill([]));
  const [pendingCompound, setPendingCompound] = useState<Compound | null>(null);
  const { toast } = useToast();

  const handleCompoundCreated = (compound: Compound) => {
    setPendingCompound(compound);
  };

  const confirmCompound = () => {
    if (pendingCompound) {
      setCompounds([...compounds, pendingCompound]);
      setPendingCompound(null);
      toast({
        title: "Success!",
        description: `Added ${pendingCompound.name} to inventory`,
      });
    }
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

  const handleMix = (tubeIndex: number) => {
    const elements = testTubeElements[tubeIndex];
    if (elements.length < 2) {
      toast({
        title: "Cannot Mix",
        description: "Need at least 2 elements to create a compound",
        variant: "destructive",
      });
      return;
    }

    const compound = combineElements(elements);
    if (compound) {
      handleCompoundCreated(compound);
      const newTestTubes = [...testTubeElements];
      newTestTubes[tubeIndex] = [];
      setTestTubeElements(newTestTubes);
    } else {
      toast({
        title: "Mix Failed",
        description: "These elements cannot form a compound",
        variant: "destructive",
      });
    }
  };

  const handleEmptyTube = (tubeIndex: number) => {
    const newTestTubes = [...testTubeElements];
    newTestTubes[tubeIndex] = [];
    setTestTubeElements(newTestTubes);
    toast({
      title: "Test Tube Emptied",
      description: "All elements have been removed",
    });
  };

  const handleRemoveElement = (tubeIndex: number, elementIndex: number) => {
    const newTestTubes = [...testTubeElements];
    newTestTubes[tubeIndex] = newTestTubes[tubeIndex].filter((_, idx) => idx !== elementIndex);
    setTestTubeElements(newTestTubes);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTestTubeDragStart = (e: React.DragEvent, tubeIndex: number) => {
    e.dataTransfer.setData('testTube', tubeIndex.toString());
  };

  return (
    <div className="min-h-screen bg-background p-3">
      <h1 className="text-2xl font-bold text-center text-foreground mb-4">
        Chemistry Lab
      </h1>
      
      <div className="max-w-[1200px] mx-auto space-y-4">
        <div className="grid grid-cols-[200px_1fr_200px] gap-3">
          <Laboratory onCompoundCreated={handleCompoundCreated} />
          <PeriodicTable onElementDrag={setSelectedElement} />
          <Inventory compounds={compounds} />
        </div>

        {/* Test Tubes Section */}
        <div className="bg-secondary p-3 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-2 text-center">Test Tubes</h3>
          <div className="grid grid-cols-6 gap-2">
            {testTubeElements.map((tubeElements, index) => (
              <div 
                key={index}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-sm text-foreground font-medium">#{index + 1}</span>
                <div 
                  className="w-full h-24 bg-primary/20 rounded-lg flex flex-col items-center justify-start gap-1 border-2 border-primary p-1 overflow-y-auto cursor-move hover:border-primary/60 transition-colors"
                  draggable
                  onDragStart={(e) => handleTestTubeDragStart(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragOver={handleDragOver}
                >
                  {tubeElements.map((element, elemIndex) => (
                    <div 
                      key={elemIndex} 
                      className="bg-primary/40 px-2 py-1 rounded-md text-foreground font-medium w-full text-center text-sm relative group"
                    >
                      {element.symbol}
                      <button
                        onClick={() => handleRemoveElement(index, elemIndex)}
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
                    onClick={() => handleMix(index)}
                    disabled={tubeElements.length < 2}
                  >
                    Mix
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEmptyTube(index)}
                    disabled={tubeElements.length === 0}
                  >
                    Empty
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={!!pendingCompound} onOpenChange={() => setPendingCompound(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New Compound Created</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingCompound && (
                <div className="space-y-2 mt-2">
                  <p className="font-semibold">{pendingCompound.name}</p>
                  <p>Formula: {pendingCompound.formula}</p>
                  <p>Molar Mass: {pendingCompound.properties.molarMass} g/mol</p>
                  <p>State: {pendingCompound.properties.state}</p>
                  <div className="mt-2">
                    <p className="font-semibold">Elements:</p>
                    <ul className="list-disc list-inside">
                      {pendingCompound.elements.map((element, idx) => (
                        <li key={idx}>
                          {element.name} ({element.symbol})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCompound}>Add to Inventory</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;