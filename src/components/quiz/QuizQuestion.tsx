
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '@/contexts/LanguageContext';
import { Timer, CheckCircle, XCircle, Award } from "lucide-react";
import { Question } from '@/lib/quiz-utils';

interface QuizQuestionProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  questionsTotal: number;
  score: number;
  remainingTime: number | null;
  selectedOption: string | null;
  submitted: boolean;
  handleOptionSelect: (option: string) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  currentQuestion,
  currentQuestionIndex,
  questionsTotal,
  score,
  remainingTime,
  selectedOption,
  submitted,
  handleOptionSelect,
  submitAnswer,
  nextQuestion
}) => {
  const { t, language } = useLanguage();

  // Format time display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <div className="container py-8 px-4 max-w-2xl mx-auto">
      <Card className="border shadow-md bg-gradient-to-br from-background to-secondary/20 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>
              {t('quiz.question')} {currentQuestionIndex + 1} {t('quiz.of')} {questionsTotal}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">
                {t('quiz.score')}: {score}
              </span>
            </div>
          </div>
          <Progress 
            value={((currentQuestionIndex + 1) / questionsTotal) * 100} 
            className="h-2 mt-3 bg-secondary" 
          />
          
          {remainingTime !== null && (
            <div className="flex items-center justify-end mt-2 gap-1">
              <Timer className="h-4 w-4 text-muted-foreground animate-pulse" />
              <span className="text-sm text-muted-foreground font-mono">
                {formatTime(remainingTime)}
              </span>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6 pt-4">
          <div className="text-lg font-medium p-3 bg-muted/30 rounded-lg border border-border/50">
            {currentQuestion.question}
          </div>
          
          <RadioGroup value={selectedOption || ""} className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index} 
                className={`
                  flex items-center space-x-2 border rounded-md p-3 transition-all hover:shadow-md
                  ${selectedOption === option ? 'border-primary bg-primary/5' : 'hover:bg-muted/50 cursor-pointer'}
                  ${submitted && option === currentQuestion.correctAnswer ? 'bg-green-50 dark:bg-green-900/20 border-green-500 shadow-sm shadow-green-200 dark:shadow-green-900/20' : ''}
                  ${submitted && selectedOption === option && option !== currentQuestion.correctAnswer ? 'bg-red-50 dark:bg-red-900/20 border-red-500 shadow-sm shadow-red-200 dark:shadow-red-900/20' : ''}
                `}
                onClick={() => !submitted && handleOptionSelect(option)}
              >
                <RadioGroupItem 
                  value={option} 
                  id={`option-${index}`} 
                  disabled={submitted}
                  className={submitted && option === currentQuestion.correctAnswer ? 'text-green-500' : ''}
                />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-grow cursor-pointer"
                >
                  {option}
                </Label>
                {submitted && option === currentQuestion.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {submitted && selectedOption === option && option !== currentQuestion.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>
          
          {submitted && selectedOption !== currentQuestion.correctAnswer && (
            <div className="bg-muted p-4 rounded-md text-sm border-l-4 border-primary animate-fade-in">
              <p className="font-medium">{t('quiz.correctAnswer')}: {currentQuestion.correctAnswer}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3 pt-2">
          {!submitted ? (
            <Button 
              onClick={submitAnswer} 
              disabled={selectedOption === null} 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all"
            >
              {t('quiz.submit')}
            </Button>
          ) : (
            <Button 
              onClick={nextQuestion}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              {currentQuestionIndex < questionsTotal - 1 ? t('quiz.next') : t('quiz.finish')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizQuestion;
