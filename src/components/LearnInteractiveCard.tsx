
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ChevronRight } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from "@/lib/utils";

interface LearnInteractiveCardProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  className?: string;
  detailsContent: React.ReactNode;
}

const LearnInteractiveCard: React.FC<LearnInteractiveCardProps> = ({
  title,
  icon,
  description,
  children,
  className,
  detailsContent
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <Card 
        className={cn(
          "cursor-pointer hover:shadow-md transition-all duration-300", 
          showDetails ? "ring-2 ring-primary" : "",
          className
        )}
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            {icon}
            {title}
          </CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-2">
          {children}
        </CardContent>
        <CardFooter className="pt-0 pb-2">
          <Button variant="ghost" size="sm" className="text-xs gap-1 w-full justify-start text-muted-foreground">
            {t('learn.clickBoxes')} <ChevronRight className="h-3 w-3" />
          </Button>
        </CardFooter>
      </Card>

      {showDetails && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {icon}
                  {title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(false);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">{t('learn.closeDetails')}</span>
                </Button>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {detailsContent}
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(false);
                  }}
                >
                  {t('learn.closeDetails')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LearnInteractiveCard;
