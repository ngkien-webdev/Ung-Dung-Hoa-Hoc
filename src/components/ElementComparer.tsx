
import React, { useState } from 'react';
import { Element } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategoryColorClass } from '@/lib/element-data/element-categories';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { X, ArrowLeftRight, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ElementCard } from './ElementCard';
import { toast } from 'sonner';

interface ElementComparerProps {
  initialElements?: Element[];
  onClose: () => void;
}

const ElementComparer: React.FC<ElementComparerProps> = ({ initialElements = [], onClose }) => {
  const [elements, setElements] = useState<Element[]>(initialElements);
  const [showAddButtons, setShowAddButtons] = useState(true);
  const { t } = useLanguage();

  const addElement = (element: Element) => {
    if (elements.length >= 3) {
      toast.info(t('ui.maxElementsReached', { defaultValue: 'Maximum of 3 elements for comparison' }));
      setShowAddButtons(false);
      return;
    }
    
    if (elements.some(e => e.atomicNumber === element.atomicNumber)) {
      toast.info(t('ui.elementAlreadyAdded', { defaultValue: 'Element already added to comparison' }));
      return;
    }
    
    setElements([...elements, element]);
  };

  const removeElement = (atomicNumber: number) => {
    setElements(elements.filter(e => e.atomicNumber !== atomicNumber));
    setShowAddButtons(true);
  };

  const clearAll = () => {
    setElements([]);
    setShowAddButtons(true);
  };

  if (elements.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>{t('ui.startComparison', { defaultValue: 'Start Element Comparison' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('ui.selectElementsToCompare', { defaultValue: 'Select elements to start comparing them' })}</p>
          <Button variant="outline" onClick={onClose} className="mt-4">
            {t('ui.close', { defaultValue: 'Close' })}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-primary" />
          {t('ui.elementComparison', { defaultValue: 'Element Comparison' })} ({elements.length}/3)
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearAll}>
            {t('ui.clearAll', { defaultValue: 'Clear All' })}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {elements.map(element => (
            <div key={element.atomicNumber} className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-0 right-0 z-10 h-6 w-6 bg-background/80 rounded-full"
                onClick={() => removeElement(element.atomicNumber)}
              >
                <X className="h-3 w-3" />
              </Button>
              <ElementCard element={element} onClick={() => {}} size="lg" />
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">{t('element.atomicNumber', { defaultValue: 'Atomic Number' })}</div>
                  <div>{element.atomicNumber}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">{t('element.atomicMass', { defaultValue: 'Atomic Mass' })}</div>
                  <div>{element.atomicMass.toFixed(4)}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">{t('element.meltingPoint', { defaultValue: 'Melting Point' })}</div>
                  <div>{element.meltingPoint ? `${element.meltingPoint}K` : t('common.unknown', { defaultValue: 'Unknown' })}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">{t('element.boilingPoint', { defaultValue: 'Boiling Point' })}</div>
                  <div>{element.boilingPoint ? `${element.boilingPoint}K` : t('common.unknown', { defaultValue: 'Unknown' })}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">{t('property.electronConfig', { defaultValue: 'Electron Config' })}</div>
                  <div className="truncate" title={element.electronConfiguration}>{element.electronConfiguration}</div>
                </div>
              </div>
            </div>
          ))}
          
          {elements.length < 3 && showAddButtons && (
            <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg h-full min-h-[300px]">
              <div className="text-center">
                <Plus className="h-10 w-10 mx-auto text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">
                  {t('ui.addElementToCompare', { defaultValue: 'Add element to compare' })}
                </p>
                <p className="text-sm text-muted-foreground/70">
                  {t('ui.clickElementToAdd', { defaultValue: 'Click on any element to add' })}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {elements.length > 1 && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium mb-4">{t('ui.propertiesComparison', { defaultValue: 'Properties Comparison' })}</h3>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left">{t('ui.property', { defaultValue: 'Property' })}</th>
                    {elements.map(element => (
                      <th key={element.atomicNumber} className="px-4 py-2 text-center">
                        <Badge className={`${getCategoryColorClass(element.category)} font-bold`}>
                          {element.symbol}
                        </Badge>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-t">{t('property.electronegativity', { defaultValue: 'Electronegativity' })}</td>
                    {elements.map(element => (
                      <td key={element.atomicNumber} className="px-4 py-2 border-t text-center">
                        {element.electronegativity ?? t('common.unknown', { defaultValue: 'Unknown' })}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-t">{t('property.atomicRadius', { defaultValue: 'Atomic Radius' })}</td>
                    {elements.map(element => (
                      <td key={element.atomicNumber} className="px-4 py-2 border-t text-center">
                        {element.atomicRadius ? `${element.atomicRadius} pm` : t('common.unknown', { defaultValue: 'Unknown' })}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-t">{t('property.ionizationEnergy', { defaultValue: 'Ionization Energy' })}</td>
                    {elements.map(element => (
                      <td key={element.atomicNumber} className="px-4 py-2 border-t text-center">
                        {element.ionizationEnergy ? `${element.ionizationEnergy} kJ/mol` : t('common.unknown', { defaultValue: 'Unknown' })}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-t">{t('property.density', { defaultValue: 'Density' })}</td>
                    {elements.map(element => (
                      <td key={element.atomicNumber} className="px-4 py-2 border-t text-center">
                        {element.density ? `${element.density} g/cm³` : t('common.unknown', { defaultValue: 'Unknown' })}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ElementComparer;
