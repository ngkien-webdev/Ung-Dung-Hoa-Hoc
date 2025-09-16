
import { Element } from '@/lib/constants';
import { elements } from "@/lib/elements-data";

export interface Question {
  id: number;
  type: 'elementSymbol' | 'elementCategory' | 'elementProperty';
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizScore {
  date: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpent: number; // in seconds
}

export interface QuizSettings {
  questionCount: number;
  questionTypes: {
    elementSymbol: boolean;
    elementCategory: boolean;
    elementProperty: boolean;
  };
  timeLimit: number | null; // in seconds, null means no time limit
}

// Shuffle an array using Fisher-Yates algorithm
export const shuffleArray = <T extends unknown>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Generate random questions based on settings
export const generateQuestions = (settings: QuizSettings): Question[] => {
  const questions: Question[] = [];
  const usedElementIndices = new Set<number>();
  
  // Calculate proportions based on enabled question types
  const enabledTypes = [];
  if (settings.questionTypes.elementSymbol) enabledTypes.push('elementSymbol');
  if (settings.questionTypes.elementCategory) enabledTypes.push('elementCategory');
  if (settings.questionTypes.elementProperty) enabledTypes.push('elementProperty');
  
  if (enabledTypes.length === 0) {
    // Default to all types if none selected
    enabledTypes.push('elementSymbol', 'elementCategory', 'elementProperty');
  }
  
  const questionsPerType = Math.ceil(settings.questionCount / enabledTypes.length);
  
  // Generate element symbol questions
  if (settings.questionTypes.elementSymbol) {
    for (let i = 0; i < Math.min(questionsPerType, settings.questionCount); i++) {
      let randomElementIndex: number;
      do {
        randomElementIndex = Math.floor(Math.random() * elements.length);
      } while (usedElementIndices.has(randomElementIndex));
      
      usedElementIndices.add(randomElementIndex);
      const element = elements[randomElementIndex];
      
      // Generate 3 random incorrect options
      const incorrectOptions = elements
        .filter((_, index) => index !== randomElementIndex)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(e => e.symbol);
      
      questions.push({
        id: questions.length + 1,
        type: 'elementSymbol',
        question: `What is the chemical symbol for ${element.name}?`,
        options: shuffleArray([element.symbol, ...incorrectOptions]),
        correctAnswer: element.symbol
      });
    }
  }
  
  // Generate element category questions
  if (settings.questionTypes.elementCategory && questions.length < settings.questionCount) {
    const remainingQuestions = settings.questionCount - questions.length;
    for (let i = 0; i < Math.min(questionsPerType, remainingQuestions); i++) {
      let randomElementIndex: number;
      do {
        randomElementIndex = Math.floor(Math.random() * elements.length);
      } while (usedElementIndices.has(randomElementIndex));
      
      usedElementIndices.add(randomElementIndex);
      const element = elements[randomElementIndex];
      
      const categories = [...new Set(elements.map(e => e.category))];
      const incorrectCategories = categories
        .filter(category => category !== element.category)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      questions.push({
        id: questions.length + 1,
        type: 'elementCategory',
        question: `Which category does ${element.name} belong to?`,
        options: shuffleArray([element.category, ...incorrectCategories]),
        correctAnswer: element.category
      });
    }
  }
  
  // Generate element property questions
  if (settings.questionTypes.elementProperty && questions.length < settings.questionCount) {
    const remainingQuestions = settings.questionCount - questions.length;
    
    const propertyQuestions = [
      {
        property: 'state',
        question: 'Which element is a liquid at room temperature?',
        correctAnswers: elements.filter(e => e.state === 'liquid').map(e => e.name),
        incorrectPool: elements.filter(e => e.state !== 'liquid')
      },
      {
        property: 'discoveryYear',
        question: 'Which element was discovered most recently?',
        getCorrectAnswer: (options: Element[]) => {
          return options.reduce((latest, current) => {
            const latestYear = latest.discoveryYear || 0;
            const currentYear = current.discoveryYear || 0;
            return latestYear > currentYear ? latest : current;
          }).name;
        }
      }
    ];
    
    for (let i = 0; i < Math.min(questionsPerType, remainingQuestions); i++) {
      const randomPropertyIndex = Math.floor(Math.random() * propertyQuestions.length);
      const propertyQuestion = propertyQuestions[randomPropertyIndex];
      
      let options: string[] = [];
      let correctAnswer: string = '';
      
      if (propertyQuestion.property === 'discoveryYear') {
        const elementOptions = shuffleArray(elements.filter(e => e.discoveryYear))
          .slice(0, 4);
        options = elementOptions.map(e => e.name);
        correctAnswer = propertyQuestion.getCorrectAnswer(elementOptions);
      } else {
        const correctPool = propertyQuestion.correctAnswers;
        const correctElement = correctPool[Math.floor(Math.random() * correctPool.length)];
        
        const incorrectOptions = shuffleArray(propertyQuestion.incorrectPool)
          .slice(0, 3)
          .map(e => e.name);
        
        options = shuffleArray([correctElement, ...incorrectOptions]);
        correctAnswer = correctElement;
      }
      
      questions.push({
        id: questions.length + 1,
        type: 'elementProperty',
        question: propertyQuestion.question,
        options,
        correctAnswer
      });
    }
  }
  
  return shuffleArray(questions).slice(0, settings.questionCount);
};
