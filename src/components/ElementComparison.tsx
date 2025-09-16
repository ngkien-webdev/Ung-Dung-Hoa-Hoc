
import React from 'react';
import { Element } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { getCategoryColorClass } from '@/lib/element-data/element-categories';
import { ArrowLeftRight, Scale, Zap, Thermometer } from 'lucide-react';

interface ElementComparisonProps {
  element1: Element;
  element2: Element;
}

const ElementComparison: React.FC<ElementComparisonProps> = ({ element1, element2 }) => {
  const { t } = useLanguage();
  
  // Helper to normalize property values for comparison
  const normalizeValue = (value1: number | null, value2: number | null, property: string) => {
    if (value1 === null || value2 === null) return { value1Percent: 50, value2Percent: 50 };
    
    // Apply different scaling for different properties
    let max = 0;
    
    switch (property) {
      case 'atomicMass':
        max = Math.max(value1, value2, 10); // At least 10 for visualization
        break;
      case 'atomicRadius':
        max = Math.max(value1, value2, 50); // At least 50 for visualization
        break;
      case 'density':
        max = Math.max(value1, value2, 5); // At least 5 for visualization
        break;
      case 'electronegativity':
        max = Math.max(value1, value2, 4); // Max is around 4 on Pauling scale
        break;
      default:
        max = Math.max(value1, value2);
    }
    
    const value1Percent = (value1 / max) * 100;
    const value2Percent = (value2 / max) * 100;
    
    return { value1Percent, value2Percent };
  };
  
  const compareProperty = (property: keyof Element, label: string, icon: React.ReactNode, unit: string = '') => {
    const value1 = element1[property] as number | null;
    const value2 = element2[property] as number | null;
    
    if (typeof value1 !== 'number' && typeof value2 !== 'number') {
      return null; // Skip if both values are not numbers
    }
    
    const { value1Percent, value2Percent } = normalizeValue(
      typeof value1 === 'number' ? value1 : 0, 
      typeof value2 === 'number' ? value2 : 0, 
      property
    );
    
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-sm font-medium">
            {icon}
            <span>{t(`property.${property}`, { defaultValue: label })}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-semibold">{element1.symbol}</span>
              <span>{value1 !== null ? `${value1}${unit}` : t('common.unknown', { defaultValue: 'Unknown' })}</span>
            </div>
            <Progress value={value1Percent} className="h-2" 
              style={{ backgroundColor: 'rgba(200,200,200,0.3)', '--theme-primary': getCategoryColorClass(element1.category).replace('bg-', 'rgb(var(--') + '))' } as React.CSSProperties} 
            />
          </div>
          
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-semibold">{element2.symbol}</span>
              <span>{value2 !== null ? `${value2}${unit}` : t('common.unknown', { defaultValue: 'Unknown' })}</span>
            </div>
            <Progress value={value2Percent} className="h-2"
              style={{ backgroundColor: 'rgba(200,200,200,0.3)', '--theme-primary': getCategoryColorClass(element2.category).replace('bg-', 'rgb(var(--') + '))' } as React.CSSProperties}
            />
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ArrowLeftRight className="h-5 w-5 text-primary" />
          {t('ui.compareElements', { defaultValue: 'Element Comparison' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Element headers */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`p-3 rounded-md ${getCategoryColorClass(element1.category).replace('bg-', 'bg-opacity-20 bg-')} border`}>
            <div className="font-bold text-lg">{element1.symbol}</div>
            <div className="text-sm">{t(`element.name.${element1.name.toLowerCase()}`, { defaultValue: element1.name })}</div>
          </div>
          
          <div className={`p-3 rounded-md ${getCategoryColorClass(element2.category).replace('bg-', 'bg-opacity-20 bg-')} border`}>
            <div className="font-bold text-lg">{element2.symbol}</div>
            <div className="text-sm">{t(`element.name.${element2.name.toLowerCase()}`, { defaultValue: element2.name })}</div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Property comparisons */}
        {compareProperty('atomicMass', 'Atomic Mass', <Scale className="h-4 w-4 text-blue-500" />, ' u')}
        {compareProperty('atomicRadius', 'Atomic Radius', <Scale className="h-4 w-4 text-green-500" />, ' pm')}
        {compareProperty('electronegativity', 'Electronegativity', <Zap className="h-4 w-4 text-amber-500" />)}
        {compareProperty('meltingPoint', 'Melting Point', <Thermometer className="h-4 w-4 text-red-500" />, ' K')}
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          {t('ui.comparisonNote', { defaultValue: 'Values are shown relative to each other for comparison' })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ElementComparison;
