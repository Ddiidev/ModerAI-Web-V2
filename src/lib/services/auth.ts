// Interfaces para tipagem TypeScript
export interface AuthParams {
	baseUrl: string;
	redirectUrl: string;
	client_id: string;
}

export interface ApiAuthResponse {
	token: string;
	user: UserInfo;
}

export interface UserInfo {
	email: string;
	name: string;
	picture: string;
}

/**
 * Classe para autenticação com Google OAuth
 * Adaptada para Node.js com tipagem TypeScript
 */
export class AuthGoogleClass {
	private baseUrl: string;
	private redirectUrl: string;
	private client_id: string;

	constructor(params: AuthParams) {
		this.baseUrl = params.baseUrl;
		this.redirectUrl = params.redirectUrl;
		this.client_id = params.client_id;
	}

	/**
	 * Inicia o processo de login com Google
	 * Nota: Este método usa APIs do navegador (window, localStorage)
	 * Para Node.js puro, você precisará de uma implementação diferente
	 */
	loginWithGoogle(): void {
		if (typeof window === 'undefined') {
			throw new Error('Este método requer ambiente de navegador');
		}

		// Salvar a URL atual do navegador no localStorage antes de redirecionar
		const currentUrl = window.location.href;
		localStorage.setItem('redirect_after_login', currentUrl);

		// Redirecionar o usuário para o Google OAuth
		const params = new URLSearchParams({
			client_id: this.client_id,
			redirect_uri: this.redirectUrl,
			response_type: 'code',
			scope: 'openid email profile'
		});
		const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
		window.location.href = authUrl;
	}

	/**
	 * Processa o callback do Google OAuth
	 * @returns Promise<boolean> - true se autenticação foi bem-sucedida
	 */
	async handleGoogleCallback(code: string): Promise<boolean> {
		if (typeof window === 'undefined') {
			throw new Error('Este método requer ambiente de navegador');
		}

		if (!code) {
			return false;
		}

		try {
			// Enviar POST com { code } para o endpoint usando URL relativa para o proxy
			const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				body: JSON.stringify({ code })
			});
			console.log(response)

			if (!response.ok) {
				throw new Error('Falha na autenticação Google');
			}

			// Backend retorna { token, userInfo: { email, name, picture } }
			const data: ApiAuthResponse = await response.json();

			// Salvar no localStorage
			if (data !== undefined) {
				localStorage.setItem('userInfo', JSON.stringify(data));
			}

			return true;
		} catch (error) {
			console.error('Erro ao processar callback do Google:', error);
			throw error;
		}
	}

	/**
	 * Retorna o token salvo
	 * @returns string | null
	 */
	getToken(): string | null {
		if (typeof localStorage === 'undefined') {
			return null;
		}

		try {
			const userInfo = localStorage.getItem('userInfo');
			if (userInfo) {
				return JSON.parse(userInfo).token;
			}
			return null;
		} catch (error) {
			console.error('Erro ao obter token:', error);
			return null;
		}
	}

	/**
	 * Retorna os dados do usuário salvos
	 * @returns any | null
	 */
	getUser(): UserInfo | null {
		if (typeof localStorage === 'undefined') {
			return null;
		}

		const userStr = localStorage.getItem('userInfo');
		if (userStr) {
			try {
				const data = JSON.parse(userStr);
				return data.user;
			} catch (error) {
				console.error('Erro ao parsear dados do usuário:', error);
				return null;
			}
		}
		return null;
	}

	/**
	 * Verifica se o usuário está autenticado
	 * @returns boolean
	 */
	isAuthenticated(): boolean {
		const token = this.getToken();
		return token !== null;
	}

	/**
	 * Remove token e dados do usuário (logout)
	 */
	logout(): void {
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('userInfo');
			localStorage.removeItem('redirect_after_login');
		}
	}

	/**
	 * Verifica e processa parâmetro AuthParam
	 * @returns any | null
	 */
	initCallbackUserInfo(): any | null {
		if (typeof window === 'undefined') {
			return null;
		}

		const urlParams = new URLSearchParams(window.location.search);
		const authParam = urlParams.get('AuthParam');

		if (authParam) {
			try {
				// Decodificar base64 com UTF-8
				const userInfoJsonDecoded = decodeURIComponent(escape(atob(authParam)));
				const userInfo = JSON.parse(userInfoJsonDecoded);

				// Salvar no localStorage
				localStorage.setItem('userInfo', JSON.stringify(userInfo));

				console.log('UserInfo salvo com sucesso:', userInfo);
				return userInfo;
			} catch (error) {
				console.error('Erro ao processar AuthParam:', error);
				return null;
			} finally {
				const newUrl = localStorage.getItem('redirect_after_login');
				localStorage.removeItem('redirect_after_login');
				if (newUrl) {
					window.location.href = newUrl;
				}
			}
		}

		return null;
	}
}

/**
 * Função de compatibilidade para obter informações do usuário do Google
 * @param backendUrl - URL do backend
 * @param code - Código de autorização do Google
 * @returns Promise<GoogleAuthResponse>
 */
export async function GoogleGetUserInfo(
	backendUrl: string,
	code: string
): Promise<ApiAuthResponse> {
	try {
		const response = await fetch(`${backendUrl}/auth/google`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ code })
		});

		if (!response.ok) {
			throw new Error('Falha na autenticação Google');
		}

		const userInfo: ApiAuthResponse = await response.json();
		return userInfo;
	} catch (error) {
		console.error('Erro ao obter informações do usuário:', error);
		throw error;
	}
}

// Export default da classe principal
export default AuthGoogleClass;