import React from 'react';
import { Compound } from '../types/chemistry';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface InventoryProps {
  compounds: Compound[];
}

export const Inventory: React.FC<InventoryProps> = ({ compounds }) => {
  return (
    <div className="p-4 bg-secondary rounded-lg">
      <h2 className="text-xl font-bold text-foreground mb-4">Inventory</h2>
      <div className="space-y-2">
        {compounds.map((compound, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-3 bg-primary/20 rounded hover:bg-primary/30 transition-colors cursor-help">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-bold">{compound.formula}</span>
                    <span className="text-foreground/60 text-sm">{compound.name}</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="p-3 max-w-xs">
                <div className="space-y-2">
                  <p className="font-bold">{compound.name}</p>
                  <p>Formula: {compound.formula}</p>
                  <p>Molar Mass: {compound.properties.molarMass} g/mol</p>
                  <p>State: {compound.properties.state}</p>
                  <div className="mt-2">
                    <p className="font-semibold">Elements:</p>
                    <ul className="list-disc list-inside">
                      {compound.elements.map((element, idx) => (
                        <li key={idx}>
                          {element.name} ({element.symbol})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};