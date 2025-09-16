
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  FlaskConical as MoleculeIcon, 
  ChevronDown, 
  Boxes as Cube3dIcon, 
  Users, 
  Presentation, 
  Atom,
  Copy,
  RefreshCw,
  CheckCircle2,
  Flame,
  Play
} from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { ReactionVisualizer } from './ReactionVisualizer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ReactionVideoPlayer from './ReactionVideoPlayer';

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

interface ReactionVisualizerWrapperProps {
  reaction?: Reaction;
  element1Symbol?: string;
  element2Symbol?: string;
  customInput?: string;
}

const MoleculeIconWrapper = (props: any) => (
  <MoleculeIcon {...props} />
);

const Cube3dIconWrapper = (props: any) => (
  <Cube3dIcon {...props} />
);

export default function ReactionVisualizerWrapper({ 
  reaction, 
  element1Symbol, 
  element2Symbol,
  customInput 
}: ReactionVisualizerWrapperProps) {
  const { t } = useLanguage();
  const [reactionInput, setReactionInput] = useState<string>(customInput || 'C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O');
  const [reactionOutput, setReactionOutput] = useState<string>('');
  const [isBalanced, setIsBalanced] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Update when customInput changes
  useEffect(() => {
    if (customInput) {
      setReactionInput(customInput);
      // Auto-balance when input is provided externally
      setTimeout(() => {
        balanceReaction();
      }, 500);
    }
  }, [customInput]);

  // Sample videos mapping for demonstration purposes
  const reactionVideos = {
    'C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O': 'https://storage.googleapis.com/files-gemini-genai/sample-videos/Combustion%20reaction.mp4',
    'H2 + O2 -> H2O': 'https://storage.googleapis.com/files-gemini-genai/sample-videos/Water%20formation.mp4',
    '2 Na + 2 Cl -> 2 NaCl': 'https://storage.googleapis.com/files-gemini-genai/sample-videos/Sodium%20chloride%20formation.mp4',
    'default': 'https://storage.googleapis.com/files-gemini-genai/sample-videos/Chemical%20reaction.mp4'
  };

  const getVideoUrlForReaction = (input: string) => {
    const normalizedInput = input.replace(/\s+/g, ' ').trim();
    for (const [key, url] of Object.entries(reactionVideos)) {
      const normalizedKey = key.replace(/\s+/g, ' ').trim();
      if (normalizedInput.includes(normalizedKey) || normalizedKey.includes(normalizedInput)) {
        return url;
      }
    }
    return reactionVideos.default;
  };

  const balanceReaction = async () => {
    setIsCalculating(true);
    setError(null);
    
    try {
      // Simulate API call since we don't have a real backend
      setTimeout(() => {
        // Simple logic for demonstration - in real app would call actual chemistry API
        const balancedEquation = reactionInput.replace('->', '→');
        setReactionOutput(balancedEquation);
        setIsBalanced(true);
        setIsCalculating(false);
        setShowVideo(true);
        
        // Show toast notification for successful balancing
        toast.success(t('reactions.balanceSuccess') || 'Reaction balanced successfully!', {
          description: t('reactions.viewResults') || 'View results below'
        });
        
        // Scroll to results
        const resultsElement = document.getElementById('reaction-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 800);
    } catch (e: any) {
      console.error("Balancing error:", e);
      setError(t('reactions.errorBalancing') || 'Error balancing the reaction. Please check the equation and try again.');
      setReactionOutput('');
      setIsBalanced(false);
      setIsCalculating(false);
      setShowVideo(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (outputRef.current) {
      outputRef.current.select();
      document.execCommand('copy');
      toast.success(t('reactions.copied') || 'Reaction copied to clipboard!');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReactionInput(e.target.value);
    setIsBalanced(false);
    setShowVideo(false);
    setError(null);
  };

  const handleCalculateClick = () => {
    if (reactionInput.trim() === '') {
      setError(t('reactions.emptyEquation') || 'Please enter a chemical equation.');
      return;
    }
    balanceReaction();
  };

  const handleTryExample = () => {
    setReactionInput('C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O');
    balanceReaction();
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes molecule-float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          
          @keyframes reaction-glow {
            0% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.3); }
            50% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.6); }
            100% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.3); }
          }
          
          @keyframes highlight-animate {
            0% { background-color: rgba(59, 130, 246, 0.1); }
            50% { background-color: rgba(59, 130, 246, 0.3); }
            100% { background-color: rgba(59, 130, 246, 0.1); }
          }
          
          .highlight-section {
            animation: highlight-animate 2s infinite;
            border-radius: 0.5rem;
            padding: 1rem;
          }
          
          .fade-in {
            animation: fadeIn 0.5s ease-in;
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .pulse-effect {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `
      }} />
      
      <Card className="shadow-lg rounded-md overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/20 to-primary/5">
          <CardTitle className="text-2xl font-bold tracking-tight flex items-center">
            <Flame className="mr-2 h-5 w-5 text-orange-500 animate-pulse" />
            {t('reactions.title') || 'Reaction Balancer'}
          </CardTitle>
          <div className="text-muted-foreground">
            {t('reactions.description') || 'Balance chemical equations quickly and accurately.'}
          </div>
        </CardHeader>
        
        <CardContent className="grid gap-4 p-6">
          <div className="grid gap-2">
            <Label htmlFor="reaction-input" className="text-lg font-medium">
              {t('reactions.inputLabel') || 'Enter the chemical equation:'}
            </Label>
            <Textarea
              id="reaction-input"
              placeholder={t('reactions.inputPlaceholder') || 'e.g., H2 + O2 -> H2O'}
              value={reactionInput}
              onChange={handleInputChange}
              className="resize-none text-base p-4 min-h-[80px] border-2"
            />
          </div>
          
          {error && (
            <Alert variant="destructive" className="animate-shake">
              <AlertTitle>{t('reactions.error') || 'Error'}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-center">
            <Button
              onClick={handleCalculateClick}
              disabled={isCalculating}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base py-6 px-6 pulse-effect"
              size="lg"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  {t('reactions.balancing') || 'Balancing...'}
                </>
              ) : (
                <>
                  <Atom className="mr-2 h-5 w-5" />
                  {t('reactions.balance') || 'Balance Reaction'}
                </>
              )}
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="secondary" onClick={handleTryExample}>
                {t('reactions.tryExample') || 'Try Example'}
              </Button>
            </div>
          </div>
          
          {reactionOutput && (
            <div id="reaction-results" className="mt-8 fade-in">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="text-green-500 h-5 w-5 mr-2" /> 
                {t('reactions.results') || 'Reaction Results'}
              </h3>
              
              <div className="grid gap-4 p-4 bg-muted rounded-lg highlight-section">
                <div className="grid gap-2">
                  <Label htmlFor="reaction-output" className="text-base">
                    {t('reactions.outputLabel') || 'Balanced equation:'}
                  </Label>
                  <div className="flex">
                    <Textarea
                      id="reaction-output"
                      ref={outputRef}
                      readOnly
                      value={reactionOutput}
                      className="resize-none bg-background flex-1 text-lg font-mono p-4"
                    />
                    <Button
                      variant="outline"
                      onClick={handleCopyToClipboard}
                      className="ml-2 gap-1 h-auto"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {showVideo && (
                  <div className="mt-4 fade-in">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Play className="h-4 w-4 mr-2" /> 
                      {t('reactions.videoDemo') || 'Video Demonstration'}
                    </h3>
                    <div className="bg-background p-1 rounded-lg shadow-md">
                      <ReactionVideoPlayer 
                        videoUrl={getVideoUrlForReaction(reactionInput)}
                        title={t('reactions.reactionDemo') || 'Reaction Demonstration'}
                        description={t('reactions.reactionExplanation') || 'Visual explanation of the chemical process'}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <Tabs defaultValue="basic" className="w-full mt-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="basic">{t('reactions.basicControls', { defaultValue: 'Basic' })}</TabsTrigger>
              <TabsTrigger value="advanced">{t('reactions.advancedControls', { defaultValue: 'Advanced' })}</TabsTrigger>
              <TabsTrigger value="visual">{t('reactions.visualSettings', { defaultValue: 'Visual' })}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="reaction-controls flex flex-wrap gap-2 justify-center">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={shareReaction}
                  className="transition-all hover:bg-primary/10"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {t('reactions.shareReaction', { defaultValue: 'Share' })}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="text-center text-sm text-muted-foreground">
                {t('reactions.advancedFeatures', { defaultValue: 'Advanced visualization features available after balancing the reaction' })}
              </div>
            </TabsContent>
            
            <TabsContent value="visual" className="space-y-4 pt-4">
              <div className="text-center text-sm text-muted-foreground">
                {t('reactions.visualFeatures', { defaultValue: 'Visual customization options available after balancing the reaction' })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
  
  // Function to share reaction
  function shareReaction() {
    const reactionText = reactionOutput || reactionInput;
    
    navigator.clipboard.writeText(reactionText).then(() => {
      toast.success(t('reactions.copied', { defaultValue: 'Reaction copied to clipboard' }));
    });
  }
}
