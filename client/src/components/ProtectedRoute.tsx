import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from '../types';

interface ProtectedRouteProps {
  user: User | null;
  loading?: boolean;
  adminOnly?: boolean;
  children: ReactNode;
}

export default function ProtectedRoute({ user, loading = false, adminOnly = false, children }: ProtectedRouteProps) {
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-500">Loading your session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
