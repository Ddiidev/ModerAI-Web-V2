import type { SessionData, AuthError } from '$lib/types/auth';

/**
 * Valida se uma sessão é válida
 */
export function isValidSession(session: SessionData | null): boolean {
  if (!session) return false;
  
  // Verifica se a sessão não expirou
  const now = new Date();
  const expires = new Date(session.expires);
  
  if (now >= expires) {
    return false;
  }
  
  // Verifica se tem dados básicos do usuário
  return !!(session.user?.id && session.user?.email);
}

/**
 * Valida se um token JWT é válido (verificação básica)
 */
export function isValidToken(token: string | null): boolean {
  if (!token) return false;
  
  try {
    // Verifica se tem o formato básico de JWT (3 partes separadas por pontos)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Tenta decodificar o payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Verifica se não expirou
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Extrai informações do payload de um token JWT
 */
export function decodeJWTPayload(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

/**
 * Formata erros de autenticação
 */
export function formatAuthError(error: any): AuthError {
  if (error?.type) {
    return error as AuthError;
  }
  
  // Mapeia erros comuns
  const message = error?.message || error?.toString() || 'Erro de autenticação desconhecido';
  
  if (message.includes('network') || message.includes('fetch')) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Erro de conexão. Verifique sua internet.',
      details: error
    };
  }
  
  if (message.includes('signin') || message.includes('login')) {
    return {
      type: 'SIGNIN_ERROR',
      message: 'Erro ao fazer login. Tente novamente.',
      details: error
    };
  }
  
  if (message.includes('callback')) {
    return {
      type: 'CALLBACK_ERROR',
      message: 'Erro no retorno da autenticação.',
      details: error
    };
  }
  
  return {
    type: 'SESSION_ERROR',
    message,
    details: error
  };
}

/**
 * Gera um estado aleatório para OAuth (CSRF protection)
 */
export function generateOAuthState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida senha (mínimo 8 caracteres, pelo menos 1 letra e 1 número)
 */
export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Sanitiza dados do usuário removendo informações sensíveis
 */
export function sanitizeUserData(user: any) {
  const { password, ...sanitized } = user;
  return sanitized;
}

/**
 * Verifica se o usuário tem uma permissão específica
 */
export function hasPermission(userPermissions: string[] | undefined, requiredPermission: string): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(requiredPermission) || userPermissions.includes('admin');
}

/**
 * Verifica se o usuário tem um papel específico
 */
export function hasRole(userRole: string | undefined, requiredRole: string): boolean {
  if (!userRole) return false;
  return userRole === requiredRole || userRole === 'admin';
}