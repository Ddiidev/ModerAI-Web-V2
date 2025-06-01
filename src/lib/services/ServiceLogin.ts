import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';
import type { GoogleUserData, BackendLoginResponse, SessionData } from '$lib/types/auth';
import { isValidToken, formatAuthError } from '$lib/utils/auth';

class ServiceLogin {
  private apiUrl: string;

  constructor() {
    this.apiUrl = PUBLIC_API_URL || 'http://localhost:4242';
  }

  /**
   * Realiza login com Google enviando o token para o backend
   * @param idToken - Token ID do Google OAuth
   * @param userData - Dados do usuário obtidos do Google
   * @returns Promise com a resposta do backend
   */
  async loginWithGoogle(idToken: string, userData: GoogleUserData): Promise<BackendLoginResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'google',
          idToken,
          userData: {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            given_name: userData.given_name,
            family_name: userData.family_name,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendLoginResponse = await response.json();
      
      // Se o login foi bem-sucedido, armazena o token
      if (data.success && data.token) {
        this.storeAuthToken(data.token);
      }

      return data;
    } catch (error) {
      console.error('Erro no login com Google:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido no login',
      };
    }
  }

  /**
   * Armazena o token de autenticação no localStorage
   * @param token - Token de autenticação
   */
  private storeAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Recupera o token de autenticação do localStorage
   * @returns Token de autenticação ou null
   */
  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Remove o token de autenticação do localStorage
   */
  clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns true se há um token válido
   */
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return token !== null && token.length > 0;
  }

  /**
   * Realiza logout removendo o token e fazendo chamada para o backend
   */
  async logout(): Promise<void> {
    try {
      const token = this.getAuthToken();
      
      if (token) {
        // Chama o endpoint de logout no backend
        await fetch(`${this.apiUrl}/api/v1/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Remove o token independentemente do resultado da chamada
      this.clearAuthToken();
    }
  }

  /**
   * Obtém informações do usuário do backend usando o token
   * @returns Dados do usuário ou null
   */
  async getUserInfo(): Promise<any | null> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        return null;
      }

      const response = await fetch(`${this.apiUrl}/api/v1/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      return null;
    }
  }
}

// Exporta uma instância singleton do serviço
export const serviceLogin = new ServiceLogin();
export default ServiceLogin;