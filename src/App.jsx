import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Loader } from './components/ui/Loader';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AppRoutes } from './routes/AppRoutes';
import { ChatbotWidget } from './components/ai/ChatbotWidget';

function App() {
  const dispatch = useDispatch();

  return (
    <ErrorBoundary>
      <Router>
        <Toaster position="bottom-center" />
        <AppRoutes />
        <ChatbotWidget />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
