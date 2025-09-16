
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ElementCategory, ELEMENT_CATEGORIES } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Sliders, RotateCcw } from 'lucide-react';

interface SearchFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  categories: ElementCategory[];
  states: ('solid' | 'liquid' | 'gas' | 'unknown')[];
  atomicNumber: [number, number];
  atomicMass: [number, number];
}

const defaultFilters: FilterOptions = {
  categories: [],
  states: [],
  atomicNumber: [1, 118],
  atomicMass: [1, 300]
};

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const { t } = useLanguage();
  
  const handleCategoryChange = (category: ElementCategory, checked: boolean) => {
    let newCategories = [...filters.categories];
    
    if (checked) {
      newCategories.push(category);
    } else {
      newCategories = newCategories.filter(c => c !== category);
    }
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleStateChange = (state: 'solid' | 'liquid' | 'gas' | 'unknown', checked: boolean) => {
    let newStates = [...filters.states];
    
    if (checked) {
      newStates.push(state);
    } else {
      newStates = newStates.filter(s => s !== state);
    }
    
    const newFilters = { ...filters, states: newStates };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleAtomicNumberChange = (value: number[]) => {
    const newFilters = { ...filters, atomicNumber: [value[0], value[1]] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleAtomicMassChange = (value: number[]) => {
    const newFilters = { ...filters, atomicMass: [value[0], value[1]] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const resetFilters = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {t('ui.advancedFilters', { defaultValue: 'Advanced Filters' })}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            {t('ui.advancedFilters', { defaultValue: 'Advanced Filters' })}
          </SheetTitle>
          <SheetDescription>
            {t('ui.filterElementsDescription', { defaultValue: 'Refine your element search with multiple criteria' })}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex justify-end mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters} 
            className="text-xs flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            {t('ui.resetFilters', { defaultValue: 'Reset Filters' })}
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">{t('ui.categories', { defaultValue: 'Categories' })}</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ELEMENT_CATEGORIES).map(([key, value]) => {
                const categoryKey = key as ElementCategory;
                return (
                  <div key={key} className="flex items-start space-x-2">
                    <Checkbox 
                      id={`category-${key}`}
                      checked={filters.categories.includes(categoryKey)}
                      onCheckedChange={(checked) => handleCategoryChange(categoryKey, checked === true)}
                    />
                    <Label 
                      htmlFor={`category-${key}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t(`category.${categoryKey}`, { defaultValue: value })}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">{t('ui.states', { defaultValue: 'States of Matter' })}</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['solid', 'liquid', 'gas', 'unknown'] as const).map((state) => (
                <div key={state} className="flex items-start space-x-2">
                  <Checkbox 
                    id={`state-${state}`}
                    checked={filters.states.includes(state)}
                    onCheckedChange={(checked) => handleStateChange(state, checked === true)}
                  />
                  <Label 
                    htmlFor={`state-${state}`}
                    className="text-sm leading-none capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t(`element.state.${state}`, { defaultValue: state })}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <h3 className="text-sm font-medium">{t('ui.atomicNumberRange', { defaultValue: 'Atomic Number Range' })}</h3>
              <span className="text-xs text-muted-foreground">
                {filters.atomicNumber[0]} - {filters.atomicNumber[1]}
              </span>
            </div>
            <Slider 
              min={1} 
              max={118} 
              step={1}
              value={[filters.atomicNumber[0], filters.atomicNumber[1]]} 
              onValueChange={handleAtomicNumberChange}
              className="mt-4" 
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <h3 className="text-sm font-medium">{t('ui.atomicMassRange', { defaultValue: 'Atomic Mass Range' })}</h3>
              <span className="text-xs text-muted-foreground">
                {filters.atomicMass[0].toFixed(1)} - {filters.atomicMass[1].toFixed(1)}
              </span>
            </div>
            <Slider 
              min={1} 
              max={300} 
              step={0.1}
              value={[filters.atomicMass[0], filters.atomicMass[1]]} 
              onValueChange={handleAtomicMassChange}
              className="mt-4" 
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
