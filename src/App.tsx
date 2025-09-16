
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Search from './pages/Search';
import Learn from './pages/Learn';
import Reactions from './pages/Reactions';
import Quiz from './pages/Quiz';
import { Navbar } from './components/Navbar';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './components/ui/elementStyles.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Add custom animation for the voice search feature
import './styles.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/reactions" element={<Reactions />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
          <Toaster closeButton position="bottom-right" />
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
