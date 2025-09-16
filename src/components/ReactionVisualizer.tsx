
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Download, 
  Maximize, 
  Minimize, 
  Thermometer, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Share2,
  Layers3,
  Beaker,
  CircleArrowDown,
  CircleArrowUp,
  TestTube,
  SquareArrowDown,
  SquareArrowUp,
  FlaskConical
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ReactionVisualizerProps {
  reaction: {
    reactants: { element: string; count: number }[];
    products: { element: string; count: number }[];
    name: string;
    description: string;
  };
  element1Symbol: string;
  element2Symbol: string;
  vrMode?: boolean;
  collaborationMode?: boolean;
  presentationMode?: boolean;
}

export const ReactionVisualizer: React.FC<ReactionVisualizerProps> = ({ 
  reaction, 
  element1Symbol, 
  element2Symbol,
  vrMode = false,
  collaborationMode = false,
  presentationMode = false
}) => {
  const { reactants, products, name, description } = reaction;
  const { t } = useLanguage();
  
  // State for visualization options
  const [view3D, setView3D] = useState(vrMode ? true : false);
  const [enhanced3D, setEnhanced3D] = useState(vrMode ? true : false);
  const [showBonds, setShowBonds] = useState(true);
  const [speed, setSpeed] = useState('medium');
  const [temperature, setTemperature] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reactionActive, setReactionActive] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [atomDetail, setAtomDetail] = useState(2); // 1-3 for level of detail
  const [viewMode, setViewMode] = useState<'standard' | 'infrared' | 'xray'>('standard');
  const [autoRotate, setAutoRotate] = useState(vrMode ? true : false);
  const [reactionPhase, setReactionPhase] = useState<'pre' | 'transition' | 'post'>('pre');
  
  // Reference for the container element
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle rotation and drag for 3D view
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 20, y: 0 });
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  
  // Monitor VR mode changes
  useEffect(() => {
    if (vrMode) {
      setView3D(true);
      setEnhanced3D(true);
      setAutoRotate(true);
    }
  }, [vrMode]);
  
  // Monitor presentation mode changes
  useEffect(() => {
    if (presentationMode) {
      setAtomDetail(3);
      setShowLabels(true);
    }
  }, [presentationMode]);

  // Generate atom positions with more complexity for larger molecules
  const generateAtomPositions = (molecule: { element: string; count: number }) => {
    return Array(molecule.count).fill(null).map((_, index) => {
      const isComplex = molecule.count > 2;
      let x, y;
      
      if (isComplex) {
        // Create more complex molecular shapes for molecules with more atoms
        const angle = (index / molecule.count) * 2 * Math.PI;
        const radius = 50 + (index % 2) * 10; // Alternating radius for more 3D effect
        x = radius * Math.cos(angle) + 50;
        y = radius * Math.sin(angle) + 50;
      } else {
        // Simple positioning for diatomic molecules
        const radius = 40 + index * 20;
        const angle = index * Math.PI / 2;
        x = radius * Math.cos(angle) + 50;
        y = radius * Math.sin(angle) + 50;
      }
      
      return { x, y, z: index % 3 * 10 }; // Adding z-coordinate for better 3D effect
    });
  };
  
  // Calculate bond properties with 3D perspective
  const calculateBondLength = (atom1Position: { x: number; y: number; z?: number }, atom2Position: { x: number; y: number; z?: number }) => {
    const dx = atom2Position.x - atom1Position.x;
    const dy = atom2Position.y - atom1Position.y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const calculateBondAngle = (atom1Position: { x: number; y: number; z?: number }, atom2Position: { x: number; y: number; z?: number }) => {
    const dx = atom2Position.x - atom1Position.x;
    const dy = atom2Position.y - atom1Position.y;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  };
  
  // Get z-position for dynamic 3D effect
  const getZPosition = (atomIndex: number, moleculeIndex: number, isReactant: boolean) => {
    const baseZ = isReactant ? -20 : 20;
    return baseZ + (atomIndex % 3) * 10 - (moleculeIndex % 2) * 5;
  };
  
  // Handle mouse events for 3D rotation with improved sensitivity
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setPrevPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && view3D) {
      const deltaX = e.clientX - prevPosition.x;
      const deltaY = e.clientY - prevPosition.y;
      
      // Apply rotation with sensitivity adjustment based on temperature
      const rotationFactor = 0.5 * (1 + temperature * 0.2);
      
      setRotation({
        x: rotation.x + deltaY * rotationFactor,
        y: rotation.y + deltaX * rotationFactor
      });
      
      setPrevPosition({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Reset view to default
  const resetView = () => {
    setRotation({ x: 20, y: 0 });
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };
  
  // Simulate reaction process
  const startReaction = () => {
    setReactionActive(true);
    setReactionPhase('transition');
    
    setTimeout(() => {
      setReactionPhase('post');
      
      setTimeout(() => {
        setReactionPhase('pre');
        setReactionActive(false);
      }, 3000);
    }, 2000);
    
    toast.success(t('reactions.reactionStarted', { defaultValue: 'Reaction Started' }), {
      description: t('reactions.reactionInProgress', { defaultValue: 'Watch the molecules interact' })
    });
  };
  
  // Download image of the reaction
  const downloadImage = () => {
    toast.info(t('reactions.downloadImage', { defaultValue: 'Download Image' }), {
      description: t('reactions.downloadSoon', { defaultValue: 'This feature will be available soon' })
    });
  };
  
  // Share reaction
  const shareReaction = () => {
    const reactionText = `${reaction.name}: ${reactants.map(r => `${r.count > 1 ? r.count : ''}${r.element}`).join(' + ')} → ${products.map(p => `${p.count > 1 ? p.count : ''}${p.element}`).join(' + ')}`;
    
    navigator.clipboard.writeText(reactionText).then(() => {
      toast.success(t('reactions.copied', { defaultValue: 'Reaction copied to clipboard' }));
    });
  };
  
  // Calculate reactive atom size based on temperature and settings
  const getAtomSize = (baseSize = 30) => {
    let size = temperature > 1.5 ? baseSize * (1 + (temperature - 1) * 0.1) : baseSize;
    
    // Adjust size based on atomDetail setting
    size = size * (0.8 + atomDetail * 0.1);
    
    // Adjust size for presentation mode
    if (presentationMode) {
      size = size * 1.25;
    }
    
    return size;
  };
  
  // Calculate atom pulse animation based on temperature
  const getAtomPulseClass = () => {
    if (temperature > 1.7) return 'atom-pulse-fast';
    if (temperature > 1.3) return 'atom-pulse-medium';
    if (temperature > 1) return 'atom-pulse-slow';
    return '';
  };
  
  // Get special effects class based on current modes
  const getSpecialEffectsClass = (isAtom: boolean = false) => {
    const classes = [];
    
    if (enhanced3D && isAtom) {
      classes.push('shadow-effect');
    }
    
    if (temperature > 1.7 && isAtom) {
      classes.push('glow-effect');
    }
    
    if (reactionActive && reactionPhase === 'transition') {
      classes.push('reaction-transition');
    }
    
    return classes.join(' ');
  };
  
  // Effect to handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Effect to add/remove event listeners when in 3D mode
  useEffect(() => {
    if (view3D) {
      document.addEventListener('mouseup', handleMouseUp as unknown as EventListener);
      
      return () => {
        document.removeEventListener('mouseup', handleMouseUp as unknown as EventListener);
      };
    }
  }, [view3D]);
  
  // Apply auto-rotation when in 3D mode
  useEffect(() => {
    let animationId: number;
    
    if (view3D && autoRotate && !isDragging) {
      const autoRotateFunc = () => {
        setRotation(prev => ({
          x: prev.x,
          y: prev.y + 0.1 * temperature // Rotation speed based on temperature
        }));
        animationId = requestAnimationFrame(autoRotateFunc);
      };
      
      animationId = requestAnimationFrame(autoRotateFunc);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [view3D, autoRotate, isDragging, temperature]);
  
  return (
    <div 
      ref={containerRef}
      className={`reaction-container ${isFullscreen ? 'fullscreen-reaction' : ''} ${enhanced3D ? 'enhanced-3d' : ''}
                  ${reactionActive ? 'reaction-active' : ''} ${collaborationMode ? 'collaboration-mode' : ''} 
                  ${presentationMode ? 'presentation-mode' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: isDragging && view3D ? 'grabbing' : view3D ? 'grab' : 'default' }}
    >
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <div 
        className={`molecule-3d-container speed-${speed} ${temperature > 1.5 ? 'temperature-high' : temperature > 1.2 ? 'temperature-medium' : ''}`}
        style={view3D ? { 
          perspective: enhanced3D ? '2000px' : '1000px',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` 
        } : {}}
      >
        {/* Reactants */}
        {reactants.map((molecule, moleculeIndex) => {
          const atomPositions = generateAtomPositions(molecule);
          
          return (
            <div 
              key={`reactant-${moleculeIndex}`} 
              className={`molecule ${view3D ? 'reaction-3d' : ''} ${speed}`}
              style={view3D ? {
                transform: `translateZ(${-50 - moleculeIndex * 10}px)`,
                transformStyle: 'preserve-3d'
              } : {}}
            >
              {atomPositions.map((atomPosition, atomIndex) => (
                <React.Fragment key={`atom-${atomIndex}`}>
                  <div
                    className={`atom ${getAtomPulseClass()} ${getSpecialEffectsClass(true)}`}
                    style={{
                      left: `${atomPosition.x}%`,
                      top: `${atomPosition.y}%`,
                      width: `${getAtomSize()}px`,
                      height: `${getAtomSize()}px`,
                      backgroundColor: molecule.element === element1Symbol ? 'var(--element-color-1, red)' : 'var(--element-color-2, blue)',
                      boxShadow: temperature > 1.5 ? `0 0 ${temperature * 10}px ${temperature * 5}px rgba(var(--primary-rgb), 0.3)` : 'none',
                      color: 'white',
                      zIndex: 2,
                      transform: view3D ? `translateZ(${getZPosition(atomIndex, moleculeIndex, true)}px)` : 'none',
                      filter: viewMode === 'xray' ? 'brightness(1.5) contrast(0.8) saturate(0.5)' : 
                             viewMode === 'infrared' ? 'hue-rotate(180deg) brightness(1.2)' : 'none'
                    }}
                  >
                    {molecule.element}
                  </div>
                  {showLabels && (
                    <div className="atom-tooltip">
                      {molecule.element} - {t(`element.name.${molecule.element.toLowerCase()}`, { defaultValue: molecule.element })}
                    </div>
                  )}
                </React.Fragment>
              ))}
              
              {showBonds && atomPositions.length > 1 &&
                atomPositions.map((atom1Position, atom1Index) =>
                  atomPositions.slice(atom1Index + 1).map((atom2Position, atom2Index) => {
                    const bondLength = calculateBondLength(atom1Position, atom2Position);
                    const bondAngle = calculateBondAngle(atom1Position, atom2Position);
                    return (
                      <div
                        key={`bond-${atom1Index}-${atom2Index}`}
                        className={`bond ${temperature > 1.5 ? 'bond-hot' : ''} ${getSpecialEffectsClass()}`}
                        style={{
                          left: `${atom1Position.x + getAtomSize()/2}%`,
                          top: `${atom1Position.y + getAtomSize()/2}%`,
                          width: `${bondLength}%`,
                          height: `${2 + temperature}px`,
                          transform: `rotate(${bondAngle}deg) ${view3D ? `translateZ(${(atom1Position.z || 0) + (atom2Position.z || 0) / 2}px)` : ''}`,
                          backgroundColor: temperature > 1.7 ? 'rgba(255, 100, 50, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                          zIndex: 1,
                          filter: viewMode === 'xray' ? 'brightness(1.5) contrast(0.8)' : 
                                 viewMode === 'infrared' ? 'hue-rotate(180deg) brightness(1.2)' : 'none'
                        }}
                      />
                    );
                  })
                )}
              {showLabels && (
                <div className="molecule-label">{molecule.element}{molecule.count > 1 ? `(${molecule.count})` : ''}</div>
              )}
            </div>
          );
        })}

        <div 
          className="reaction-arrow" 
          style={view3D ? { transform: 'translateZ(10px) scale(1.2)' } : {}}
          onClick={startReaction}
        >→</div>

        {/* Products */}
        {products.map((molecule, moleculeIndex) => {
          const atomPositions = generateAtomPositions(molecule);
          
          return (
            <div 
              key={`product-${moleculeIndex}`} 
              className={`molecule ${view3D ? 'reaction-3d' : ''} ${speed}`}
              style={view3D ? {
                transform: `translateZ(${50 + moleculeIndex * 10}px)`,
                transformStyle: 'preserve-3d'
              } : {}}
            >
              {atomPositions.map((atomPosition, atomIndex) => (
                <React.Fragment key={`atom-${atomIndex}`}>
                  <div
                    className={`atom product-atom ${getAtomPulseClass()} ${getSpecialEffectsClass(true)}`}
                    style={{
                      left: `${atomPosition.x}%`,
                      top: `${atomPosition.y}%`,
                      width: `${getAtomSize()}px`,
                      height: `${getAtomSize()}px`,
                      backgroundColor: molecule.element.includes(element1Symbol) ? 'var(--element-color-1, red)' : 'var(--element-color-2, blue)',
                      boxShadow: temperature > 1.5 ? `0 0 ${temperature * 8}px ${temperature * 4}px rgba(var(--primary-rgb), 0.3)` : 'none',
                      color: 'white',
                      zIndex: 2,
                      transform: view3D ? `translateZ(${getZPosition(atomIndex, moleculeIndex, false)}px)` : 'none',
                      filter: viewMode === 'xray' ? 'brightness(1.5) contrast(0.8) saturate(0.5)' : 
                             viewMode === 'infrared' ? 'hue-rotate(180deg) brightness(1.2)' : 'none'
                    }}
                  >
                    {molecule.element}
                  </div>
                  {showLabels && (
                    <div className="atom-tooltip">
                      {molecule.element} - {t(`element.name.${molecule.element.replace(/\d/g, '').toLowerCase()}`, { defaultValue: molecule.element })}
                    </div>
                  )}
                </React.Fragment>
              ))}
              
              {showBonds && atomPositions.length > 1 &&
                atomPositions.map((atom1Position, atom1Index) =>
                  atomPositions.slice(atom1Index + 1).map((atom2Position, atom2Index) => {
                    const bondLength = calculateBondLength(atom1Position, atom2Position);
                    const bondAngle = calculateBondAngle(atom1Position, atom2Position);
                    return (
                      <div
                        key={`bond-${atom1Index}-${atom2Index}`}
                        className={`bond ${temperature > 1.5 ? 'bond-hot' : ''} ${getSpecialEffectsClass()}`}
                        style={{
                          left: `${atom1Position.x + getAtomSize()/2}%`,
                          top: `${atom1Position.y + getAtomSize()/2}%`,
                          width: `${bondLength}%`,
                          height: `${2 + temperature}px`,
                          transform: `rotate(${bondAngle}deg) ${view3D ? `translateZ(${(atom1Position.z || 0) + (atom2Position.z || 0) / 2}px)` : ''}`,
                          backgroundColor: temperature > 1.7 ? 'rgba(255, 100, 50, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                          zIndex: 1,
                          filter: viewMode === 'xray' ? 'brightness(1.5) contrast(0.8)' : 
                                 viewMode === 'infrared' ? 'hue-rotate(180deg) brightness(1.2)' : 'none'
                        }}
                      />
                    );
                  })
                )}
              {showLabels && (
                <div className="molecule-label">{molecule.element}{molecule.count > 1 ? `(${molecule.count})` : ''}</div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-muted rounded-lg w-full max-w-md">
        <div className="text-sm font-mono text-center">
          {reactants.map((r, i) => (
            <span key={i}>
              {i > 0 && " + "}
              {r.count > 1 && r.count}{r.element}
            </span>
          ))}
          {" → "}
          {products.map((p, i) => (
            <span key={i}>
              {i > 0 && " + "}
              {p.count > 1 && p.count}{p.element}
            </span>
          ))}
        </div>
      </div>
      
      <Tabs defaultValue="basic" className="w-full max-w-md mt-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="basic">{t('reactions.basicControls', { defaultValue: 'Basic' })}</TabsTrigger>
          <TabsTrigger value="advanced">{t('reactions.advancedControls', { defaultValue: 'Advanced' })}</TabsTrigger>
          <TabsTrigger value="visual">{t('reactions.visualSettings', { defaultValue: 'Visual' })}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="reaction-controls flex flex-wrap gap-2 justify-center">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setView3D(!view3D)}
              className="transition-all hover:bg-primary/10"
            >
              {view3D ? t('reactions.2dView', { defaultValue: '2D View' }) : t('reactions.3dView', { defaultValue: '3D View' })}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowBonds(!showBonds)}
              className="transition-all hover:bg-primary/10"
            >
              {showBonds ? 
                <><EyeOff className="h-3 w-3 mr-1" /> {t('reactions.hideBonds', { defaultValue: 'Hide Bonds' })}</> : 
                <><Eye className="h-3 w-3 mr-1" /> {t('reactions.showBonds', { defaultValue: 'Show Bonds' })}</>
              }
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={resetView}
              disabled={!view3D}
              className="transition-all hover:bg-primary/10 disabled:opacity-50"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              {t('reactions.resetView', { defaultValue: 'Reset View' })}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={toggleFullscreen}
              className="transition-all hover:bg-primary/10"
            >
              {isFullscreen ? 
                <><Minimize className="h-3 w-3 mr-1" /> {t('reactions.exitFullscreen', { defaultValue: 'Exit Fullscreen' })}</> : 
                <><Maximize className="h-3 w-3 mr-1" /> {t('reactions.fullscreen', { defaultValue: 'Fullscreen' })}</>
              }
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={shareReaction}
              className="transition-all hover:bg-primary/10"
            >
              <Share2 className="h-3 w-3 mr-1" />
              {t('reactions.shareReaction', { defaultValue: 'Share' })}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={downloadImage}
              className="transition-all hover:bg-primary/10"
            >
              <Download className="h-3 w-3 mr-1" />
              {t('reactions.downloadImage', { defaultValue: 'Download' })}
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('reactions.animationSpeed', { defaultValue: 'Animation Speed' })}</span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={speed === 'slow' ? 'default' : 'outline'} 
                  onClick={() => setSpeed('slow')}
                  className="h-7 px-2 text-xs transition-all hover:bg-primary/10"
                >
                  {t('reactions.slow', { defaultValue: 'Slow' })}
                </Button>
                <Button 
                  size="sm" 
                  variant={speed === 'medium' ? 'default' : 'outline'} 
                  onClick={() => setSpeed('medium')}
                  className="h-7 px-2 text-xs transition-all hover:bg-primary/10"
                >
                  {t('reactions.medium', { defaultValue: 'Medium' })}
                </Button>
                <Button 
                  size="sm" 
                  variant={speed === 'fast' ? 'default' : 'outline'} 
                  onClick={() => setSpeed('fast')}
                  className="h-7 px-2 text-xs transition-all hover:bg-primary/10"
                >
                  {t('reactions.fast', { defaultValue: 'Fast' })}
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center">
                  <Thermometer className={`h-3 w-3 mr-1 ${temperature > 1.5 ? 'text-red-500' : ''}`} />
                  {t('reactions.temperature', { defaultValue: 'Temperature' })}
                </span>
                <span className={`text-xs ${temperature > 1.5 ? 'text-red-500 font-semibold' : ''}`}>
                  {Math.round(temperature * 100)}°
                </span>
              </div>
              <Slider
                defaultValue={[1]}
                min={0.5}
                max={2}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
                className={temperature > 1.5 ? 'temperature-slider-hot' : ''}
              />
            </div>
            
            <Button 
              className="w-full mt-4" 
              onClick={startReaction}
              disabled={reactionActive}
              variant={reactionActive ? "outline" : "default"}
            >
              <Beaker className="h-4 w-4 mr-2" />
              {reactionActive 
                ? t('reactions.reactionInProgress', { defaultValue: 'Reaction in Progress...' }) 
                : t('reactions.startReaction', { defaultValue: 'Start Reaction' })}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enhanced3d" className="text-sm flex items-center">
                <Beaker className="h-3 w-3 mr-1" />
                {t('reactions.enhanced3D', { defaultValue: 'Enhanced 3D' })}
              </Label>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {t('reactions.enhanced3DDesc', { defaultValue: 'Improved depth, shadows and effects' })}
                </span>
                <Switch 
                  id="enhanced3d" 
                  checked={enhanced3D}
                  onCheckedChange={setEnhanced3D}
                  disabled={!view3D}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="autorotate" className="text-sm flex items-center">
                <RotateCcw className="h-3 w-3 mr-1" />
                {t('reactions.autoRotate', { defaultValue: 'Auto-rotate' })}
              </Label>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {t('reactions.autoRotateDesc', { defaultValue: 'Automatic rotation in 3D view' })}
                </span>
                <Switch 
                  id="autorotate" 
                  checked={autoRotate}
                  onCheckedChange={setAutoRotate}
                  disabled={!view3D}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="labels" className="text-sm flex items-center">
                <Layers3 className="h-3 w-3 mr-1" />
                {t('reactions.showLabels', { defaultValue: 'Show Labels' })}
              </Label>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {t('reactions.showLabelsDesc', { defaultValue: 'Display element labels and tooltips' })}
                </span>
                <Switch 
                  id="labels" 
                  checked={showLabels}
                  onCheckedChange={setShowLabels}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm flex items-center" htmlFor="atomDetail">
                <TestTube className="h-3 w-3 mr-1" />
                {t('reactions.atomDetail', { defaultValue: 'Atom Detail' })}
              </Label>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {t('reactions.atomDetailLevel', { defaultValue: 'Level' })} {atomDetail}
                </span>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => setAtomDetail(Math.max(1, atomDetail - 1))} 
                    disabled={atomDetail <= 1}
                  >
                    <CircleArrowDown className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => setAtomDetail(Math.min(3, atomDetail + 1))}
                    disabled={atomDetail >= 3}
                  >
                    <CircleArrowUp className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-2">
            <Label className="text-sm mb-2 block">{t('reactions.viewMode', { defaultValue: 'View Mode' })}</Label>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'standard' ? 'default' : 'outline'}
                size="sm" 
                className="flex-1" 
                onClick={() => setViewMode('standard')}
              >
                <Eye className="h-3 w-3 mr-1" />
                {t('reactions.standard', { defaultValue: 'Standard' })}
              </Button>
              <Button 
                variant={viewMode === 'infrared' ? 'default' : 'outline'}
                size="sm" 
                className="flex-1" 
                onClick={() => setViewMode('infrared')}
              >
                <TestTube className="h-3 w-3 mr-1" />
                {t('reactions.infrared', { defaultValue: 'Infrared' })}
              </Button>
              <Button 
                variant={viewMode === 'xray' ? 'default' : 'outline'}
                size="sm" 
                className="flex-1" 
                onClick={() => setViewMode('xray')}
              >
                <FlaskConical className="h-3 w-3 mr-1" />
                {t('reactions.xray', { defaultValue: 'X-Ray' })}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="visual" className="space-y-4 pt-4">
          <div className="mb-4">
            <Label className="text-sm">{t('reactions.visualPresets', { defaultValue: 'Visual Presets' })}</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-auto py-2 flex flex-col items-center" 
                onClick={() => {
                  setTemperature(1);
                  setSpeed('medium');
                  setView3D(false);
                  setEnhanced3D(false);
                  setViewMode('standard');
                  setAtomDetail(2);
                }}
              >
                <Eye className="h-3 w-3 mb-1" />
                <span className="text-xs">{t('reactions.basicView', { defaultValue: 'Basic' })}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-auto py-2 flex flex-col items-center"
                onClick={() => {
                  setTemperature(1.8);
                  setSpeed('fast');
                  setView3D(true);
                  setEnhanced3D(true);
                  setViewMode('standard');
                  setAtomDetail(3);
                }}
              >
                <Beaker className="h-3 w-3 mb-1" />
                <span className="text-xs">{t('reactions.reactiveView', { defaultValue: 'Reactive' })}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-auto py-2 flex flex-col items-center"
                onClick={() => {
                  setTemperature(1.2);
                  setSpeed('slow');
                  setView3D(true);
                  setViewMode('xray');
                  setEnhanced3D(true);
                  setAtomDetail(3);
                }}
              >
                <TestTube className="h-3 w-3 mb-1" />
                <span className="text-xs">{t('reactions.scientificView', { defaultValue: 'Scientific' })}</span>
              </Button>
            </div>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start"
              >
                <SquareArrowDown className="h-4 w-4 mr-2" />
                {t('reactions.exportOptions', { defaultValue: 'Export Options' })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start"
                  onClick={downloadImage}
                >
                  <Download className="h-3 w-3 mr-2" />
                  {t('reactions.downloadImage', { defaultValue: 'Download as Image' })}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => {
                    toast.info(t('reactions.comingSoon', { defaultValue: 'Coming Soon' }), { 
                      description: t('reactions.exportSoon', { defaultValue: 'This feature will be available in future updates' })
                    });
                  }}
                >
                  <SquareArrowUp className="h-3 w-3 mr-2" />
                  {t('reactions.export3D', { defaultValue: 'Export 3D Model' })}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="pt-4 border-t mt-2">
            <div className="space-y-1 mb-4">
              <Label className="text-sm">{t('reactions.reactionStep', { defaultValue: 'Reaction Step' })}</Label>
              <div className="flex">
                <Button 
                  variant={reactionPhase === 'pre' ? "default" : "outline"} 
                  className="flex-1 rounded-r-none"
                  onClick={() => setReactionPhase('pre')}
                >
                  {t('reactions.preReaction', { defaultValue: 'Pre' })}
                </Button>
                <Button 
                  variant={reactionPhase === 'transition' ? "default" : "outline"} 
                  className="flex-1 rounded-none"
                  onClick={() => setReactionPhase('transition')}
                >
                  {t('reactions.transition', { defaultValue: 'Transition' })}
                </Button>
                <Button 
                  variant={reactionPhase === 'post' ? "default" : "outline"} 
                  className="flex-1 rounded-l-none"
                  onClick={() => setReactionPhase('post')}
                >
                  {t('reactions.postReaction', { defaultValue: 'Post' })}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {view3D && (
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md shadow backdrop-blur-sm">
          {t('atom.dragToRotate', { defaultValue: 'Drag to rotate' })}
        </div>
      )}
      
      {presentationMode && (
        <div className="absolute top-4 left-4 text-xs font-semibold bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-md shadow backdrop-blur-sm">
          {t('reactions.presentationModeActive', { defaultValue: 'Presentation Mode' })}
        </div>
      )}
    </div>
  );
};
