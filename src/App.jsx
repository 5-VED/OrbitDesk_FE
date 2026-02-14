import { Suspense, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader } from './components/ui/Loader';
import { AppRoutes } from './routes/AppRoutes';
import { ChatbotWidget } from './components/ai/ChatbotWidget';

function App() {
  return (
    <Router>
      <Toaster position="bottom-center" />
      <AppRoutes />
      <ChatbotWidget />
    </Router>
  );
}

export default App;
