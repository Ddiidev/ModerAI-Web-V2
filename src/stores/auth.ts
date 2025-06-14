import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import AuthGoogleClass, { type ApiAuthResponse } from '@/lib/services/auth';

// Interface para as informações do usuário
export interface UserInfo {
  email: string;
  name: string;
  picture: string;
}

// Definição do store de autenticação
export const useAuthStore = defineStore('auth', () => {
  // Estado
  const currentUser = ref<UserInfo | null>(null);
  const token = ref<string | null>(null);
  const authInstance = ref<AuthGoogleClass | null>(null);

  // Getters
  const isAuthenticated = computed(() => {
    return !!currentUser.value && !!token.value;
  });

  // Inicializar a instância de autenticação
  function initAuth() {
    // Configurar a instância de autenticação
    authInstance.value = new AuthGoogleClass({
      baseUrl: import.meta.env.VITE_API_URL,
      redirectUrl: import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback/google`,
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
    });

    // Carregar dados do localStorage
    loadUserFromStorage();

    // Verificar se há um parâmetro AuthParam na URL
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('AuthParam');
    if (authParam) {
      try {
        const userInfoJsonDecoded = decodeURIComponent(escape(atob(authParam)));
        const authResponse = JSON.parse(userInfoJsonDecoded);
        setUserInfo(authResponse);
      } catch (error) {
        console.error('Erro ao processar AuthParam:', error);
      }
    }
  }

  // Carregar usuário do localStorage
  function loadUserFromStorage() {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const authData: ApiAuthResponse = JSON.parse(userInfoStr);
        if (authData.token && authData.user) {
          token.value = authData.token;
          currentUser.value = authData.user;
          console.log('Usuário carregado do localStorage:', currentUser.value);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário do localStorage:', error);
      // Limpar dados corrompidos
      localStorage.removeItem('userInfo');
    }
  }

  // Definir informações do usuário
  function setUserInfo(authResponse: ApiAuthResponse) {
    if (authResponse && authResponse.token && authResponse.user) {
      token.value = authResponse.token;
      currentUser.value = authResponse.user;
      localStorage.setItem('userInfo', JSON.stringify(authResponse));
      console.log('Informações do usuário definidas:', currentUser.value);
    }
  }

  // Iniciar processo de login com Google
  function loginWithGoogle() {
    if (!authInstance.value) {
      initAuth();
    }
    
    if (authInstance.value) {
      authInstance.value.loginWithGoogle();
    } else {
      console.error('Instância de autenticação não inicializada');
    }
  }

  // Processar callback do Google
  async function handleGoogleCallback(code: string): Promise<boolean> {
    try {
      if (!authInstance.value) {
        initAuth();
      }

      if (authInstance.value) {
        const success = await authInstance.value.handleGoogleCallback(code);
        if (success) {
          // Recarregar dados do localStorage após callback
          loadUserFromStorage();
        }
        return success;
      }
      return false;
    } catch (error) {
      console.error('Erro ao processar callback do Google:', error);
      return false;
    }
  }

  // Fazer logout
  function logout() {
    currentUser.value = null;
    token.value = null;
    localStorage.removeItem('userInfo');
    localStorage.removeItem('redirect_after_login');
    console.log('Logout realizado');
  }

  // Verificar se há token válido
  function getToken(): string | null {
    return token.value;
  }

  return {
    currentUser,
    token,
    isAuthenticated,
    initAuth,
    loginWithGoogle,
    handleGoogleCallback,
    logout,
    setUserInfo,
    getToken,
    loadUserFromStorage
  };
});