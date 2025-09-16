
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, CheckCircle, FlaskConical, Timer, Star } from "lucide-react";

interface QuizResultsProps {
  score: number;
  questionsTotal: number;
  timeSpent: number;
  resetQuiz: () => void;
  startQuiz: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  questionsTotal,
  timeSpent,
  resetQuiz,
  startQuiz
}) => {
  const { t } = useLanguage();

  return (
    <div className="container py-8 px-4 max-w-lg mx-auto">
      <Card className="border shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl">{t('quiz.results')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{score}/{questionsTotal}</div>
            <Progress value={(score / questionsTotal) * 100} className="h-3" />
            <p className="text-muted-foreground mt-2">
              {Math.round((score / questionsTotal) * 100)}% {t('quiz.accuracy')}
            </p>
          </div>
          
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Time: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {Math.round((score / questionsTotal) * (1 + 1 / (timeSpent / 60 + 1)) * 100)} points
              </span>
            </div>
          </div>
          
          <div className="flex justify-center">
            {score === questionsTotal ? (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-md flex items-center gap-3 w-full">
                <Award className="h-5 w-5 flex-shrink-0" />
                <p>Perfect score! You've mastered the periodic table.</p>
              </div>
            ) : score >= questionsTotal * 0.7 ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-md flex items-center gap-3 w-full">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <p>Great work! You have a strong understanding of chemistry.</p>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 p-4 rounded-md flex items-center gap-3 w-full">
                <FlaskConical className="h-5 w-5 flex-shrink-0" />
                <p>Keep practicing! Review the periodic table to improve your score.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4 pt-0 pb-6">
          <Button variant="outline" onClick={resetQuiz}>
            {t('learn.closeDetails')}
          </Button>
          <Button onClick={startQuiz}>
            {t('quiz.tryAgain')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizResults;
