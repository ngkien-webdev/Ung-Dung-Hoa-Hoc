
import React, { useState } from 'react';
import { ElementCard } from './ElementCard';
import { elements, elementPositions } from '@/lib/elements-data';
import { Element } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface PeriodicTableProps {
  onElementClick?: (element: Element) => void;
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onElementClick }) => {
  // Create an 18x10 grid for the main periodic table
  const rows = 10;
  const columns = 18;
  
  // Create a separate grid for lanthanides and actinides (2x15)
  const specialRows = 2;
  const specialColumns = 15;
  
  const [scale, setScale] = useState(1);
  const { t } = useLanguage();
  
  // Handle element click
  const handleElementClick = (element: Element) => {
    if (onElementClick) {
      onElementClick(element);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1.5));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.6));
  };
  
  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Button size="sm" variant="outline" onClick={zoomOut} disabled={scale <= 0.6}>
          <ZoomOut className="h-4 w-4 mr-1" />
          {t('ui.zoomOut', { defaultValue: 'Zoom Out' })}
        </Button>
        <Button size="sm" variant="outline" onClick={zoomIn} disabled={scale >= 1.5}>
          <ZoomIn className="h-4 w-4 mr-1" />
          {t('ui.zoomIn', { defaultValue: 'Zoom In' })}
        </Button>
      </div>

      <div className="overflow-auto w-full">
        <div className="transform transition-transform duration-300" style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}>
          {/* Main Periodic Table Grid */}
          <div 
            className="grid gap-1 w-max mx-auto mb-4 periodic-table-grid"
            style={{
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
            }}
          >
            {/* Render all elements in their positions */}
            {elements.filter(el => el.atomicNumber <= 57 || (el.atomicNumber >= 72 && el.atomicNumber <= 89) || el.atomicNumber >= 104).map(element => {
              const position = elementPositions.find(pos => pos.id === element.atomicNumber);
              
              if (!position) return null;
              
              return (
                <div 
                  key={element.atomicNumber}
                  className="flex element-cell transition-all duration-300"
                  style={{
                    gridRow: `${position.row} / span 1`,
                    gridColumn: `${position.col} / span 1`
                  }}
                >
                  <ElementCard 
                    element={element} 
                    onClick={() => handleElementClick(element)}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Lanthanides and Actinides */}
          <div 
            className="grid gap-1 w-max mx-auto mt-8 special-elements-grid"
            style={{
              gridTemplateRows: `repeat(${specialRows}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${specialColumns}, minmax(0, 1fr))`
            }}
          >
            {elements.filter(el => (el.atomicNumber >= 58 && el.atomicNumber <= 71) || (el.atomicNumber >= 90 && el.atomicNumber <= 103)).map(element => {
              const isLanthanide = element.atomicNumber >= 58 && element.atomicNumber <= 71;
              const isActinide = element.atomicNumber >= 90 && element.atomicNumber <= 103;
              
              let row = isLanthanide ? 1 : 2;
              let column = isLanthanide ? element.atomicNumber - 57 : element.atomicNumber - 89;
              
              return (
                <div 
                  key={element.atomicNumber}
                  className="flex element-cell transition-all duration-300"
                  style={{
                    gridRow: `${row} / span 1`,
                    gridColumn: `${column} / span 1`
                  }}
                >
                  <ElementCard 
                    element={element} 
                    onClick={() => handleElementClick(element)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;
