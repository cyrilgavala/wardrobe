import type {
  AuthenticationResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  UserResponse
} from '../types/auth';
import { deleteCookie, getCookie, setCookie } from '../utils/cookies';
import { api } from './api';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

class AuthService {
  // Login user
  async login(data: LoginRequest): Promise<AuthenticationResponse> {
    const response = await api.post<AuthenticationResponse>(
      '/auth/login',
      data
    );
    console.log('[AuthService] Login response:', response);
    this.saveTokens(response);
    return response;
  }

  // Register new user
  async register(data: RegisterRequest): Promise<AuthenticationResponse> {
    const response = await api.post<AuthenticationResponse>(
      '/auth/register',
      data
    );
    this.saveTokens(response);
    return response;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', { headers: { Authorization: `Bearer ${getCookie('accessToken')}` } });
    } finally {
      this.clearTokens();
    }
  }

  // Refresh access token
  async refreshToken(): Promise<AuthenticationResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const data: RefreshTokenRequest = { refreshToken };
    const response = await api.post<AuthenticationResponse>(
      '/auth/refresh',
      data
    );
    this.saveTokens(response);
    return response;
  }

  // Get current user
  async getCurrentUser(): Promise<UserResponse> {
    return api.get<UserResponse>('/auth/me', { headers: { Authorization: `Bearer ${getCookie('accessToken')}` } });
  }

  // Token management
  saveTokens(response: AuthenticationResponse): void {
    // Access token expires in 1 day
    setCookie(TOKEN_KEY, response.accessToken, {
      days: 1,
      sameSite: 'strict'
    });
    // Refresh token expires in 7 days
    setCookie(REFRESH_TOKEN_KEY, response.refreshToken, {
      days: 7,
      sameSite: 'strict'
    });
  }

  getAccessToken(): string | null {
    return getCookie(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return getCookie(REFRESH_TOKEN_KEY);
  }

  clearTokens(): void {
    deleteCookie(TOKEN_KEY);
    deleteCookie(REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();
