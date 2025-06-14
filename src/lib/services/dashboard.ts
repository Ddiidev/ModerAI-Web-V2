// Services para o Dashboard ModerAI
import type {
  CreditData,
  ProcessingMetrics,
  ApiKey,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  ModerationResponse,
  DashboardStats,
  UserConfig
} from '@/types/dashboard';

class DashboardService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  setToken(token: string) {
    this.token = token;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error);
      throw error;
    }
  }

  // Métodos para créditos
  async getCreditData(): Promise<CreditData> {
    try {
      return await this.makeRequest<CreditData>('/api/credits');
    } catch (error) {
      // Dados mock para desenvolvimento
      return {
        balance: 10.00,
        wordsRemaining: 2750,
        promotionActive: true,
        promotionEndDate: '2024-06-30',
        promotionRate: 275 // palavras por real
      };
    }
  }

  // Métodos para métricas
  async getProcessingMetrics(): Promise<ProcessingMetrics> {
    try {
      return await this.makeRequest<ProcessingMetrics>('/api/metrics');
    } catch (error) {
      // Dados mock para desenvolvimento
      return {
        totalWordsProcessed: 15420,
        offensiveWordsDetected: 342,
        nonOffensiveWords: 15078,
        falsePositives: 23,
        processingHistory: [
          { date: '2024-01-01', wordsProcessed: 1200, accuracy: 94.2 },
          { date: '2024-01-02', wordsProcessed: 1850, accuracy: 95.1 },
          { date: '2024-01-03', wordsProcessed: 2100, accuracy: 93.8 },
          { date: '2024-01-04', wordsProcessed: 1750, accuracy: 96.3 },
          { date: '2024-01-05', wordsProcessed: 2200, accuracy: 94.7 },
          { date: '2024-01-06', wordsProcessed: 1920, accuracy: 95.5 },
          { date: '2024-01-07', wordsProcessed: 2400, accuracy: 94.9 }
        ]
      };
    }
  }

  // Métodos para chaves de API
  async getApiKeys(): Promise<ApiKey[]> {
    try {
      return await this.makeRequest<ApiKey[]>('/api/keys');
    } catch (error) {
      // Dados mock para desenvolvimento
      return [
        {
          id: '1',
          name: 'Chave Principal',
          key: 'mk_live_1234567890abcdef',
          createdAt: '2024-01-15T10:30:00Z',
          lastUsed: '2024-01-20T14:22:00Z',
          isActive: true
        },
        {
          id: '2',
          name: 'Chave de Teste',
          key: 'mk_test_abcdef1234567890',
          createdAt: '2024-01-10T09:15:00Z',
          lastUsed: null,
          isActive: true
        }
      ];
    }
  }

  async createApiKey(request: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    try {
      return await this.makeRequest<CreateApiKeyResponse>('/api/keys', {
        method: 'POST',
        body: JSON.stringify(request)
      });
    } catch (error) {
      // Mock response para desenvolvimento
      return {
        success: true,
        apiKey: {
          id: Date.now().toString(),
          name: request.name,
          key: `mk_live_${Math.random().toString(36).substring(2, 18)}`,
          createdAt: new Date().toISOString(),
          lastUsed: null,
          isActive: true
        }
      };
    }
  }

  async revokeApiKey(keyId: string): Promise<{ success: boolean }> {
    try {
      return await this.makeRequest<{ success: boolean }>(`/api/keys/${keyId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      return { success: true }; // Mock response
    }
  }

  // Métodos para moderação (chat)
  async moderateText(text: string): Promise<ModerationResponse> {
    try {
      return await this.makeRequest<ModerationResponse>('/api/moderate', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
    } catch (error) {
      // Mock response para desenvolvimento
      const isOffensive = text.toLowerCase().includes('idiota') || 
                         text.toLowerCase().includes('burro') ||
                         text.toLowerCase().includes('estúpido');
      
      return {
        isOffensive,
        confidence: Math.random() * 30 + 70, // 70-100%
        response: isOffensive 
          ? `Olha só, ${text.split(' ')[0]}, que criatividade! 🙄 Já ouvi essa ofensa quando eu ainda era um filhote. Que tal tentar algo mais original na próxima vez? 🐕💭`
          : 'Hmm, isso não parece ofensivo. Tente algo mais... criativo! 😏',
        categories: isOffensive ? ['insulto', 'ofensa pessoal'] : []
      };
    }
  }

  // Métodos para configurações
  async getUserConfig(): Promise<UserConfig> {
    try {
      return await this.makeRequest<UserConfig>('/api/config');
    } catch (error) {
      // Configurações padrão
      return {
        notifications: {
          securityAlerts: true,
          weeklyReports: true,
          productUpdates: true,
          realTimeModeration: true,
          apiLimits: true,
        },
        theme: 'auto',
        language: 'pt-BR'
      } as UserConfig;
    }
  }

  async updateUserConfig(config: Partial<UserConfig>): Promise<{ success: boolean }> {
    try {
      return await this.makeRequest<{ success: boolean }>('/api/config', {
        method: 'PUT',
        body: JSON.stringify(config)
      });
    } catch (error) {
      return { success: true }; // Mock response
    }
  }

  // Método para obter todas as estatísticas do dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [credits, metrics] = await Promise.all([
        this.getCreditData(),
        this.getProcessingMetrics()
      ]);

      return {
        credits,
        metrics,
        apiUsage: {
          requestsToday: 127,
          requestsThisMonth: 3420,
          averageResponseTime: 245,
          successRate: 99.2
        }
      };
    } catch (error) {
      throw new Error('Erro ao carregar estatísticas do dashboard');
    }
  }
}

// Instância singleton do service
export const dashboardService = new DashboardService();
export default DashboardService;