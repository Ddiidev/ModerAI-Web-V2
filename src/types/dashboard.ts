// Interfaces para o Dashboard ModerAI

// Interface para dados de créditos
export interface CreditData {
  balance: number; // Saldo em reais
  wordsRemaining: number; // Palavras restantes
  promotionActive: boolean; // Se a promoção está ativa
  promotionEndDate: string; // Data de fim da promoção
  promotionRate: number; // Taxa da promoção (palavras por real)
}

// Interface para métricas de processamento
export interface ProcessingMetrics {
  totalWordsProcessed: number;
  offensiveWordsDetected: number;
  nonOffensiveWords: number;
  falsePositives: number;
  processingHistory: ProcessingHistoryItem[];
}

// Interface para histórico de processamento
export interface ProcessingHistoryItem {
  date: string;
  wordsProcessed: number;
  accuracy: number;
}

// Interface para chaves de API
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  isActive: boolean;
}

// Interface para criação de nova chave
export interface CreateApiKeyRequest {
  name: string;
}

// Interface para resposta de criação de chave
export interface CreateApiKeyResponse {
  success: boolean;
  apiKey?: ApiKey;
  error?: string;
}

// Interface para mensagens do chat
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  evaluation?: 'correct' | 'incorrect' | null;
}

// Interface para histórico do chat
export interface ChatHistory {
  messages: ChatMessage[];
  lastUpdated: string;
}

// Interface para resposta da API de moderação
export interface ModerationResponse {
  isOffensive: boolean;
  confidence: number;
  response: string;
  categories: string[];
}

// Interface para estatísticas do dashboard
export interface DashboardStats {
  credits: CreditData;
  metrics: ProcessingMetrics;
  apiUsage: ApiUsageStats;
}

// Interface para estatísticas de uso da API
export interface ApiUsageStats {
  requestsToday: number;
  requestsThisMonth: number;
  averageResponseTime: number;
  successRate: number;
}

// Interface para configurações do usuário
export interface UserConfig {
  name: string;
  email: string;
  company: string;
  avatar: string;
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  dateFormat: string;
  twoFactorEnabled: boolean;
  notifications: {
    securityAlerts: boolean;
    weeklyReports: boolean;
    productUpdates: boolean;
    realTimeModeration: boolean;
    apiLimits: boolean;
  };
  plan: {
    name: string;
    price: number;
    features: string[];
    billingCycle: string;
  };
  paymentMethod: {
    type: string;
    last4: string;
    expiryDate: string;
  };
  billingHistory: {
    id: string;
    date: string;
    amount: number;
    status: string;
    description: string;
  }[];
  activeSessions: {
    id: string;
    device: string;
    location: string;
    lastActive: string;
    current: boolean;
  }[];
}

// Tipos para estados de loading
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Interface para estado de erro
export interface ErrorState {
  message: string;
  code?: string;
  details?: any;
}