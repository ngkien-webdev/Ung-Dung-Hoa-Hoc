
import { useState, useEffect } from 'react';
import { SearchElements } from '@/components/SearchElements';
import ElementDetails from '@/components/ElementDetails';
import { AtomVisualizer } from '@/components/AtomVisualizer';
import { Element } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMediaQuery } from '@/hooks/use-media-query';
import { Atom, Info, BookOpen, Zap, Star, Filter, List, Grid, Share, ArrowLeftRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategoryColorClass } from '@/lib/element-data/element-categories';
import { useLanguage } from '@/contexts/LanguageContext';
import { CategoryLegend } from '@/components/CategoryLegend';
import ElementSuggestion from '@/components/ElementSuggestion';
import { elements, groupElementsByCategory } from '@/lib/elements-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ElementCategory, ELEMENT_CATEGORIES } from '@/lib/constants';
import { ElementCard } from '@/components/ElementCard';
import { toast } from 'sonner';
import { SearchFilters, FilterOptions } from '@/components/SearchFilters';
import ElementComparer from '@/components/ElementComparer';

export default function Search() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [suggestions, setSuggestions] = useState<Element[]>([]);
  const [filteredElements, setFilteredElements] = useState<Element[]>([]);
  const [activeCategory, setActiveCategory] = useState<ElementCategory | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showComparer, setShowComparer] = useState(false);
  const [elementsToCompare, setElementsToCompare] = useState<Element[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    categories: [],
    states: [],
    atomicNumber: [1, 118],
    atomicMass: [1, 300]
  });
  
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { t } = useLanguage();

  // Get a random selection of elements for suggestions
  useEffect(() => {
    const getRandomElements = (count: number) => {
      const shuffled = [...elements].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };
    
    setSuggestions(getRandomElements(6));
  }, []);

  // Filter elements by category or advanced filters
  useEffect(() => {
    if (activeCategory) {
      const categorizedElements = groupElementsByCategory();
      setFilteredElements(categorizedElements[activeCategory]);
      toast.info(`${t(`category.${activeCategory}`, { defaultValue: getCategoryDisplayName(activeCategory) })} ${t('ui.elementsSelected', { defaultValue: 'elements selected' })}`);
    } else if (
      advancedFilters.categories.length > 0 || 
      advancedFilters.states.length > 0 ||
      advancedFilters.atomicNumber[0] > 1 || 
      advancedFilters.atomicNumber[1] < 118 ||
      advancedFilters.atomicMass[0] > 1 ||
      advancedFilters.atomicMass[1] < 300
    ) {
      // Apply advanced filters
      const filtered = elements.filter(element => {
        // Filter by category
        if (advancedFilters.categories.length > 0 && !advancedFilters.categories.includes(element.category)) {
          return false;
        }
        
        // Filter by state
        if (advancedFilters.states.length > 0 && !advancedFilters.states.includes(element.state)) {
          return false;
        }
        
        // Filter by atomic number
        if (
          element.atomicNumber < advancedFilters.atomicNumber[0] || 
          element.atomicNumber > advancedFilters.atomicNumber[1]
        ) {
          return false;
        }
        
        // Filter by atomic mass
        if (
          element.atomicMass < advancedFilters.atomicMass[0] || 
          element.atomicMass > advancedFilters.atomicMass[1]
        ) {
          return false;
        }
        
        return true;
      });
      
      setFilteredElements(filtered);
      
      if (filtered.length > 0) {
        toast.info(t('ui.filteredElementsCount', { 
          defaultValue: '{{count}} elements match your filters', 
          count: filtered.length 
        }));
      } else {
        toast.warning(t('ui.noElementsMatchFilters', { 
          defaultValue: 'No elements match your filters' 
        }));
      }
    } else {
      setFilteredElements([]);
    }
  }, [activeCategory, advancedFilters, t]);

  const handleElementSelect = (element: Element) => {
    if (showComparer && elementsToCompare.length < 3) {
      // In comparison mode, add the element to comparison
      if (!elementsToCompare.some(e => e.atomicNumber === element.atomicNumber)) {
        setElementsToCompare([...elementsToCompare, element]);
      } else {
        toast.info(t('ui.elementAlreadyInComparison', { defaultValue: 'Element already added to comparison' }));
      }
    } else {
      // Regular mode, select the element for details
      setSelectedElement(element);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  const handleCategorySelect = (category: ElementCategory | null) => {
    setActiveCategory(category);
    // Reset advanced filters when selecting a category
    setAdvancedFilters({
      categories: [],
      states: [],
      atomicNumber: [1, 118],
      atomicMass: [1, 300]
    });
  };

  const getCategoryDisplayName = (category: ElementCategory): string => {
    return ELEMENT_CATEGORIES[category];
  };

  const shareElement = () => {
    if (!selectedElement) return;
    
    if (navigator.share) {
      navigator.share({
        title: `${selectedElement.name} (${selectedElement.symbol})`,
        text: `Check out the ${selectedElement.name} (${selectedElement.symbol}) element on the Periodic Table app!`,
        url: window.location.href,
      }).catch((error) => {
        console.error('Error sharing:', error);
        toast.error(t('ui.shareError', { defaultValue: 'Could not share element' }));
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(
        `${selectedElement.name} (${selectedElement.symbol}): Atomic Number ${selectedElement.atomicNumber}, Atomic Mass ${selectedElement.atomicMass.toFixed(4)}`
      ).then(() => {
        toast.success(t('ui.copiedToClipboard', { defaultValue: 'Element information copied to clipboard' }));
      }).catch(() => {
        toast.error(t('ui.copyError', { defaultValue: 'Could not copy to clipboard' }));
      });
    }
  };

  const toggleComparisonMode = () => {
    setShowComparer(!showComparer);
    if (!showComparer) {
      toast.info(t('ui.comparisonModeEnabled', { defaultValue: 'Comparison mode enabled. Select up to 3 elements to compare.' }));
    } else {
      setElementsToCompare([]);
    }
  };

  const handleAdvancedFilterChange = (filters: FilterOptions) => {
    setAdvancedFilters(filters);
    // Reset category selection when using advanced filters
    setActiveCategory(null);
  };

  return (
    <div className="container py-6 px-4 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('search.title', { defaultValue: 'Search Elements' })}
        </h1>
        <p className="text-muted-foreground">
          {t('search.description', { defaultValue: 'Explore the periodic table and learn about the elements' })}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center">
        <SearchElements onElementSelect={handleElementSelect} />
        
        <div className="flex flex-wrap gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {activeCategory 
                  ? t(`category.${activeCategory}`, { defaultValue: getCategoryDisplayName(activeCategory) }) 
                  : t('ui.filterByCategory', { defaultValue: 'Filter by Category' })}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCategorySelect(null)}>
                {t('ui.showAll', { defaultValue: 'Show All' })}
              </DropdownMenuItem>
              {Object.keys(ELEMENT_CATEGORIES).map((category) => (
                <DropdownMenuItem 
                  key={category} 
                  onClick={() => handleCategorySelect(category as ElementCategory)}
                >
                  {t(`category.${category}`, { defaultValue: getCategoryDisplayName(category as ElementCategory) })}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <SearchFilters onFilterChange={handleAdvancedFilterChange} />

          <div className="flex gap-1">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => setViewMode('grid')}
              title={t('ui.gridView', { defaultValue: 'Grid View' })}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => setViewMode('list')}
              title={t('ui.listView', { defaultValue: 'List View' })}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button 
            variant={showComparer ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={toggleComparisonMode}
          >
            <ArrowLeftRight className="h-4 w-4" />
            {t('ui.compareElements', { defaultValue: 'Compare Elements' })}
          </Button>
        </div>
      </div>
      
      <CategoryLegend />

      {showComparer && (
        <ElementComparer 
          initialElements={elementsToCompare} 
          onClose={() => {
            setShowComparer(false);
            setElementsToCompare([]);
          }} 
        />
      )}

      {activeCategory || filteredElements.length > 0 ? (
        <div className="animate-fade-in">
          {activeCategory ? (
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-4 h-4 rounded-full ${getCategoryColorClass(activeCategory)}`}></div>
              <h2 className="text-xl font-semibold">
                {t(`category.${activeCategory}`, { defaultValue: getCategoryDisplayName(activeCategory) })}
              </h2>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-primary" />
              <h2 className="text-xl font-semibold">
                {t('ui.filteredElements', { defaultValue: 'Filtered Elements' })}
              </h2>
              <Badge variant="outline" className="ml-1">{filteredElements.length}</Badge>
            </div>
          )}
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredElements.map(element => (
                <ElementCard 
                  key={element.atomicNumber} 
                  element={element} 
                  onClick={handleElementSelect} 
                  size="md"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredElements.map(element => (
                <div 
                  key={element.atomicNumber}
                  className={`p-3 rounded-md flex items-center gap-3 cursor-pointer hover:bg-muted transition-colors ${getCategoryColorClass(element.category)} bg-opacity-10`}
                  onClick={() => handleElementSelect(element)}
                >
                  <div className={`${getCategoryColorClass(element.category)} w-10 h-10 rounded-md flex items-center justify-center text-lg font-bold shadow-sm`}>
                    {element.symbol}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{t(`element.name.${element.name.toLowerCase()}`, { defaultValue: element.name })}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('element.atomicNumber', { defaultValue: 'Atomic Number' })}: {element.atomicNumber} | 
                      {t('element.atomicMass', { defaultValue: 'Atomic Mass' })}: {element.atomicMass.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : !selectedElement && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {t('ui.suggestions', { defaultValue: 'Suggested Elements' })}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {suggestions.map(element => (
              <ElementSuggestion 
                key={element.atomicNumber} 
                element={element} 
                onClick={handleElementSelect} 
              />
            ))}
          </div>
        </div>
      )}

      {isDesktop ? (
        selectedElement && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 animate-fade-in">
            <Card className="shadow-lg glassmorphism">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    {t('ui.elementInformation', { defaultValue: 'Element Information' })}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={shareElement}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    <Share className="h-3.5 w-3.5 mr-1" />
                    {t('ui.share', { defaultValue: 'Share' })}
                  </Button>
                </div>
                <CardDescription>
                  {t('ui.detailedInfo', { defaultValue: 'Detailed information about' })} {t(`element.name.${selectedElement.name.toLowerCase()}`, { defaultValue: selectedElement.name })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`${getCategoryColorClass(selectedElement.category)} w-16 h-16 rounded-lg flex items-center justify-center text-3xl font-bold border shadow-md`}>
                      {selectedElement.symbol}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{t(`element.name.${selectedElement.name.toLowerCase()}`, { defaultValue: selectedElement.name })}</h3>
                      <p className="text-sm text-muted-foreground">{t('element.atomicNumber', { defaultValue: 'Atomic Number' })}: {selectedElement.atomicNumber}</p>
                      <p className="text-sm text-muted-foreground">{t('element.atomicMass', { defaultValue: 'Atomic Mass' })}: {selectedElement.atomicMass.toFixed(4)}</p>
                      <p className="text-sm text-muted-foreground">{t('element.category', { defaultValue: 'Category' })}: {t(`category.${selectedElement.category}`, { defaultValue: getCategoryDisplayName(selectedElement.category) })}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                    <div>
                      <span className="font-medium">{t('element.state', { defaultValue: 'State' })}:</span>
                      <span className="ml-2 capitalize">{t(`element.state.${selectedElement.state.toLowerCase()}`, { defaultValue: selectedElement.state })}</span>
                    </div>
                    <div>
                      <span className="font-medium">{t('property.electronConfig', { defaultValue: 'Electron Configuration' })}:</span>
                      <span className="ml-2">{selectedElement.electronConfiguration}</span>
                    </div>
                    <div>
                      <span className="font-medium">{t('element.meltingPoint', { defaultValue: 'Melting Point' })}:</span>
                      <span className="ml-2">
                        {selectedElement.meltingPoint !== null ? `${selectedElement.meltingPoint}°C` : t('common.unknown', { defaultValue: 'Unknown' })}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">{t('element.boilingPoint', { defaultValue: 'Boiling Point' })}:</span>
                      <span className="ml-2">
                        {selectedElement.boilingPoint !== null ? `${selectedElement.boilingPoint}°C` : t('common.unknown', { defaultValue: 'Unknown' })}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm mt-2">{selectedElement.description?.substring(0, 150) || t('common.noDescription', { defaultValue: 'No description available' })}...</p>
                  
                  <button 
                    className="text-primary hover:underline text-sm text-left flex items-center gap-1"
                    onClick={handleViewDetails}
                  >
                    <Zap className="h-3 w-3" />
                    {t('ui.viewFullDetails', { defaultValue: 'View Full Details' })}
                  </button>
                </div>
              </CardContent>
            </Card>
            
            <AtomVisualizer element={selectedElement} />
          </div>
        )
      ) : (
        // Mobile view
        selectedElement && (
          <Tabs defaultValue="info" className="mt-6 animate-fade-in">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">{t('tab.information', { defaultValue: 'Information' })}</TabsTrigger>
              <TabsTrigger value="visual">{t('tab.visual3D', { defaultValue: '3D Visual' })}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="mt-4">
              <Card className="shadow-lg glassmorphism">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      {t(`element.name.${selectedElement.name.toLowerCase()}`, { defaultValue: selectedElement.name })} ({selectedElement.symbol})
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={shareElement}
                      className="h-7 w-7"
                    >
                      <Share className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <CardDescription>
                    {t(`category.${selectedElement.category}`, { defaultValue: getCategoryDisplayName(selectedElement.category) })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${getCategoryColorClass(selectedElement.category)} w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold border shadow-md`}>
                      {selectedElement.symbol}
                    </div>
                    <div>
                      <p className="text-sm">{t('element.atomicNumber', { defaultValue: 'Atomic Number' })}: {selectedElement.atomicNumber}</p>
                      <p className="text-sm">{t('element.atomicMass', { defaultValue: 'Atomic Mass' })}: {selectedElement.atomicMass.toFixed(4)}</p>
                      <p className="text-sm capitalize">{t('element.state', { defaultValue: 'State' })}: {t(`element.state.${selectedElement.state.toLowerCase()}`, { defaultValue: selectedElement.state })}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm">{selectedElement.description?.substring(0, 150) || t('common.noDescription', { defaultValue: 'No description available' })}...</p>
                  
                  <button 
                    className="text-primary hover:underline text-sm mt-4 block flex items-center gap-1"
                    onClick={handleViewDetails}
                  >
                    <Zap className="h-3 w-3" />
                    {t('ui.viewFullDetails', { defaultValue: 'View Full Details' })}
                  </button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="visual" className="mt-4">
              <AtomVisualizer element={selectedElement} />
            </TabsContent>
          </Tabs>
        )
      )}

      {showDetails && selectedElement && (
        <ElementDetails 
          element={selectedElement} 
          onClose={() => setShowDetails(false)}
          isOpen={true}
        />
      )}
    </div>
  );
}
