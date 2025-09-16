
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getCategoryColorClass, getCategoryTextClass } from '@/lib/element-data/element-categories';
import { Element } from '@/lib/constants';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from './ui/badge';

interface ElementSuggestionProps {
  element: Element;
  onClick: (element: Element) => void;
}

const ElementSuggestion: React.FC<ElementSuggestionProps> = ({ element, onClick }) => {
  const { t } = useLanguage();
  const textColorClass = getCategoryTextClass(element.category);
  // Convert kebab-case to proper display format if translation not found
  const fallbackName = element.category.replace(/-/g, ' ');
  const categoryDisplayName = t(`category.${element.category}`, { defaultValue: fallbackName });
  
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-all duration-300 element-suggestion border border-muted hover:-translate-y-1`}
      onClick={() => onClick(element)}
    >
      <CardHeader className="p-3 pb-1 relative">
        <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${getCategoryColorClass(element.category)}`}></div>
        <div className="flex justify-between">
          <div className="text-xs text-muted-foreground">{element.atomicNumber}</div>
          <div className="font-bold text-lg">{element.symbol}</div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className={`text-sm font-medium truncate ${textColorClass}`}>
          {t(`element.name.${element.name.toLowerCase()}`, { defaultValue: element.name })}
        </div>
        <div className="mt-1">
          <Badge variant="outline" className="text-xs bg-muted/30">
            {categoryDisplayName}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElementSuggestion;
