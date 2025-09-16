
import React, { useState, useEffect } from 'react';
import { Element } from '@/lib/constants';
import { fetchElementWikiInfo } from '@/services/wikiService';
import { Card, CardContent } from './ui/card';
import { Loader2, ExternalLink, Globe, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface WikiElementDetailsProps {
  element: Element;
}

const WikiElementDetails: React.FC<WikiElementDetailsProps> = ({ element }) => {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the current language for the wiki summary (now only 'en' or 'vi')
        const langCode = language === 'vi' ? 'vi' : 'en';
        const data = await fetchElementWikiInfo(element.name, langCode);
        
        if (data.extract) {
          setSummary(data.extract);
        } else {
          setSummary(t('common.noInformation', { defaultValue: 'No information available' }));
          // Show a toast notification if no data was found in the current language
          if (language === 'vi') {
            toast.info(t('common.noVietnameseInfo', { defaultValue: 'No Vietnamese information available, showing English instead' }));
          }
        }
      } catch (err) {
        console.error('Error fetching wiki data:', err);
        setError(t('common.failedToLoad', { defaultValue: 'Failed to load information' }));
      } finally {
        setIsLoading(false);
      }
    };

    if (element) {
      fetchSummary();
    }
  }, [element, language, t]);

  const getLanguageDisplayName = () => {
    return language === 'en' ? 'English' : 'Tiếng Việt';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
        <p className="text-muted-foreground text-sm">{t('common.loading', { defaultValue: 'Loading...' })}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
        <p className="text-muted-foreground">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.open(`https://${language === 'vi' ? 'vi' : 'en'}.wikipedia.org/wiki/${element.name}`, '_blank')}
        >
          {t('common.viewOnWikipedia', { defaultValue: 'View on Wikipedia' })}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="element-facts grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-muted/20 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">{t('element.atomicMass', { defaultValue: 'Atomic Mass' })}</div>
            <div className="font-medium">{element.atomicMass.toFixed(4)} u</div>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/20 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">{t('property.period', { defaultValue: 'Period' })} / {t('property.group', { defaultValue: 'Group' })}</div>
            <div className="font-medium">{element.period} / {element.group || '—'}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/20 hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <div className="text-xs uppercase text-muted-foreground mb-1">{t('property.state', { defaultValue: 'State' })}</div>
            <div className="font-medium">{t(`element.state.${element.state.toLowerCase()}`, { defaultValue: element.state })}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="wiki-summary">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            {t('section.description', { defaultValue: 'Description' })}
          </h3>
          <div className="text-xs text-muted-foreground flex items-center bg-muted/30 px-2 py-1 rounded-md">
            <Globe className="h-3 w-3 mr-1" />
            {getLanguageDisplayName()}
          </div>
        </div>
        <Separator className="mb-4" />
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(`https://${language === 'vi' ? 'vi' : 'en'}.wikipedia.org/wiki/${element.name}`, '_blank')}
            className="text-xs flex items-center"
          >
            {t('common.viewOnWikipedia', { defaultValue: 'View on Wikipedia' })}
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WikiElementDetails;
