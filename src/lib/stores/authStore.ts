import { writable, derived, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import ServiceLogin from '$lib/services/ServiceLogin';
import type { AuthState, SessionData } from '$lib/types/auth';
import { isValidSession, formatAuthError } from '$lib/utils/auth';

// Estado inicial
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  session: null,
  error: null,
  token: null,
};

// Instância do serviço de login
const serviceLogin = new ServiceLogin();

// Store principal de autenticação
export const authStore = writable<AuthState>(initialState);

// Store derivado para verificar se está carregando
export const isLoading = derived(authStore, ($authStore) => $authStore.isLoading);

// Store derivado para verificar se está autenticado
export const isAuthenticated = derived(authStore, ($authStore) => $authStore.isAuthenticated);

// Store derivado para obter dados do usuário
export const currentUser = derived(authStore, ($authStore) => $authStore.user);

// Store derivado para obter erros
export const authError = derived(authStore, ($authStore) => $authStore.error);

// Funções para gerenciar o estado
export const authActions = {
  // Inicializa o estado de autenticação
  init: () => {
    if (browser) {
      const token = serviceLogin.getAuthToken();
      if (token) {
        authStore.update(state => ({
          ...state,
          token,
          isAuthenticated: true,
          isLoading: true,
        }));
        
        // Busca informações do usuário
        authActions.fetchUserInfo();
      }
    }
  },

  // Define o estado de carregamento
  setLoading: (isLoading: boolean) => {
    authStore.update(state => ({ ...state, isLoading }));
  },

  // Define um erro
  setError: (error: string | null) => {
    authStore.update(state => ({ ...state, error, isLoading: false }));
  },

  // Limpa erros
  clearError: () => {
    authStore.update(state => ({ ...state, error: null }));
  },

  // Atualiza os dados da sessão após login bem-sucedido
  setSession: (sessionData: SessionData) => {
    authStore.update(state => ({
      ...state,
      isAuthenticated: true,
      user: sessionData.user,
      session: sessionData,
      token: serviceLogin.getAuthToken(),
      isLoading: false,
      error: null,
    }));
  },

  // Busca informações do usuário do backend
  fetchUserInfo: async () => {
    try {
      authActions.setLoading(true);
      const userInfo = await serviceLogin.getUserInfo();
      
      if (userInfo) {
        let userImage = userInfo.picture || userInfo.image;
        if (userInfo.id) {
          const localImage = authActions.getUserImageFromLocalStorage(userInfo.id);
          if (localImage) {
            userImage = localImage;
          } else if (userImage) {
            // Se não tem no localStorage mas tem na resposta, salva
            authActions.saveUserImageToLocalStorage(userInfo.id, userImage);
          }
        }
        authStore.update(state => ({
          ...state,
          user: {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            image: userImage,
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));
      } else {
        // Se não conseguiu buscar info do usuário, faz logout
        authActions.logout();
      }
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      authActions.setError('Erro ao carregar informações do usuário');
      authActions.logout();
    }
  },

  // Busca imagem do localStorage
  getUserImageFromLocalStorage: (userId: string): string | null => {
    if (browser) {
      return localStorage.getItem(`userImage_${userId}`);
    }
    return null;
  },

  // Salva imagem no localStorage
  saveUserImageToLocalStorage: (userId: string, imageUrl: string) => {
    if (browser) {
      localStorage.setItem(`userImage_${userId}`, imageUrl);
    }
  },

  // Realiza login
  login: async (sessionData: SessionData) => {
    try {
      authActions.setLoading(true);
      authActions.clearError();
      
      // Chama o serviço de login para enviar dados ao backend
      const response = await serviceLogin.loginWithGoogle(
        sessionData.accessToken || '',
        {
          id: sessionData.user.id,
          email: sessionData.user.email,
          name: sessionData.user.name,
          picture: sessionData.user.image,
        }
      );

      if (response.success) {
        if (sessionData.user.image && sessionData.user.id) {
          authActions.saveUserImageToLocalStorage(sessionData.user.id, sessionData.user.image);
        }
        authActions.setSession(sessionData);
      } else {
        authActions.setError(response.error || 'Erro no login');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      authActions.setError('Erro inesperado no login');
    }
  },

  // Realiza logout
  logout: async () => {
    try {
      authActions.setLoading(true);
      await serviceLogin.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      authStore.set(initialState);
    }
  },

  // Atualiza dados do usuário
  updateUser: (userData: Partial<AuthState['user']>) => {
    authStore.update(state => ({
      ...state,
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },
};

// Inicializa o store quando o módulo é carregado
if (browser) {
  authActions.init();
}