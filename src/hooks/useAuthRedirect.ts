import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

/**
 * Custom hook to redirect authenticated users away from auth pages
 * @param redirectTo - The path to redirect to if user is authenticated (default: '/dashboard')
 */
export function useAuthRedirect(redirectTo = '/dashboard') {
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);
}
