import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import { getCurrentUser, logoutUser } from './services/api';
import type { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleAuth = (nextUser: User) => {
    setUser(nextUser);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success('You have been logged out.');
      navigate('/login');
    } catch {
      toast.error('Unable to log out. Please try again.');
    }
  };

  const authenticatedRoutes = useMemo(
    () => (
      <>
        <Route path="/" element={<Layout user={user} onLogout={handleLogout}><HomePage user={user} /></Layout>} />
        <Route path="/explore" element={<Layout user={user} onLogout={handleLogout}><ExplorePage user={user} /></Layout>} />
        <Route
          path="/quiz/:quizId"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Layout user={user} onLogout={handleLogout}><QuizPage user={user} /></Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/results/:attemptId?" element={<Layout user={user} onLogout={handleLogout}><ResultsPage user={user} /></Layout>} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Layout user={user} onLogout={handleLogout}><ProfilePage user={user} /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} loading={loading} adminOnly>
              <Layout user={user} onLogout={handleLogout}><AdminPage user={user} /></Layout>
            </ProtectedRoute>
          }
        />
      </>
    ),
    [user, loading]
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onAuth={handleAuth} />} />
      <Route path="/register" element={<RegisterPage onAuth={handleAuth} />} />
      {authenticatedRoutes}
      <Route path="*" element={<Layout user={user} onLogout={handleLogout}><HomePage user={user} /></Layout>} />
    </Routes>
  );
}
