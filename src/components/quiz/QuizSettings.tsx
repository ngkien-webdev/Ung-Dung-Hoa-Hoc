
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';
import { Settings, Clock, BookOpen, CircleHelp } from "lucide-react";
import { QuizSettings as QuizSettingsType } from '@/lib/quiz-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface QuizSettingsProps {
  settings: QuizSettingsType;
  showSettings: boolean;
  toggleSettings: () => void;
  updateQuestionCount: (value: number[]) => void;
  updateQuestionType: (type: keyof QuizSettingsType['questionTypes'], value: boolean) => void;
  updateTimeLimit: (value: string) => void;
}

const QuizSettings: React.FC<QuizSettingsProps> = ({
  settings,
  showSettings,
  toggleSettings,
  updateQuestionCount,
  updateQuestionType,
  updateTimeLimit
}) => {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          {t('quiz.title')}
        </div>
        <Button variant="outline" size="sm" onClick={toggleSettings} className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          <span>{t('quiz.settings')}</span>
        </Button>
      </div>

      {showSettings && (
        <Card className="mt-4 border shadow-sm">
          <CardContent className="space-y-6 pt-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="font-medium">{t('quiz.questionCount') || 'Number of Questions'}: {settings.questionCount}</Label>
              </div>
              <Slider 
                value={[settings.questionCount]} 
                min={5} 
                max={30}
                step={5}
                onValueChange={updateQuestionCount}
                className="w-full"
              />
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">{t('quiz.questionTypes') || 'Question Types'}:</h3>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="symbolQuestions" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      {t('quiz.elementSymbols') || 'Element Symbols'}
                    </div>
                  </Label>
                  <Switch 
                    id="symbolQuestions" 
                    checked={settings.questionTypes.elementSymbol}
                    onCheckedChange={(checked) => updateQuestionType('elementSymbol', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="categoryQuestions" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-green-500" />
                      {t('quiz.elementCategories') || 'Element Categories'}
                    </div>
                  </Label>
                  <Switch 
                    id="categoryQuestions" 
                    checked={settings.questionTypes.elementCategory}
                    onCheckedChange={(checked) => updateQuestionType('elementCategory', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="propertyQuestions" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-amber-500" />
                      {t('quiz.elementProperties') || 'Element Properties'}
                    </div>
                  </Label>
                  <Switch 
                    id="propertyQuestions" 
                    checked={settings.questionTypes.elementProperty}
                    onCheckedChange={(checked) => updateQuestionType('elementProperty', checked)}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-red-500" />
                <Label className="font-medium">{t('quiz.timeLimit') || 'Time Limit'}:</Label>
              </div>
              <Select
                value={settings.timeLimit === null ? 'none' : settings.timeLimit.toString()}
                onValueChange={updateTimeLimit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('quiz.selectTimeLimit') || "Select time limit"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('quiz.noTimeLimit') || 'No time limit'}</SelectItem>
                  <SelectItem value="60">{t('quiz.minute', { count: 1 }) || '1 minute'}</SelectItem>
                  <SelectItem value="180">{t('quiz.minute', { count: 3 }) || '3 minutes'}</SelectItem>
                  <SelectItem value="300">{t('quiz.minute', { count: 5 }) || '5 minutes'}</SelectItem>
                  <SelectItem value="600">{t('quiz.minute', { count: 10 }) || '10 minutes'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizSettings;
