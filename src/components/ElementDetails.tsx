
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { elements } from '@/lib/elements-data';
import { Element } from '@/lib/constants';
import { AtomVisualizer } from './AtomVisualizer';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, ExternalLink, ChevronDown, ChevronUp, Sparkle, Zap, Star, ArrowLeftRight } from 'lucide-react';
import { fetchElementWikiInfo, getWikipediaUrl } from '@/services/wikiService';
import { toast } from 'sonner';
import WikiElementDetails from './WikiElementDetails';
import ElementComparison from './ElementComparison';

export interface ElementDetailsProps {
  element: Element;
  onClose: () => void;
  isOpen?: boolean;
}

const ElementDetails: React.FC<ElementDetailsProps> = ({ element, onClose, isOpen = false }) => {
  const { t, language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'basicInfo': true,
    'atomicProperties': false,
    'physicalProperties': false,
    'description': true,
    'uses': false
  });
  const [compareElement, setCompareElement] = useState<Element | null>(null);
  
  useEffect(() => {
    if (element) {
      const similarElements = elements.filter(e => 
        e.atomicNumber !== element.atomicNumber && 
        (e.category === element.category || 
         Math.abs(e.atomicNumber - element.atomicNumber) <= 3)
      );
      
      if (similarElements.length > 0) {
        const randomIndex = Math.floor(Math.random() * similarElements.length);
        setCompareElement(similarElements[randomIndex]);
      }
    }
  }, [element]);
  
  if (!isOpen) return null;
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleWikipediaClick = () => {
    window.open(getWikipediaUrl(element.name, language), '_blank');
  };
  
  const displayProperty = (value: any, suffix: string = '') => {
    if (value === undefined || value === null) return t('common.unknown', { defaultValue: 'Unknown' });
    return `${value}${suffix}`;
  };
  
  const getNewComparisonElement = () => {
    const eligibleElements = elements.filter(e => 
      e.atomicNumber !== element.atomicNumber && 
      e.atomicNumber !== compareElement?.atomicNumber
    );
    
    if (eligibleElements.length > 0) {
      const randomIndex = Math.floor(Math.random() * eligibleElements.length);
      setCompareElement(eligibleElements[randomIndex]);
      toast.success(t('ui.newComparisonElementSelected', { 
        defaultValue: `Now comparing with ${eligibleElements[randomIndex].name}`
      }));
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-auto">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto element-details-card shadow-2xl">
        <CardHeader className="sticky top-0 z-10 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center">
                {t(`element.name.${element.name.toLowerCase()}`, { defaultValue: element.name })}
                <Badge variant="outline" className="ml-2 text-xs">
                  {element.symbol}
                </Badge>
                <Sparkle className="ml-2 h-4 w-4 text-yellow-400" />
              </CardTitle>
              <CardDescription>
                {t(`category.${element.category}`, { defaultValue: element.category })}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="-mt-2 -mr-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pb-0">
          <Tabs defaultValue="info">
            <TabsList className="w-full">
              <TabsTrigger value="info">{t('tab.details', { defaultValue: 'Details' })}</TabsTrigger>
              <TabsTrigger value="visualization">{t('tab.visualization', { defaultValue: 'Visualization' })}</TabsTrigger>
              <TabsTrigger value="data">{t('tab.data', { defaultValue: 'Data' })}</TabsTrigger>
              <TabsTrigger value="compare">{t('tab.compare', { defaultValue: 'Compare' })}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4 py-4">
              <div className="border rounded-lg p-3">
                <button
                  onClick={() => toggleSection('basicInfo')}
                  className="font-medium text-lg w-full flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-blue-500" />
                    {t('section.basicInfo', { defaultValue: 'Basic Information' })}
                  </div>
                  {expandedSections.basicInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {expandedSections.basicInfo && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                    <div>
                      <span className="text-sm text-muted-foreground">{t('element.atomicNumber', { defaultValue: 'Atomic Number' })}</span>
                      <div className="font-medium">{element.atomicNumber}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t('element.atomicMass', { defaultValue: 'Atomic Mass' })}</span>
                      <div className="font-medium">{element.atomicMass.toFixed(4)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t('property.group', { defaultValue: 'Group' })}</span>
                      <div className="font-medium">{displayProperty(element.group)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t('property.period', { defaultValue: 'Period' })}</span>
                      <div className="font-medium">{element.period}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t('property.block', { defaultValue: 'Block' })}</span>
                      <div className="font-medium">{element.block}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t('property.discovery', { defaultValue: 'Discovery' })}</span>
                      <div className="font-medium">{displayProperty(element.discoveryYear)}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border rounded-lg p-3">
                <button
                  onClick={() => toggleSection('atomicProperties')}
                  className="font-medium text-lg w-full flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                    {t('section.atomicProperties', { defaultValue: 'Atomic Properties' })}
                  </div>
                  {expandedSections.atomicProperties ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {expandedSections.atomicProperties && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                    <div>
                      <span className="text-sm text-muted-foreground">{t('property.electronConfig', { defaultValue: 'Electron Configuration' })}</span>
                      <div className="font-medium">{displayProperty(element.electronConfiguration)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t('property.electronegativity', { defaultValue: 'Electronegativity' })}</span>
                      <div className="font-medium">{displayProperty(element.electronegativity)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t('property.atomicRadius', { defaultValue: 'Atomic Radius' })}</span>
                      <div className="font-medium">{element.atomicRadius ? `${element.atomicRadius} pm` : t('common.unknown', { defaultValue: 'Unknown' })}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t('property.ionizationEnergy', { defaultValue: 'Ionization Energy' })}</span>
                      <div className="font-medium">{element.ionizationEnergy ? `${element.ionizationEnergy} kJ/mol` : t('common.unknown', { defaultValue: 'Unknown' })}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border rounded-lg p-3">
                <button
                  onClick={() => toggleSection('physicalProperties')}
                  className="font-medium text-lg w-full flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-purple-500" />
                    {t('section.physicalProperties', { defaultValue: 'Physical Properties' })}
                  </div>
                  {expandedSections.physicalProperties ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {expandedSections.physicalProperties && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                    <div>
                      <span className="text-sm text-muted-foreground">{t('property.state', { defaultValue: 'State' })}</span>
                      <div className="font-medium">{t(`element.state.${element.state}`, { defaultValue: element.state })}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t('property.density', { defaultValue: 'Density' })}</span>
                      <div className="font-medium">{element.density ? `${element.density} g/cm³` : t('common.unknown', { defaultValue: 'Unknown' })}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t('property.meltingPoint', { defaultValue: 'Melting Point' })}</span>
                      <div className="font-medium">{element.meltingPoint ? `${element.meltingPoint} K` : t('common.unknown', { defaultValue: 'Unknown' })}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">{t('property.boilingPoint', { defaultValue: 'Boiling Point' })}</span>
                      <div className="font-medium">{element.boilingPoint ? `${element.boilingPoint} K` : t('common.unknown', { defaultValue: 'Unknown' })}</div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="visualization" className="py-4">
              <div className="flex flex-col items-center">
                <AtomVisualizer element={element} />
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="space-y-4 py-4">
              <WikiElementDetails element={element} />

              {element.uses && element.uses.length > 0 && (
                <div className="border rounded-lg p-3">
                  <button
                    onClick={() => toggleSection('uses')}
                    className="font-medium text-lg w-full flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-amber-500" />
                      {t('section.commonUses', { defaultValue: 'Common Uses' })}
                    </div>
                    {expandedSections.uses ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  
                  {expandedSections.uses && (
                    <ul className="list-disc list-inside text-sm space-y-1 mt-3">
                      {element.uses.map((use, index) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="compare" className="py-4">
              {compareElement ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <ArrowLeftRight className="h-4 w-4 text-primary" />
                      {t('ui.compareElements', { defaultValue: 'Element Comparison' })}
                    </h3>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={getNewComparisonElement}
                      className="text-xs"
                    >
                      {t('ui.newComparison', { defaultValue: 'New Comparison' })}
                    </Button>
                  </div>
                  
                  <ElementComparison element1={element} element2={compareElement} />
                </>
              ) : (
                <div className="text-center p-8">
                  <p>{t('ui.loadingComparison', { defaultValue: 'Loading comparison data...' })}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-end pt-4 pb-4">
          <Button variant="outline" size="sm" onClick={handleWikipediaClick} className="gap-1">
            <ExternalLink className="h-3 w-3" />
            {t('common.viewOnWikipedia', { defaultValue: 'View on Wikipedia' })}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ElementDetails;
