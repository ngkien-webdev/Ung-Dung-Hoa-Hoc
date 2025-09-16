
import { useState } from 'react';
import { Element } from "@/lib/constants";
import { getCategoryColorClass, getCategoryTextClass } from "@/lib/element-data/element-categories";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';

interface ElementCardProps {
  element: Element;
  onClick: (element: Element) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function ElementCard({ element, onClick, size = 'md' }: ElementCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const { t } = useLanguage();
  
  // Dynamic sizing
  const sizeClasses = {
    sm: 'w-16 h-16 p-1 text-xs',
    md: 'w-20 h-20 p-2 text-sm',
    lg: 'w-28 h-28 p-3'
  };
  
  // Get the appropriate text color class for the category
  const textColorClass = getCategoryTextClass(element.category);
  
  // Convert kebab-case to proper display format if translation not found
  const fallbackName = element.category.replace(/-/g, ' ');
  const categoryDisplayName = t(`category.${element.category}`, { defaultValue: fallbackName });
  
  // Translate element name
  const elementName = t(`element.name.${element.name.toLowerCase()}`, { defaultValue: element.name });
  
  return (
    <Card
      className={`
        ${sizeClasses[size]} 
        ${getCategoryColorClass(element.category)} 
        relative cursor-pointer transition-all duration-300
        hover:shadow-lg hover:-translate-y-1 element-card
        rounded-md flex flex-col justify-between items-center
        border border-opacity-30 ${isHovering ? 'z-10 scale-105' : 'z-0'}
        animate-fade-in
      `}
      onClick={() => onClick(element)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      data-element-category={element.category}
      title={`${elementName} (${categoryDisplayName})`}
    >
      <div className="text-right w-full font-mono text-opacity-90">
        {element.atomicNumber}
      </div>
      
      <div className="text-center font-bold">
        {element.symbol}
      </div>
      
      <div className={`text-center truncate w-full font-medium ${textColorClass}`}>
        {size !== 'sm' ? elementName : ''}
      </div>
      
      {size !== 'sm' && (
        <div className="text-xs opacity-90 font-mono">
          {element.atomicMass.toFixed(2)}
        </div>
      )}
      
      {isHovering && size !== 'lg' && (
        <div className="absolute -top-1 -right-1">
          <Badge variant="outline" className="bg-background/90 text-xs shadow-sm">
            {elementName}
          </Badge>
        </div>
      )}
    </Card>
  );
}
