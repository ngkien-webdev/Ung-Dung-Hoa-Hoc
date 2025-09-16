
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, FlaskConical, Award } from "lucide-react";
import { QuizSettings as QuizSettingsType } from '@/lib/quiz-utils';
import QuizSettings from './QuizSettings';
import QuizHistory from '@/components/QuizHistory';

interface QuizIntroProps {
  showSettings: boolean;
  toggleSettings: () => void;
  settings: QuizSettingsType;
  updateQuestionCount: (value: number[]) => void;
  updateQuestionType: (type: keyof QuizSettingsType['questionTypes'], value: boolean) => void;
  updateTimeLimit: (value: string) => void;
  startQuiz: () => void;
}

const QuizIntro: React.FC<QuizIntroProps> = ({
  showSettings,
  toggleSettings,
  settings,
  updateQuestionCount,
  updateQuestionType,
  updateTimeLimit,
  startQuiz
}) => {
  const { t } = useLanguage();

  // Helper function to handle translation fallbacks
  const getText = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  return (
    <div className="container py-8 px-4 space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{getText('quiz.title', 'Test Your Knowledge')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{getText('quiz.description', 'Challenge yourself with quizzes on elements and chemistry concepts')}</p>
      </div>
      
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border shadow-sm">
        <CardHeader>
          <QuizSettings 
            settings={settings}
            showSettings={showSettings}
            toggleSettings={toggleSettings}
            updateQuestionCount={updateQuestionCount}
            updateQuestionType={updateQuestionType}
            updateTimeLimit={updateTimeLimit}
          />
        </CardHeader>
        
        {!showSettings && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/80 dark:bg-gray-800/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-blue-500" />
                    {getText('quiz.elementSymbols', 'Element Symbols')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {getText('quiz.elementSymbolsDesc', 'Identify chemical symbols for elements across the periodic table.')}
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-gray-800/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    {getText('quiz.elementCategories', 'Element Categories')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {getText('quiz.elementCategoriesDesc', 'Test your knowledge of which category different elements belong to.')}
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 dark:bg-gray-800/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="h-4 w-4 text-green-500" />
                    {getText('quiz.elementProperties', 'Element Properties')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {getText('quiz.elementPropertiesDesc', 'Answer questions about properties like melting points, density, and more.')}
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">{getText('quiz.instructions', 'Instructions')}</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>{getText('quiz.instructionsItem1', 'Select an answer for each question')}</li>
                <li>{getText('quiz.instructionsItem2', 'Submit your answer to see if you\'re correct')}</li>
                <li>{getText('quiz.instructionsItem3', 'Track your progress and improve your score')}</li>
              </ul>
            </div>
          </CardContent>
        )}
        
        <CardFooter className="flex justify-center pb-6">
          <Button size="lg" onClick={startQuiz} className="px-8">
            {getText('quiz.startQuiz', 'Start Quiz')}
          </Button>
        </CardFooter>
      </Card>
      
      <QuizHistory />
    </div>
  );
};

export default QuizIntro;
