
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, TrendingUp, History, Calendar } from 'lucide-react';

interface QuizScore {
  date: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
}

const QuizHistory: React.FC = () => {
  const [quizHistory, setQuizHistory] = useState<QuizScore[]>([]);
  const [bestScore, setBestScore] = useState<QuizScore | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Load quiz history from localStorage
    const savedHistory = localStorage.getItem('quizHistory');
    
    if (savedHistory) {
      const history = JSON.parse(savedHistory) as QuizScore[];
      setQuizHistory(history);
      
      // Find the best score
      if (history.length > 0) {
        const best = history.reduce((prev, current) => {
          return (prev.accuracy > current.accuracy) ? prev : current;
        });
        setBestScore(best);
      }
    }
  }, []);

  if (quizHistory.length === 0) {
    return null; // Don't show history if none exists
  }

  const latestScore = quizHistory[quizHistory.length - 1];

  return (
    <div className="quiz-history space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <History className="h-5 w-5 text-muted-foreground" />
        {t('quiz.history')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              {t('quiz.lastScore')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <div className="text-2xl font-bold">
                {latestScore.score}/{latestScore.totalQuestions}
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(latestScore.date).toLocaleDateString()}
              </div>
            </div>
            <Progress value={latestScore.accuracy * 100} className="h-2" />
            <div className="mt-1 text-xs text-right text-muted-foreground">
              {Math.round(latestScore.accuracy * 100)}% {t('quiz.accuracy')}
            </div>
          </CardContent>
        </Card>
        
        {bestScore && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                {t('quiz.bestScore')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <div className="text-2xl font-bold">
                  {bestScore.score}/{bestScore.totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(bestScore.date).toLocaleDateString()}
                </div>
              </div>
              <Progress value={bestScore.accuracy * 100} className="h-2" />
              <div className="mt-1 text-xs text-right text-muted-foreground">
                {Math.round(bestScore.accuracy * 100)}% {t('quiz.accuracy')}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium">{t('quiz.totalQuizzes')}</span>
            </div>
            <div className="text-lg font-bold">{quizHistory.length}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizHistory;
