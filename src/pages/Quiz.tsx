
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from "sonner";
import { generateQuestions, QuizScore, QuizSettings } from '@/lib/quiz-utils';
import QuizIntro from '@/components/quiz/QuizIntro';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizResults from '@/components/quiz/QuizResults';
import QuizHistory from '@/components/QuizHistory';

export default function Quiz() {
  const { t, language } = useLanguage();
  const [quizStarted, setQuizStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);
  
  // Quiz settings
  const [settings, setSettings] = useState({
    questionCount: 10,
    questionTypes: {
      elementSymbol: true,
      elementCategory: true,
      elementProperty: true
    },
    timeLimit: null // no time limit by default
  });
  
  // Load quiz history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) {
      setQuizHistory(JSON.parse(savedHistory));
    }
  }, []);
  
  // Timer effect
  useEffect(() => {
    if (quizStarted && startTime !== null && !quizCompleted) {
      const interval = setInterval(() => {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        setTimeSpent(currentTime);
        
        // If there's a time limit, update remaining time
        if (settings.timeLimit !== null) {
          const remaining = settings.timeLimit - currentTime;
          setRemainingTime(remaining > 0 ? remaining : 0);
          
          // End quiz if time is up
          if (remaining <= 0) {
            clearInterval(interval);
            finishQuiz();
          }
        }
      }, 1000);
      
      setTimerInterval(interval);
      
      return () => {
        clearInterval(interval);
        setTimerInterval(null);
      };
    }
  }, [quizStarted, startTime, quizCompleted, settings.timeLimit]);
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  const updateQuestionCount = (value) => {
    setSettings({
      ...settings,
      questionCount: value[0]
    });
  };
  
  const updateQuestionType = (type, value) => {
    setSettings({
      ...settings,
      questionTypes: {
        ...settings.questionTypes,
        [type]: value
      }
    });
  };
  
  const updateTimeLimit = (value) => {
    setSettings({
      ...settings,
      timeLimit: value === 'none' ? null : parseInt(value)
    });
  };
  
  const startQuiz = () => {
    // Force language refresh before starting quiz
    const newQuestions = generateQuestions(settings);
    if (newQuestions.length === 0) {
      toast.error(t('quiz.noQuestionsError', { defaultValue: "Could not generate questions. Please check your settings." }));
      return;
    }
    
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setScore(0);
    setStartTime(Date.now());
    setTimeSpent(0);
    setRemainingTime(settings.timeLimit);
    setQuizStarted(true);
    setQuizCompleted(false);
    setShowSettings(false);
  };
  
  const handleOptionSelect = (option) => {
    if (!submitted) {
      setSelectedOption(option);
    }
  };
  
  const submitAnswer = () => {
    if (selectedOption === null) return;
    
    setSubmitted(true);
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      finishQuiz();
    }
  };
  
  const finishQuiz = () => {
    // Clear any running timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    const finalTimeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : timeSpent;
    const accuracy = score / questions.length;
    
    const quizResult = {
      date: new Date().toISOString(),
      score,
      totalQuestions: questions.length,
      accuracy,
      timeSpent: finalTimeSpent
    };
    
    const updatedHistory = [...quizHistory, quizResult];
    setQuizHistory(updatedHistory);
    localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
    
    setQuizCompleted(true);
    setTimeSpent(finalTimeSpent);
  };
  
  const resetQuiz = () => {
    setQuizStarted(false);
    setShowSettings(false);
    setQuizCompleted(false);
  };
  
  if (!quizStarted) {
    return (
      <QuizIntro 
        showSettings={showSettings}
        toggleSettings={toggleSettings}
        settings={settings}
        updateQuestionCount={updateQuestionCount}
        updateQuestionType={updateQuestionType}
        updateTimeLimit={updateTimeLimit}
        startQuiz={startQuiz}
      />
    );
  }
  
  if (quizCompleted) {
    return (
      <QuizResults
        score={score}
        questionsTotal={questions.length}
        timeSpent={timeSpent}
        resetQuiz={resetQuiz}
        startQuiz={startQuiz}
      />
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <QuizQuestion
      currentQuestion={currentQuestion}
      currentQuestionIndex={currentQuestionIndex}
      questionsTotal={questions.length}
      score={score}
      remainingTime={remainingTime}
      selectedOption={selectedOption}
      submitted={submitted}
      handleOptionSelect={handleOptionSelect}
      submitAnswer={submitAnswer}
      nextQuestion={nextQuestion}
    />
  );
}
