import { useState, Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import ExploreSkills from './pages/ExploreSkills';
import SkillMatch from './pages/SkillMatch';
import Profile from './pages/Profile';
import MySkills from './pages/MySkills';
import Connections from './pages/Connections';
import Messages from './pages/Messages';
import LearningProgress from './pages/LearningProgress';
import Community from './pages/Community';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Toast from './components/ui/Toast';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-8">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">Something went wrong</h2>
            <p className="text-surface-600 dark:text-surface-400 mb-4">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
              className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
              Go Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useApp();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const { toasts } = useApp();

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="explore" element={<ExploreSkills />} />
          <Route path="matches" element={<SkillMatch />} />
          <Route path="profile/:userId?" element={<Profile />} />
          <Route path="my-skills" element={<MySkills />} />
          <Route path="connections" element={<Connections />} />
          <Route path="messages" element={<Messages />} />
          <Route path="progress" element={<LearningProgress />} />
          <Route path="community" element={<Community />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </ErrorBoundary>
  );
}

export default App;
