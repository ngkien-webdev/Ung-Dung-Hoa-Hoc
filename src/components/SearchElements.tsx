
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ElementCard } from './ElementCard';
import { searchElements } from '@/lib/elements-data';
import { Element } from '@/lib/constants';
import { Search, Mic } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface SearchElementsProps {
  onElementSelect: (element: Element) => void;
}

export function SearchElements({ onElementSelect }: SearchElementsProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Element[]>([]);
  const [isListening, setIsListening] = useState(false);
  const { t } = useLanguage();
  
  useEffect(() => {
    if (query.trim().length > 0) {
      setResults(searchElements(query));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error(t('search.voiceNotSupported', { defaultValue: 'Voice search is not supported in your browser' }));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = t('language.current', { defaultValue: 'en-US' });
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info(t('search.listening', { defaultValue: 'Listening...' }));
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      toast.success(t('search.voiceDetected', { defaultValue: 'Voice detected' }));
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast.error(t('search.voiceError', { defaultValue: 'Error recognizing voice' }));
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="flex w-full max-w-lg items-center space-x-2">
        <Input
          type="text"
          placeholder={t('search.placeholder', { defaultValue: 'Search for elements...' })}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="shadow-sm"
        />
        <Button type="submit" className="shadow-sm">
          <Search className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant={isListening ? "destructive" : "outline"} 
          className="shadow-sm flex items-center justify-center animate-pulse-slow" 
          onClick={handleVoiceSearch}
          title={t('search.voiceSearch', { defaultValue: 'Voice Search' })}
        >
          <Mic className={`h-4 w-4 ${isListening ? 'text-white' : ''}`} />
        </Button>
      </div>
      
      {results.length > 0 && (
        <div className="animate-fade-in">
          <h3 className="text-sm font-medium mb-2">{t('search.results', { defaultValue: 'Search Results' })}</h3>
          <div className="flex flex-wrap gap-2">
            {results.map(element => (
              <ElementCard
                key={element.atomicNumber}
                element={element}
                onClick={onElementSelect}
                size="md"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
