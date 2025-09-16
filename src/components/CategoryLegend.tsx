
import { ELEMENT_CATEGORIES, ElementCategory } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCategoryColorClass } from "@/lib/element-data/element-categories";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function CategoryLegend() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-6 bg-white/20 dark:bg-black/20 p-4 rounded-lg shadow-sm backdrop-blur-sm">
      <TooltipProvider>
        {Object.entries(ELEMENT_CATEGORIES).map(([key, value]) => {
          const categoryKey = key as ElementCategory;
          const displayName = t(`category.${categoryKey}`, { defaultValue: value });
          
          return (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <div className="flex items-center group relative cursor-pointer">
                  <div 
                    className={`${getCategoryColorClass(categoryKey)} w-5 h-5 mr-2 rounded-full shadow-sm transition-all group-hover:scale-110`}
                  ></div>
                  <Badge variant="outline" className="font-medium text-xs md:text-sm bg-background/50 backdrop-blur-sm">
                    {displayName}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-1">
                <Info className="h-3.5 w-3.5 text-primary opacity-70" />
                <p>{t('ui.elementsInCategory', { defaultValue: 'Elements in this category' })}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}
