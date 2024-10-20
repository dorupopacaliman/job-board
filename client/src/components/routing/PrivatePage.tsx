import { useAuth } from '@/features/authentication';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const PrivatePage = ({ children }: { children: ReactNode }) => {
  const { user, isLoadingUser } = useAuth();
  const location = useLocation();

  if (isLoadingUser) return <LoadingSpinner className="w-24 h-24" />;

  if (user === null) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
}
