<template>
  <DashboardLayout>
    <div class="relative">
      <!-- Conteúdo original com blur -->
      <div class="space-y-8 filter blur-sm pointer-events-none">
      <!-- Header -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Configurações</h2>
        <p class="text-gray-600">
          Gerencie suas preferências pessoais, configurações de conta e preferências de notificação.
        </p>
      </div>

      <!-- Settings Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Settings Navigation -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Seções</h3>
            <nav class="space-y-2">
              <button
                v-for="section in settingSections"
                :key="section.id"
                @click="activeSection = section.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3',
                  activeSection === section.id
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                <component :is="section.icon" class="w-5 h-5" />
                <span class="font-medium">{{ section.name }}</span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Settings Content -->
        <div class="lg:col-span-2">
          <!-- Profile Settings -->
          <div v-if="activeSection === 'profile'" class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-800">Perfil</h3>
              <button
                @click="saveProfile"
                :disabled="isSaving"
                class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
              >
                {{ isSaving ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>

            <form @submit.prevent="saveProfile" class="space-y-6">
              <!-- Avatar -->
              <div class="flex items-center space-x-6">
                <div class="relative">
                  <img
                    :src="userConfig.avatar || '/default-avatar.png'"
                    :alt="userConfig.name"
                    class="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                  />
                  <button
                    type="button"
                    class="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"
                  >
                    <Camera class="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 class="text-lg font-medium text-gray-800">{{ userConfig.name }}</h4>
                  <p class="text-sm text-gray-600">{{ userConfig.email }}</p>
                  <button
                    type="button"
                    class="text-sm text-emerald-600 hover:text-emerald-700 mt-1"
                  >
                    Alterar foto
                  </button>
                </div>
              </div>

              <!-- Basic Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    v-model="userConfig.name"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    v-model="userConfig.email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    v-model="userConfig.company"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Fuso Horário
                  </label>
                  <select
                    v-model="userConfig.timezone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                    <option value="America/New_York">Nova York (GMT-5)</option>
                    <option value="Europe/London">Londres (GMT+0)</option>
                    <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          <!-- Notifications Settings -->
          <div v-if="activeSection === 'notifications'" class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-800">Notificações</h3>
              <button
                @click="saveNotifications"
                :disabled="isSaving"
                class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
              >
                {{ isSaving ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>

            <div class="space-y-6">
              <!-- Email Notifications -->
              <div>
                <h4 class="text-lg font-medium text-gray-800 mb-4">Notificações por Email</h4>
                <div class="space-y-4">
                  <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div class="font-medium text-gray-800">Alertas de Segurança</div>
                      <div class="text-sm text-gray-600">Notificações sobre atividades suspeitas</div>
                    </div>
                    <input
                      v-model="userConfig.notifications.securityAlerts"
                      type="checkbox"
                      class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </label>
                  
                  <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div class="font-medium text-gray-800">Relatórios Semanais</div>
                      <div class="text-sm text-gray-600">Resumo semanal de atividades</div>
                    </div>
                    <input
                      v-model="userConfig.notifications.weeklyReports"
                      type="checkbox"
                      class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </label>
                  
                  <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div class="font-medium text-gray-800">Atualizações de Produto</div>
                      <div class="text-sm text-gray-600">Novidades e melhorias da plataforma</div>
                    </div>
                    <input
                      v-model="userConfig.notifications.productUpdates"
                      type="checkbox"
                      class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </label>
                </div>
              </div>

              <!-- Push Notifications -->
              <div>
                <h4 class="text-lg font-medium text-gray-800 mb-4">Notificações Push</h4>
                <div class="space-y-4">
                  <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div class="font-medium text-gray-800">Moderação em Tempo Real</div>
                      <div class="text-sm text-gray-600">Alertas instantâneos sobre conteúdo moderado</div>
                    </div>
                    <input
                      v-model="userConfig.notifications.realTimeModeration"
                      type="checkbox"
                      class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </label>
                  
                  <label class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div class="font-medium text-gray-800">Limites de API</div>
                      <div class="text-sm text-gray-600">Avisos quando próximo aos limites</div>
                    </div>
                    <input
                      v-model="userConfig.notifications.apiLimits"
                      type="checkbox"
                      class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div v-if="activeSection === 'security'" class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">Segurança</h3>

            <div class="space-y-6">
              <!-- Password Change -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="text-lg font-medium text-gray-800 mb-4">Alterar Senha</h4>
                <form @submit.prevent="changePassword" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Senha Atual
                    </label>
                    <input
                      v-model="passwordForm.currentPassword"
                      type="password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Nova Senha
                      </label>
                      <input
                        v-model="passwordForm.newPassword"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nova Senha
                      </label>
                      <input
                        v-model="passwordForm.confirmPassword"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    Alterar Senha
                  </button>
                </form>
              </div>

              <!-- Two-Factor Authentication -->
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h4 class="text-lg font-medium text-gray-800">Autenticação de Dois Fatores</h4>
                    <p class="text-sm text-gray-600">Adicione uma camada extra de segurança à sua conta</p>
                  </div>
                  <button
                    @click="toggle2FA"
                    :class="[
                      'px-4 py-2 rounded-lg transition-colors',
                      userConfig.twoFactorEnabled
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    ]"
                  >
                    {{ userConfig.twoFactorEnabled ? 'Desativar' : 'Ativar' }}
                  </button>
                </div>
                
                <div v-if="userConfig.twoFactorEnabled" class="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div class="flex items-center space-x-2">
                    <CheckCircle class="w-5 h-5 text-green-600" />
                    <span class="text-sm font-medium text-green-800">2FA está ativo</span>
                  </div>
                  <p class="text-sm text-green-700 mt-1">Sua conta está protegida com autenticação de dois fatores</p>
                </div>
              </div>

              <!-- Active Sessions -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="text-lg font-medium text-gray-800 mb-4">Sessões Ativas</h4>
                <div class="space-y-3">
                  <div
                    v-for="session in activeSessions"
                    :key="session.id"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <Monitor class="w-5 h-5 text-gray-600" />
                      <div>
                        <div class="font-medium text-gray-800">{{ session.device }}</div>
                        <div class="text-sm text-gray-600">{{ session.location }} • {{ session.lastActive }}</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span
                        v-if="session.current"
                        class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        Atual
                      </span>
                      <button
                        v-else
                        @click="revokeSession(session.id)"
                        class="text-red-600 hover:text-red-700 text-sm"
                      >
                        Revogar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Billing Settings -->
          <div v-if="activeSection === 'billing'" class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
            <h3 class="text-xl font-semibold text-gray-800 mb-6">Faturamento</h3>

            <div class="space-y-6">
              <!-- Current Plan -->
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-medium text-gray-800">Plano Atual</h4>
                  <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {{ userConfig.plan.name }}
                  </span>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div class="text-center p-3 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-gray-800">10.000</div>
                    <div class="text-sm text-gray-600">Requisições/mês</div>
                  </div>
                  
                  <div class="text-center p-3 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-gray-800">R$ {{ userConfig.plan.price.toFixed(2) }}</div>
                    <div class="text-sm text-gray-600">Por mês</div>
                  </div>
                  
                  <div class="text-center p-3 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-gray-800">Email</div>
                    <div class="text-sm text-gray-600">Suporte</div>
                  </div>
                </div>
                
                <button class="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                  Gerenciar Plano
                </button>
              </div>

              <!-- Payment Method -->
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-medium text-gray-800">Método de Pagamento</h4>
                  <button class="text-emerald-600 hover:text-emerald-700 text-sm">
                    Alterar
                  </button>
                </div>
                
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CreditCard class="w-8 h-8 text-gray-600" />
                  <div>
                    <div class="font-medium text-gray-800">•••• •••• •••• 4242</div>
                    <div class="text-sm text-gray-600">Expira em 12/2025</div>
                  </div>
                </div>
              </div>

              <!-- Billing History -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h4 class="text-lg font-medium text-gray-800 mb-4">Histórico de Faturamento</h4>
                <div class="space-y-3">
                  <div
                    v-for="invoice in billingHistory"
                    :key="invoice.id"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div class="font-medium text-gray-800">{{ invoice.description }}</div>
                      <div class="text-sm text-gray-600">{{ invoice.date }}</div>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="font-medium text-gray-800">R$ {{ invoice.amount.toFixed(2) }}</span>
                      <button class="text-emerald-600 hover:text-emerald-700 text-sm">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Preferences Settings -->
          <div v-if="activeSection === 'preferences'" class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-800">Preferências</h3>
              <button
                @click="savePreferences"
                :disabled="isSaving"
                class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
              >
                {{ isSaving ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>

            <div class="space-y-6">
              <!-- Theme -->
              <div>
                <h4 class="text-lg font-medium text-gray-800 mb-4">Aparência</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label
                    v-for="theme in themes"
                    :key="theme.id"
                    class="relative cursor-pointer"
                  >
                    <input
                      v-model="userConfig.theme"
                      type="radio"
                      :value="theme.id"
                      class="sr-only"
                    />
                    <div
                      :class="[
                        'border-2 rounded-lg p-4 transition-colors',
                        userConfig.theme === theme.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      ]"
                    >
                      <div class="flex items-center space-x-3 mb-2">
                        <component :is="theme.icon" class="w-5 h-5" />
                        <span class="font-medium text-gray-800">{{ theme.name }}</span>
                      </div>
                      <p class="text-sm text-gray-600">{{ theme.description }}</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Language -->
              <div>
                <h4 class="text-lg font-medium text-gray-800 mb-4">Idioma</h4>
                <select
                  v-model="userConfig.language"
                  class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>

              <!-- Date Format -->
              <div>
                <h4 class="text-lg font-medium text-gray-800 mb-4">Formato de Data</h4>
                <select
                  v-model="userConfig.dateFormat"
                  class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      <!-- Overlay "Em Construção" -->
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-emerald-200/50 text-center max-w-md mx-4">
          <div class="mb-4">
            <div class="w-16 h-16 mx-auto bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Em Construção</h2>
          <p class="text-gray-600 mb-4">Esta funcionalidade está sendo desenvolvida e estará disponível em breve.</p>
          <div class="flex items-center justify-center space-x-2 text-emerald-600">
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardLayout from '@/components/DashboardLayout.vue';
import { dashboardService } from '@/lib/services/dashboard';
import { useAuthStore } from '@/stores/auth';
import type { UserConfig } from '@/types/dashboard';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Settings,
  Camera,
  CheckCircle,
  Monitor,
  Sun,
  Moon,
  Laptop
} from 'lucide-vue-next';

const authStore = useAuthStore();

// Data
const activeSection = ref('profile');
const isSaving = ref(false);

const settingSections = [
  { id: 'profile', name: 'Perfil', icon: User },
  { id: 'notifications', name: 'Notificações', icon: Bell },
  { id: 'security', name: 'Segurança', icon: Shield },
  { id: 'billing', name: 'Faturamento', icon: CreditCard },
  { id: 'preferences', name: 'Preferências', icon: Settings }
];

const themes = [
  {
    id: 'light',
    name: 'Claro',
    description: 'Tema claro padrão',
    icon: Sun
  },
  {
    id: 'dark',
    name: 'Escuro',
    description: 'Tema escuro para ambientes com pouca luz',
    icon: Moon
  },
  {
    id: 'system',
    name: 'Sistema',
    description: 'Segue a preferência do sistema',
    icon: Laptop
  }
];

const userConfig = ref<UserConfig>({
  name: '',
  email: '',
  company: '',
  avatar: '',
  timezone: 'America/Sao_Paulo',
  language: 'pt-BR',
  theme: 'light',
  dateFormat: 'DD/MM/YYYY',
  twoFactorEnabled: false,
  notifications: {
    securityAlerts: true,
    weeklyReports: true,
    productUpdates: false,
    realTimeModeration: true,
    apiLimits: true
  },
  plan: {
    name: 'Starter',
    price: 29.90,
    features: ['10.000 requisições/mês', 'Suporte por email', 'Dashboard básico'],
    billingCycle: 'monthly'
  },
  paymentMethod: {
    type: '',
    last4: '',
    expiryDate: ''
  },
  billingHistory: [],
  activeSessions: []
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const activeSessions = ref([
  {
    id: '1',
    device: 'Chrome no Windows',
    location: 'São Paulo, Brasil',
    lastActive: 'Agora',
    current: true
  },
  {
    id: '2',
    device: 'Safari no iPhone',
    location: 'São Paulo, Brasil',
    lastActive: '2 horas atrás',
    current: false
  }
]);

const billingHistory = ref([
  {
    id: '1',
    description: 'Plano Starter - Janeiro 2024',
    date: '01/01/2024',
    amount: 29.90
  },
  {
    id: '2',
    description: 'Plano Starter - Dezembro 2023',
    date: '01/12/2023',
    amount: 29.90
  }
]);

// Methods
const saveProfile = async () => {
  if (isSaving.value) return;
  
  isSaving.value = true;
  
  try {
    if (authStore.token) {
      dashboardService.setToken(authStore.token);
    }
    
    await dashboardService.updateUserConfig(userConfig.value);
    
    // TODO: Show success notification
    console.log('Perfil salvo com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
  } finally {
    isSaving.value = false;
  }
};

const saveNotifications = async () => {
  if (isSaving.value) return;
  
  isSaving.value = true;
  
  try {
    if (authStore.token) {
      dashboardService.setToken(authStore.token);
    }
    
    await dashboardService.updateUserConfig(userConfig.value);
    
    // TODO: Show success notification
    console.log('Configurações de notificação salvas!');
  } catch (error) {
    console.error('Erro ao salvar notificações:', error);
  } finally {
    isSaving.value = false;
  }
};

const savePreferences = async () => {
  if (isSaving.value) return;
  
  isSaving.value = true;
  
  try {
    if (authStore.token) {
      dashboardService.setToken(authStore.token);
    }
    
    await dashboardService.updateUserConfig(userConfig.value);
    
    // TODO: Show success notification
    console.log('Preferências salvas!');
  } catch (error) {
    console.error('Erro ao salvar preferências:', error);
  } finally {
    isSaving.value = false;
  }
};

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('As senhas não coincidem!');
    return;
  }
  
  try {
    // TODO: Implement password change
    console.log('Alterando senha...');
    
    // Reset form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    // TODO: Show success notification
    alert('Senha alterada com sucesso!');
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
  }
};

const toggle2FA = async () => {
  try {
    userConfig.value.twoFactorEnabled = !userConfig.value.twoFactorEnabled;
    
    // TODO: Implement 2FA toggle
    console.log('2FA toggled:', userConfig.value.twoFactorEnabled);
  } catch (error) {
    console.error('Erro ao alterar 2FA:', error);
  }
};

const revokeSession = async (sessionId: string) => {
  if (!confirm('Tem certeza que deseja revogar esta sessão?')) {
    return;
  }
  
  try {
    activeSessions.value = activeSessions.value.filter(s => s.id !== sessionId);
    
    // TODO: Call API to revoke session
    console.log('Sessão revogada:', sessionId);
  } catch (error) {
    console.error('Erro ao revogar sessão:', error);
  }
};

const loadUserConfig = async () => {
  try {
    if (authStore.token) {
      dashboardService.setToken(authStore.token);
    }
    
    // TODO: Load user config from API
    // For now, using mock data
    userConfig.value = {
      name: authStore.currentUser?.name || 'Usuário',
      email: authStore.currentUser?.email || 'usuario@exemplo.com',
      company: 'Minha Empresa',
      avatar: authStore.currentUser?.picture || '',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      theme: 'light',
      dateFormat: 'DD/MM/YYYY',
      twoFactorEnabled: false,
      notifications: {
        securityAlerts: true,
        weeklyReports: true,
        productUpdates: false,
        realTimeModeration: true,
        apiLimits: true
      },
      plan: {
        name: 'Starter',
        price: 29.90,
        features: ['10.000 requisições/mês', 'Suporte por email', 'Dashboard básico'],
        billingCycle: 'monthly'
      },
      paymentMethod: {
        type: 'Cartão de Crédito',
        last4: '****',
        expiryDate: '--/--'
      },
      billingHistory: [],
      activeSessions: []
    };
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
  }
};

// Initialize
onMounted(() => {
  loadUserConfig();
});
</script>