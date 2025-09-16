
import { Language } from '@/contexts/LanguageContext';
import { Element } from '@/lib/constants';

type WikiData = {
  extract: string;
  title: string;
  pageid: number;
  thumbnail?: {
    source: string;
  };
};

// Helper to get element name in the correct language
export const getElementNameInLanguage = (elementName: string | Element, language: Language): string => {
  // If Element object is passed, extract the name
  if (typeof elementName !== 'string') {
    elementName = elementName.name;
  }

  // Special translations for element names if needed
  const elementNameTranslations: Record<string, Record<Language, string>> = {
    // Add element name translations if needed
    // 'Hydrogen': { en: 'Hydrogen', vi: 'Hiđrô' },
  };
  
  return elementNameTranslations[elementName]?.[language] || elementName;
};

// Get Wikipedia URL for an element
export const getWikipediaUrl = (elementName: string | Element, language: Language): string => {
  const name = getElementNameInLanguage(elementName, language);
  const langPrefix = language === 'vi' ? 'vi.' : '';
  return `https://${langPrefix}wikipedia.org/wiki/${encodeURIComponent(name)}`;
};

// Fetch element information from Wikipedia
export const fetchElementWikiInfo = async (
  elementName: string | Element,
  language: Language
): Promise<WikiData> => {
  try {
    const name = getElementNameInLanguage(elementName, language);
    const langCode = language === 'en' ? 'en' : 'vi';
    
    const url = `https://${langCode}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Wikipedia API returned ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
    return {
      extract: '',
      title: typeof elementName === 'string' ? elementName : elementName.name,
      pageid: 0
    };
  }
};
