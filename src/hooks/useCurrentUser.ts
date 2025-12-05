import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { UserResponse } from '../types/auth';

/**
 * Custom hook to fetch current user details using React Query
 * @returns Query result with user data, loading, error states
 */
export function useCurrentUser() {
  return useQuery<UserResponse, Error>({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: authService.isAuthenticated(), // Only fetch if authenticated
  });
}

