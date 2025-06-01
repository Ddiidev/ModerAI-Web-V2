export interface GoogleUserData {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
}

export interface BackendLoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role?: string;
    permissions?: string[];
  };
  message?: string;
  error?: string;
}

export interface SessionData {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  expires: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
    permissions?: string[];
  } | null;
  session: SessionData | null;
  error: string | null;
  token: string | null;
}

export interface AuthError {
  type: 'SIGNIN_ERROR' | 'CALLBACK_ERROR' | 'SESSION_ERROR' | 'NETWORK_ERROR';
  message: string;
  details?: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}