
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, BookOpen, Info } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface ResourceFeature {
  title: string;
  description: string;
}

interface LearnResourceCardProps {
  resource: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    image: string;
    buttonText: string;
    features: string[];
    difficulty: string;
    format: string;
    url: string;
    size?: string;
  };
  onAccess: () => void;
  onDownload: () => void;
}

const LearnResourceCard: React.FC<LearnResourceCardProps> = ({ 
  resource, 
  onAccess,
  onDownload
}) => {
  const { t, language } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  
  const formatLabel = (format: string) => {
    switch (format) {
      case 'interactive': return t('format.interactive') || 'Interactive';
      case 'video': return t('format.video') || 'Video';
      case 'reading': return t('format.reading') || 'Reading';
      case 'simulation': return t('format.simulation') || 'Simulation';
      case 'educational': return t('format.educational') || 'Course';
      default: return format;
    }
  };
  
  const difficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return t('difficulty.beginner') || 'Beginner';
      case 'intermediate': return t('difficulty.intermediate') || 'Intermediate';
      case 'advanced': return t('difficulty.advanced') || 'Advanced';
      case 'all-levels': return t('difficulty.allLevels') || 'All Levels';
      default: return difficulty;
    }
  };
  
  // Color mapping for difficulty badges
  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'all-levels': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default: return '';
    }
  };
  
  // Color mapping for format badges
  const formatColor = (format: string) => {
    switch (format) {
      case 'interactive': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'video': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'reading': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'simulation': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'educational': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
      default: return '';
    }
  };

  const handleDownload = () => {
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadProgress(null);
            onDownload();
            toast.success(
              language === 'vi' 
                ? `Đã tải xuống "${resource.title}" thành công!` 
                : `Downloaded "${resource.title}" successfully!`
            );
          }, 500);
          return 100;
        }
        return prev + 5; // Increase by 5% each time
      });
    }, 100);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col group border border-muted/50">
        <div className="relative h-40 overflow-hidden">
          <img 
            src={resource.image} 
            alt={resource.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Badge className={`${difficultyColor(resource.difficulty)}`}>
              {difficultyLabel(resource.difficulty)}
            </Badge>
            <Badge className={`${formatColor(resource.format)}`}>
              {formatLabel(resource.format)}
            </Badge>
          </div>
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
          >
            <p className="text-white p-3 text-sm font-medium">
              {resource.description}
            </p>
          </div>
        </div>
        
        <CardHeader className="pb-0">
          <CardTitle className="text-base flex items-center gap-2">
            {resource.icon}
            {resource.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="py-2 flex-grow">
          <ul className="text-xs space-y-1">
            {resource.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-1.5">
                <div className="mt-1 min-w-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-0 gap-2">
          <Button 
            onClick={onAccess} 
            className="gap-1 flex-1 text-xs h-8"
            variant="default"
          >
            {resource.buttonText}
            {resource.url.startsWith('http') && <ExternalLink className="h-3 w-3" />}
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setShowDetails(true)}>
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('learn.resources.detailsTooltip') || 'View details'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleDownload} disabled={downloadProgress !== null}>
                  {downloadProgress !== null ? (
                    <div className="h-4 w-4 rounded-full border-2 border-primary border-r-transparent animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('learn.resources.downloadTooltip') || 'Download for offline use'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {resource.icon}
              {resource.title}
            </DialogTitle>
            <DialogDescription>
              {resource.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <img 
                src={resource.image} 
                alt={resource.title}
                className="object-cover w-full h-48 rounded-md"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">{t('learn.resources.features') || 'Features'}</h4>
                <ul className="text-sm space-y-1">
                  {resource.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-1 min-w-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{t('learn.resources.difficulty') || 'Difficulty'}</span>
                  <Badge className={`${difficultyColor(resource.difficulty)}`}>
                    {difficultyLabel(resource.difficulty)}
                  </Badge>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>{t('learn.resources.format') || 'Format'}</span>
                  <Badge className={`${formatColor(resource.format)}`}>
                    {formatLabel(resource.format)}
                  </Badge>
                </div>
                
                {resource.size && (
                  <div className="flex justify-between text-sm">
                    <span>{t('learn.resources.size') || 'Size'}</span>
                    <span className="font-mono">{resource.size}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              {t('learn.resources.close') || 'Close'}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload} disabled={downloadProgress !== null}>
                {downloadProgress !== null ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-primary border-r-transparent animate-spin mr-2" />
                    {downloadProgress}%
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    {t('learn.resources.download') || 'Download'}
                  </>
                )}
              </Button>
              <Button onClick={onAccess}>
                {resource.buttonText}
                {resource.url.startsWith('http') && <ExternalLink className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LearnResourceCard;
