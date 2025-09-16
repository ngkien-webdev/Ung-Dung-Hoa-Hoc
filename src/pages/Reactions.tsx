
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { elements } from '@/lib/elements-data';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Beaker, Flame, Plus, Trash2, Search, Sparkles } from 'lucide-react';
import { Element } from '@/lib/constants';
import { ElementCard } from '@/components/ElementCard';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import ReactionVisualizerWrapper from '@/components/ReactionVisualizerWrapper';

// Define reaction types
interface ReactionComponent {
  element: string;
  count: number;
}

interface Reaction {
  reactants: ReactionComponent[];
  products: ReactionComponent[];
  name: string;
  description: string;
}

// Sample reactions
const sampleReactions: Reaction[] = [
  {
    reactants: [
      { element: "H", count: 2 },
      { element: "O", count: 1 }
    ],
    products: [
      { element: "H2O", count: 2 }
    ],
    name: "Water Formation",
    description: "Hydrogen reacts with oxygen to form water"
  },
  {
    reactants: [
      { element: "Na", count: 2 },
      { element: "Cl", count: 2 }
    ],
    products: [
      { element: "NaCl", count: 2 }
    ],
    name: "Salt Formation",
    description: "Sodium reacts with chlorine to form sodium chloride (table salt)"
  },
  {
    reactants: [
      { element: "C", count: 1 },
      { element: "O", count: 2 }
    ],
    products: [
      { element: "CO2", count: 1 }
    ],
    name: "Carbon Dioxide Formation",
    description: "Carbon reacts with oxygen to form carbon dioxide"
  }
];

// Additional complex reactions
const additionalReactions: Reaction[] = [
  {
    reactants: [
      { element: "C", count: 2 },
      { element: "H", count: 6 },
      { element: "O", count: 1 }
    ],
    products: [
      { element: "C2H5OH", count: 1 }
    ],
    name: "Ethanol Synthesis",
    description: "Synthesis of ethanol from carbon, hydrogen, and oxygen"
  },
  {
    reactants: [
      { element: "N", count: 2 },
      { element: "H", count: 6 }
    ],
    products: [
      { element: "NH3", count: 2 }
    ],
    name: "Ammonia Formation",
    description: "Formation of ammonia from nitrogen and hydrogen"
  }
];

export default function Reactions() {
  const { t, language } = useLanguage();
  const [selectedReaction, setSelectedReaction] = useState<Reaction>(sampleReactions[0]);
  const [customReaction, setCustomReaction] = useState<Reaction>({
    reactants: [{ element: "H", count: 2 }, { element: "O", count: 1 }],
    products: [{ element: "H2O", count: 1 }],
    name: "Custom Reaction",
    description: "Create your own chemical reaction"
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [allReactions, setAllReactions] = useState<Reaction[]>([...sampleReactions, ...additionalReactions]);
  const [filteredReactions, setFilteredReactions] = useState<Reaction[]>(allReactions);
  const [customReactionInput, setCustomReactionInput] = useState<string>('');
  const [tabValue, setTabValue] = useState("explore");
  const [reactionKey, setReactionKey] = useState(0); // For forcing re-render

  // Update reaction name and description when language changes
  useEffect(() => {
    if (language === 'vi') {
      setCustomReaction(prev => ({
        ...prev,
        name: "Phản Ứng Tùy Chỉnh",
        description: "Tạo phản ứng hóa học của riêng bạn"
      }));
    } else {
      setCustomReaction(prev => ({
        ...prev,
        name: "Custom Reaction",
        description: "Create your own chemical reaction"
      }));
    }
    
    // Update sample reactions based on language
    translateReactions();
  }, [language]);
  
  // Translate reaction names and descriptions based on language
  const translateReactions = () => {
    const translated = allReactions.map(reaction => {
      if (reaction.name === "Water Formation") {
        return {
          ...reaction,
          name: t('reactions.waterFormation', { defaultValue: 'Water Formation' }),
          description: t('reactions.waterDescription', { defaultValue: 'Hydrogen reacts with oxygen to form water' })
        };
      }
      else if (reaction.name === "Salt Formation") {
        return {
          ...reaction,
          name: language === 'vi' ? 'Sự Hình Thành Muối' : 'Salt Formation',
          description: language === 'vi' ? 'Natri phản ứng với chlorine để tạo thành natri clorua (muối ăn)' : 'Sodium reacts with chlorine to form sodium chloride (table salt)'
        };
      }
      else if (reaction.name === "Carbon Dioxide Formation") {
        return {
          ...reaction,
          name: language === 'vi' ? 'Sự Hình Thành Carbon Dioxide' : 'Carbon Dioxide Formation',
          description: language === 'vi' ? 'Carbon phản ứng với oxy để tạo thành carbon dioxide' : 'Carbon reacts with oxygen to form carbon dioxide'
        };
      }
      else if (reaction.name === "Ethanol Synthesis") {
        return {
          ...reaction,
          name: language === 'vi' ? 'Tổng Hợp Ethanol' : 'Ethanol Synthesis',
          description: language === 'vi' ? 'Tổng hợp ethanol từ carbon, hydro và oxy' : 'Synthesis of ethanol from carbon, hydrogen, and oxygen'
        };
      }
      else if (reaction.name === "Ammonia Formation") {
        return {
          ...reaction,
          name: language === 'vi' ? 'Sự Hình Thành Amoniac' : 'Ammonia Formation',
          description: language === 'vi' ? 'Hình thành amoniac từ nitơ và hydro' : 'Formation of ammonia from nitrogen and hydrogen'
        };
      }
      return reaction;
    });
    
    setAllReactions(translated);
    setFilteredReactions(translated);
  };
  
  // Filter reactions based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allReactions.filter(reaction => 
        reaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reaction.reactants.some(r => r.element.toLowerCase().includes(searchQuery.toLowerCase())) ||
        reaction.products.some(p => p.element.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredReactions(filtered);
    } else {
      setFilteredReactions(allReactions);
    }
  }, [searchQuery, allReactions]);
  
  const handleAddReactant = () => {
    setCustomReaction(prev => ({
      ...prev,
      reactants: [...prev.reactants, { element: "C", count: 1 }]
    }));
  };
  
  const handleAddProduct = () => {
    setCustomReaction(prev => ({
      ...prev,
      products: [...prev.products, { element: "CO2", count: 1 }]
    }));
  };
  
  const handleRemoveReactant = (index: number) => {
    setCustomReaction(prev => ({
      ...prev,
      reactants: prev.reactants.filter((_, i) => i !== index)
    }));
  };
  
  const handleRemoveProduct = (index: number) => {
    setCustomReaction(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };
  
  const handleReactantChange = (index: number, field: 'element' | 'count', value: string | number) => {
    setCustomReaction(prev => ({
      ...prev,
      reactants: prev.reactants.map((reactant, i) => 
        i === index ? { ...reactant, [field]: value } : reactant
      )
    }));
  };
  
  const handleProductChange = (index: number, field: 'element' | 'count', value: string | number) => {
    setCustomReaction(prev => ({
      ...prev,
      products: prev.products.map((product, i) => 
        i === index ? { ...product, [field]: value } : product
      )
    }));
  };
  
  // Update handleSaveReaction to also set the custom reaction input and force visualizer to refresh
  const handleSaveReaction = () => {
    // Check for duplicate reactions
    const isDuplicate = allReactions.some(
      r => JSON.stringify(r.reactants) === JSON.stringify(customReaction.reactants) && 
           JSON.stringify(r.products) === JSON.stringify(customReaction.products)
    );
    
    if (isDuplicate) {
      toast.error(language === 'vi' ? 'Phản ứng này đã tồn tại!' : 'This reaction already exists!');
      return;
    }

    // Construct the reaction string from reactants and products
    const reactionString = `${customReaction.reactants.map(r => 
      `${r.count > 1 ? r.count : ''}${r.element}`).join(' + ')} -> ${
      customReaction.products.map(p => 
        `${p.count > 1 ? p.count : ''}${p.element}`).join(' + ')}`;
    
    setCustomReactionInput(reactionString);
    
    // Add new reaction to list
    const newReactions = [...allReactions, {...customReaction}];
    setAllReactions(newReactions);
    setFilteredReactions(newReactions);
    setSelectedReaction(customReaction);
    
    // Reset custom reaction
    setCustomReaction({
      reactants: [{ element: "H", count: 2 }, { element: "O", count: 1 }],
      products: [{ element: "H2O", count: 1 }],
      name: language === 'vi' ? "Phản Ứng Tùy Chỉnh" : "Custom Reaction",
      description: language === 'vi' ? "Tạo phản ứng hóa học của riêng bạn" : "Create your own chemical reaction"
    });
    
    // Force refresh of the reaction visualizer
    setReactionKey(prev => prev + 1);
    
    toast.success(
      t('reactions.saved', { defaultValue: 'Reaction saved successfully!' }),
      { description: t('reactions.viewBelow', { defaultValue: 'Scroll down to see the reaction visualization' }) }
    );
    
    // Scroll to the results
    setTimeout(() => {
      const resultsElement = document.getElementById('reaction-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };
  
  // Helper function to generate reaction string for selected reaction
  const generateReactionString = (reaction: Reaction) => {
    return `${reaction.reactants.map(r => 
      `${r.count > 1 ? r.count : ''}${r.element}`).join(' + ')} -> ${
      reaction.products.map(p => 
        `${p.count > 1 ? p.count : ''}${p.element}`).join(' + ')}`;
  };
  
  // When a reaction is selected, update the custom reaction input and force reload
  useEffect(() => {
    if (selectedReaction) {
      const reactionStr = generateReactionString(selectedReaction);
      setCustomReactionInput(reactionStr);
      setReactionKey(prev => prev + 1);
    }
  }, [selectedReaction]);
  
  // Function to handle tab change
  const handleTabChange = (value: string) => {
    setTabValue(value);
    // Reset the reaction visualizer to force it to rebuild with current input
    setTimeout(() => {
      setReactionKey(prev => prev + 1);
    }, 100);
  };
  
  return (
    <div className="container py-6 px-4 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center">
          <Sparkles className="h-7 w-7 mr-2 text-yellow-500" />
          {t('reactions.title', { defaultValue: 'Chemical Reactions' })}
        </h1>
        <p className="text-muted-foreground">
          {t('reactions.description', { defaultValue: 'Explore different types of chemical reactions and how elements interact' })}
        </p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            type="text" 
            placeholder={t('reactions.search', { defaultValue: 'Search for reactions' })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Tabs value={tabValue} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="explore">{t('reactions.explore', { defaultValue: 'Explore Reactions' })}</TabsTrigger>
          <TabsTrigger value="create">{t('reactions.create', { defaultValue: 'Create Reaction' })}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore" className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredReactions.map((reaction, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${selectedReaction === reaction ? 'border-primary border-2' : ''}`}
                onClick={() => setSelectedReaction(reaction)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{reaction.name}</CardTitle>
                  <CardDescription>{reaction.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-mono bg-muted p-2 rounded-md">
                    {reaction.reactants.map((r, i) => (
                      <span key={i}>
                        {i > 0 && " + "}
                        {r.count > 1 && r.count}{r.element}
                      </span>
                    ))}
                    {" → "}
                    {reaction.products.map((p, i) => (
                      <span key={i}>
                        {i > 0 && " + "}
                        {p.count > 1 && p.count}{p.element}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredReactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {language === 'vi' ? 'Không tìm thấy phản ứng nào.' : 'No reactions found.'}
              </p>
            </div>
          )}
          
          <Separator className="my-8" />
          
          <Card className="mt-8" id="reaction-results">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-primary" />
                {t('reactions.visualization', { defaultValue: 'Reaction Visualization' })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ReactionVisualizerWrapper 
                key={reactionKey}
                customInput={selectedReaction ? generateReactionString(selectedReaction) : undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create" className="space-y-6 py-4">
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle>{t('reactions.customReaction', { defaultValue: 'Custom Reaction' })}</CardTitle>
              <CardDescription>
                {t('reactions.customDescription', { defaultValue: 'Create your own chemical reaction by adding reactants and products' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reaction-name">{t('reactions.name', { defaultValue: 'Reaction Name' })}</Label>
                  <Input 
                    id="reaction-name" 
                    value={customReaction.name}
                    onChange={(e) => setCustomReaction(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reaction-description">{t('reactions.description', { defaultValue: 'Description' })}</Label>
                  <Input 
                    id="reaction-description" 
                    value={customReaction.description}
                    onChange={(e) => setCustomReaction(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>{t('reactions.reactants', { defaultValue: 'Reactants' })}</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddReactant}
                      className="h-8 gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      {t('reactions.add', { defaultValue: 'Add' })}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {customReaction.reactants.map((reactant, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select 
                          value={reactant.element}
                          onValueChange={(value) => handleReactantChange(index, 'element', value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Element" />
                          </SelectTrigger>
                          <SelectContent>
                            {elements.slice(0, 20).map((element: Element) => (
                              <SelectItem key={element.symbol} value={element.symbol}>
                                {element.symbol} - {t(`element.name.${element.name.toLowerCase()}`, { defaultValue: element.name })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input 
                          type="number" 
                          min="1"
                          value={reactant.count}
                          onChange={(e) => handleReactantChange(index, 'count', parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveReactant(index)}
                          className="h-8 w-8"
                          disabled={customReaction.reactants.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <ArrowRight className="h-8 w-8 text-primary" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>{t('reactions.products', { defaultValue: 'Products' })}</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddProduct}
                      className="h-8 gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      {t('reactions.add', { defaultValue: 'Add' })}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {customReaction.products.map((product, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select 
                          value={product.element}
                          onValueChange={(value) => handleProductChange(index, 'element', value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Element" />
                          </SelectTrigger>
                          <SelectContent>
                            {elements.slice(0, 20).map((element: Element) => (
                              <SelectItem key={element.symbol} value={element.symbol}>
                                {element.symbol} - {t(`element.name.${element.name.toLowerCase()}`, { defaultValue: element.name })}
                              </SelectItem>
                            ))}
                            <SelectItem value="H2O">H2O - {language === 'vi' ? 'Nước' : 'Water'}</SelectItem>
                            <SelectItem value="CO2">CO2 - {language === 'vi' ? 'Carbon Dioxide' : 'Carbon Dioxide'}</SelectItem>
                            <SelectItem value="NaCl">NaCl - {language === 'vi' ? 'Natri Clorua' : 'Sodium Chloride'}</SelectItem>
                            <SelectItem value="C2H5OH">C2H5OH - {language === 'vi' ? 'Ethanol' : 'Ethanol'}</SelectItem>
                            <SelectItem value="NH3">NH3 - {language === 'vi' ? 'Amoniac' : 'Ammonia'}</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Input 
                          type="number" 
                          min="1"
                          value={product.count}
                          onChange={(e) => handleProductChange(index, 'count', parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveProduct(index)}
                          className="h-8 w-8"
                          disabled={customReaction.products.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleSaveReaction} 
                  size="lg" 
                  className="px-8 pulse-effect"
                >
                  <Beaker className="mr-2 h-4 w-4" />
                  {t('reactions.save', { defaultValue: 'Create Reaction' })}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card id="reaction-results">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle>{t('reactions.preview', { defaultValue: 'Preview' })}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ReactionVisualizerWrapper key={`custom-${reactionKey}`} customInput={customReactionInput} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
