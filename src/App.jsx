import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader } from './components/ui/Loader';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <>
      <Toaster position="bottom-center" />
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
