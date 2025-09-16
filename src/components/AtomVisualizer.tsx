
import { useState, useEffect, useRef } from 'react';
import { Element } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, ZoomIn, ZoomOut, MousePointer, Plus, Minus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/contexts/LanguageContext';

interface AtomVisualizerProps {
  element: Element;
}

export function AtomVisualizer({ element }: AtomVisualizerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const [rotationOffset, setRotationOffset] = useState({ x: 0, y: 0 });
  const [electronHighlight, setElectronHighlight] = useState<number | null>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  // Colors for different electron shells
  const shellColors = [
    'rgba(0, 150, 255, 0.7)',
    'rgba(0, 200, 150, 0.7)',
    'rgba(255, 100, 100, 0.7)',
    'rgba(255, 200, 0, 0.7)',
    'rgba(200, 0, 255, 0.7)',
    'rgba(150, 150, 150, 0.7)',
    'rgba(255, 150, 0, 0.7)',
  ];
  
  // Improved calculation for electron shell distribution
  const electronShellConfig = () => {
    // More accurate shell calculation
    const atomicNumber = element.atomicNumber;
    const shells = [];
    
    if (atomicNumber <= 2) shells.push(atomicNumber);
    else if (atomicNumber <= 10) shells.push(2, atomicNumber - 2);
    else if (atomicNumber <= 18) shells.push(2, 8, atomicNumber - 10);
    else if (atomicNumber <= 36) shells.push(2, 8, 18, atomicNumber - 28);
    else if (atomicNumber <= 54) shells.push(2, 8, 18, 18, atomicNumber - 46);
    else if (atomicNumber <= 86) shells.push(2, 8, 18, 32, 18, atomicNumber - 78);
    else shells.push(2, 8, 18, 32, 32, atomicNumber - 92);
    
    // Adjust for elements with unusual configurations
    if (element.symbol === 'Cr' || element.symbol === 'Cu' || 
        element.symbol === 'Nb' || element.symbol === 'Mo' || 
        element.symbol === 'Ru' || element.symbol === 'Rh' || 
        element.symbol === 'Pd' || element.symbol === 'Ag') {
      // These elements have special electron configurations
      const lastShell = shells.pop() || 0;
      const secondLastShell = shells.pop() || 0;
      shells.push(secondLastShell - 1);
      shells.push(lastShell + 1);
    }
    
    return shells;
  };
  
  const shells = electronShellConfig();
  
  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!visualizerRef.current) return;
      
      const rect = visualizerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
      
      if (isDragging) {
        const deltaX = (e.clientX - dragStartPosition.x) * 0.5;
        const deltaY = (e.clientY - dragStartPosition.y) * 0.3;
        
        setRotationOffset({
          x: rotationOffset.x + deltaY,
          y: rotationOffset.y + deltaX
        });
        
        setDragStartPosition({ x: e.clientX, y: e.clientY });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartPosition, rotationOffset]);
  
  // Auto-rotate the atom
  useEffect(() => {
    let intervalId: number;
    
    if (isRotating) {
      intervalId = window.setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 50);
    }
    
    return () => clearInterval(intervalId);
  }, [isRotating]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartPosition({ x: e.clientX, y: e.clientY });
    setIsRotating(false);
  };
  
  const handleShellHover = (shellIndex: number) => {
    setElectronHighlight(shellIndex);
  };
  
  const handleShellLeave = () => {
    setElectronHighlight(null);
  };

  return (
    <Card className="w-full shadow-lg glassmorphism">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>{t('atom.visualization')}</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              variant={isRotating ? "default" : "outline"} 
              size="icon"
              onClick={() => setIsRotating(prev => !prev)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={visualizerRef}
          className="relative h-64 w-full flex items-center justify-center overflow-hidden cursor-grab enhanced-3d"
          style={{ 
            transform: `scale(${scale})`,
            transition: 'transform 0.3s ease-out' 
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Mouse position indicator */}
          {isDragging && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-md z-50">
              {t('atom.dragToRotate')}
            </div>
          )}
          
          {/* Nucleus */}
          <div 
            className="absolute rounded-full bg-blue-600 atom-core z-30 animate-ping-slow"
            style={{ 
              width: '40px', 
              height: '40px',
              backgroundColor: `rgba(${element.atomicNumber < 30 ? '0, 100, 255' : element.atomicNumber < 60 ? '100, 0, 255' : '255, 50, 50'}, 0.8)`,
              boxShadow: `0 0 20px rgba(${element.atomicNumber < 30 ? '0, 100, 255' : element.atomicNumber < 60 ? '100, 0, 255' : '255, 50, 50'}, 0.5)`
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
              {element.symbol}
            </div>
          </div>
          
          {/* Electron shells */}
          {shells.map((electronCount, i) => {
            const diameter = 80 + i * 60;
            const isHighlighted = electronHighlight === i;
            
            return (
              <div 
                key={i}
                className="absolute rounded-full electron-shell"
                style={{ 
                  width: `${diameter}px`, 
                  height: `${diameter}px`,
                  transform: `rotateX(${60 + rotationOffset.x}deg) rotateZ(${rotation + rotationOffset.y + i * 20}deg)`,
                  borderColor: shellColors[i % shellColors.length],
                  borderWidth: isHighlighted ? '2px' : '1px',
                  opacity: electronHighlight === null || isHighlighted ? 1 : 0.4,
                  transition: 'opacity 0.3s ease, border-width 0.3s ease',
                  '--orbit-radius': `${diameter/2}px`
                } as React.CSSProperties}
                onMouseEnter={() => handleShellHover(i)}
                onMouseLeave={handleShellLeave}
              >
                {/* Shell label */}
                {isHighlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {t('atom.shell')} {i+1}: {electronCount} e⁻
                  </div>
                )}
                
                {/* Electrons */}
                {Array.from({ length: Math.min(electronCount, 12) }).map((_, j) => {
                  const angle = (j / Math.min(electronCount, 12)) * 2 * Math.PI;
                  const delay = j * 0.5;
                  
                  return (
                    <div 
                      key={j}
                      className={`absolute rounded-full ${isHighlighted ? 'bg-blue-400' : 'bg-blue-300'} electron`}
                      style={{ 
                        width: isHighlighted ? '10px' : '8px', 
                        height: isHighlighted ? '10px' : '8px',
                        top: `calc(50% - ${isHighlighted ? 5 : 4}px)`,
                        left: `calc(50% - ${isHighlighted ? 5 : 4}px)`,
                        transform: `rotate(${angle}rad) translateX(${diameter/2}px)`,
                        animation: `electron-orbit ${8 + i}s linear infinite ${delay}s`,
                        boxShadow: isHighlighted ? '0 0 5px rgba(0, 200, 255, 0.8)' : 'none',
                        zIndex: isHighlighted ? 40 : 20
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
          
          {/* Electron cloud visualization */}
          <div 
            className="absolute rounded-full electron-cloud"
            style={{ 
              width: `${80 + shells.length * 60}px`, 
              height: `${80 + shells.length * 60}px`,
              background: `radial-gradient(circle, rgba(255,255,255,0) 30%, ${shellColors[shells.length % shellColors.length]} 100%)`,
              opacity: 0.15,
              pointerEvents: 'none'
            }}
          />
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>{t('atom.zoom')}: {(scale * 100).toFixed(0)}%</span>
            <span className="flex items-center gap-1">
              <MousePointer className="h-3 w-3" /> {isDragging ? t('atom.rotating') : t('atom.interactive')}
            </span>
          </div>
          <Slider 
            value={[scale * 100]} 
            min={50} 
            max={200} 
            step={10}
            onValueChange={(value) => setScale(value[0] / 100)}
          />
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="bg-secondary px-3 py-2 rounded-md flex justify-between">
            <span className="text-muted-foreground">{t('atom.protons')}</span>
            <span>{element.atomicNumber}</span>
          </div>
          <div className="bg-secondary px-3 py-2 rounded-md flex justify-between">
            <span className="text-muted-foreground">{t('atom.electrons')}</span>
            <span>{element.atomicNumber}</span>
          </div>
          <div className="bg-secondary px-3 py-2 rounded-md flex justify-between">
            <span className="text-muted-foreground">{t('atom.neutrons')}</span>
            <span>{Math.round(element.atomicMass) - element.atomicNumber}</span>
          </div>
          <div className="bg-secondary px-3 py-2 rounded-md flex justify-between">
            <span className="text-muted-foreground">{t('atom.mass')}</span>
            <span>{element.atomicMass.toFixed(2)} u</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
