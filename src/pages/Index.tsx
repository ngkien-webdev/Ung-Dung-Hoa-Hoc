
import React, { useState, useMemo } from 'react';
import { CategoryLegend } from '@/components/CategoryLegend';
import PeriodicTable from '@/components/PeriodicTable';
import ElementDetails from '@/components/ElementDetails';
import { SearchElements } from '@/components/SearchElements';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { elements } from '@/lib/elements-data';
import { Element, ELEMENT_CATEGORIES, ElementCategory } from '@/lib/constants';
import { getCategoryColorClass } from '@/lib/element-data/element-categories';
import { Atom } from 'lucide-react';

const IndexPage: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Element[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'categories'>('table');
  const { t } = useLanguage();
  
  // Group elements by category
  const elementsByCategory = useMemo(() => {
    const grouped: Record<string, Element[]> = {};
    
    Object.keys(ELEMENT_CATEGORIES).forEach(category => {
      grouped[category] = elements.filter(element => element.category === category);
    });
    
    return grouped;
  }, []);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const results = elements.filter(element => {
      return (
        element.name.toLowerCase().includes(query.toLowerCase()) || 
        element.symbol.toLowerCase().includes(query.toLowerCase()) ||
        element.atomicNumber.toString().includes(query)
      );
    });
    
    setSearchResults(results);
  };
  
  const handleElementClick = (element: Element) => {
    setSelectedElement(element);
  };
  
  const closeElementDetails = () => {
    setSelectedElement(null);
  };
  
  return (
    <div className="container py-6 px-4 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('app.title') || 'Periodic Table of Elements'}
        </h1>
        <p className="text-muted-foreground">
          {t('app.description') || 'Explore the elements and their properties'}
        </p>
      </div>
      
      <div className="flex justify-center">
        <SearchElements onElementSelect={(element) => handleElementClick(element)} />
      </div>
      
      {searchQuery && searchResults.length > 0 && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">{t('ui.searchResults') || 'Search Results'}</CardTitle>
            <CardDescription>
              {searchResults.length} {searchResults.length === 1 ? 'element' : 'elements'} found for "{searchQuery}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchResults.map(element => (
                <Card 
                  key={element.atomicNumber}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${getCategoryColorClass(element.category)} element-suggestion`}
                  onClick={() => handleElementClick(element)}
                >
                  <CardHeader className="p-3 pb-1">
                    <div className="flex justify-between">
                      <div className="text-xs text-muted-foreground">{element.atomicNumber}</div>
                      <div className="font-medium">{element.symbol}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-sm font-medium">{element.name}</div>
                    <div className="text-xs text-muted-foreground">{t(`category.${element.category}`) || element.category}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-center mb-4">
        <Tabs defaultValue="table" className="w-full max-w-2xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table" onClick={() => setViewMode('table')}>
              {t('tab.table') || 'Periodic Table'}
            </TabsTrigger>
            <TabsTrigger value="categories" onClick={() => setViewMode('categories')}>
              {t('category.title') || 'Categories'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex justify-center">
        <CategoryLegend />
      </div>
      
      {viewMode === 'table' ? (
        <div className="overflow-x-auto pb-8">
          <PeriodicTable onElementClick={handleElementClick} />
        </div>
      ) : (
        <div className="space-y-8 pb-8">
          {Object.keys(ELEMENT_CATEGORIES).map(category => (
            <Card key={category} className={`border-t-4 ${getCategoryColorClass(category as ElementCategory)}`}>
              <CardHeader>
                <CardTitle className="text-xl">{t(`category.${category}`) || category.replace('-', ' ')}</CardTitle>
                <CardDescription>
                  {elementsByCategory[category].length} {elementsByCategory[category].length === 1 ? 'element' : 'elements'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {elementsByCategory[category].map(element => (
                    <Card 
                      key={element.atomicNumber}
                      className="cursor-pointer hover:shadow-md transition-shadow element-suggestion"
                      onClick={() => handleElementClick(element)}
                    >
                      <CardHeader className="p-3 pb-1">
                        <div className="flex justify-between">
                          <div className="text-xs text-muted-foreground">{element.atomicNumber}</div>
                          <div className="font-medium">{element.symbol}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-sm font-medium">{element.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{element.atomicMass.toFixed(2)}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Element Details Modal */}
      {selectedElement && (
        <ElementDetails 
          element={selectedElement} 
          onClose={closeElementDetails} 
          isOpen={!!selectedElement} 
        />
      )}
    </div>
  );
};

export default IndexPage;
