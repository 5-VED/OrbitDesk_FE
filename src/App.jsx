import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { Loader } from './components/ui/Loader';

// Pages
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const TicketsList = lazy(() => import('./pages/TicketsList').then(module => ({ default: module.TicketsList })));
const TicketDetail = lazy(() => import('./pages/TicketDetail').then(module => ({ default: module.TicketDetail })));
const Contacts = lazy(() => import('./pages/Contacts').then(module => ({ default: module.Contacts })));
const Agents = lazy(() => import('./pages/Agents').then(module => ({ default: module.Agents })));
const Groups = lazy(() => import('./pages/Groups').then(module => ({ default: module.Groups })));
const Organizations = lazy(() => import('./pages/Organizations').then(module => ({ default: module.Organizations })));
const Reports = lazy(() => import('./pages/Reports').then(module => ({ default: module.Reports })));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase').then(module => ({ default: module.KnowledgeBase })));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const Login = lazy(() => import('./pages/auth/Login').then(module => ({ default: module.Login })));
const Signup = lazy(() => import('./pages/auth/Signup').then(module => ({ default: module.Signup })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(module => ({ default: module.ForgotPassword })));

function App() {
  return (
    <>
      <Toaster position="bottom-center" />
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Suspense fallback={<Loader fullScreen />}><Login /></Suspense>} />
          <Route path="/signup" element={<Suspense fallback={<Loader fullScreen />}><Signup /></Suspense>} />
          <Route path="/forgot-password" element={<Suspense fallback={<Loader fullScreen />}><ForgotPassword /></Suspense>} />

          {/* App Routes */}
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Suspense fallback={<Loader />}><Dashboard /></Suspense>} />
            <Route path="/tickets" element={<Suspense fallback={<Loader />}><TicketsList /></Suspense>} />
            <Route path="/tickets/:ticketId" element={<Suspense fallback={<Loader />}><TicketDetail /></Suspense>} />
            <Route path="/contacts" element={<Suspense fallback={<Loader />}><Contacts /></Suspense>} />
            <Route path="/agents" element={<Suspense fallback={<Loader />}><Agents /></Suspense>} />
            <Route path="/groups" element={<Suspense fallback={<Loader />}><Groups /></Suspense>} />
            <Route path="/organizations" element={<Suspense fallback={<Loader />}><Organizations /></Suspense>} />
            <Route path="/reports" element={<Suspense fallback={<Loader />}><Reports /></Suspense>} />
            <Route path="/knowledge-base" element={<Suspense fallback={<Loader />}><KnowledgeBase /></Suspense>} />
            <Route path="/settings" element={<Suspense fallback={<Loader />}><Settings /></Suspense>} />
            <Route path="/profile" element={<Suspense fallback={<Loader />}><Profile /></Suspense>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
