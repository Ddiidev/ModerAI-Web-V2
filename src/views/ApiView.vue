<template>
  <DashboardLayout>
    <div class="space-y-8">
      <!-- Header -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Gerenciamento de API</h2>
        <p class="text-gray-600">
          Gerencie suas chaves de API, monitore o uso e acesse a documentação completa.
        </p>
      </div>

      <!-- API Usage Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Requisições Hoje</h3>
            <BarChart3 class="w-8 h-8 text-blue-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-blue-700">{{ apiStats.requestsToday.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Requisições processadas hoje</p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Limite Mensal</h3>
            <Gauge class="w-8 h-8 text-purple-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-purple-700">{{ apiStats.requestsThisMonth.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Requisições este mês</p>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full bg-purple-600 transition-all duration-300"
                style="width: 65%"
              ></div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Tempo Médio</h3>
            <Clock class="w-8 h-8 text-green-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-green-700">{{ apiStats.averageResponseTime }}ms</p>
            <p class="text-sm text-gray-600">Tempo de resposta</p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Taxa de Sucesso</h3>
            <CheckCircle class="w-8 h-8 text-emerald-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-emerald-700">{{ apiStats.successRate }}%</p>
            <p class="text-sm text-gray-600">Requisições bem-sucedidas</p>
          </div>
        </div>
      </div>

      <!-- API Keys Management -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Chaves de API</h3>
          <button
            @click="showCreateKeyModal = true"
            class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus class="w-4 h-4" />
            <span>Nova Chave</span>
          </button>
        </div>

        <div v-if="apiKeys.length === 0" class="text-center py-12">
          <Key class="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p class="text-lg font-medium text-gray-500 mb-2">Nenhuma chave de API criada</p>
          <p class="text-sm text-gray-400 mb-4">Crie sua primeira chave para começar a usar a API</p>
          <button
            @click="showCreateKeyModal = true"
            class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Criar Primeira Chave
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="apiKey in apiKeys"
            :key="apiKey.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h4 class="text-lg font-medium text-gray-800">{{ apiKey.name }}</h4>
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      apiKey.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    ]"
                  >
                    {{ apiKey.isActive ? 'Ativa' : 'Inativa' }}
                  </span>
                </div>
                <div class="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Criada em {{ formatDate(apiKey.createdAt) }}</span>
                  <span v-if="apiKey.lastUsed">
                    Último uso: {{ formatDate(apiKey.lastUsed) }}
                  </span>
                  <span v-else class="text-gray-400">Nunca usada</span>
                </div>
                <div class="mt-3 flex items-center space-x-2">
                  <code class="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                    {{ showKey[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key) }}
                  </code>
                  <button
                    @click="toggleKeyVisibility(apiKey.id)"
                    class="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    :title="showKey[apiKey.id] ? 'Ocultar chave' : 'Mostrar chave'"
                  >
                    <Eye v-if="!showKey[apiKey.id]" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                  <button
                    @click="copyApiKey(apiKey.key)"
                    class="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copiar chave"
                  >
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="toggleKeyStatus(apiKey.id)"
                  :class="[
                    'px-3 py-1 text-sm rounded transition-colors',
                    apiKey.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  ]"
                >
                  {{ apiKey.isActive ? 'Desativar' : 'Ativar' }}
                </button>
                <button
                  @click="deleteApiKey(apiKey.id)"
                  class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Excluir chave"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- API Documentation -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Documentação da API</h3>
          <a
            href="#"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            target="_blank"
          >
            <ExternalLink class="w-4 h-4" />
            <span>Documentação Completa</span>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Quick Start -->
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-gray-800">Início Rápido</h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <h5 class="font-medium text-gray-700 mb-2">1. Autenticação</h5>
              <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto"><code>curl -X POST https://api.moderai.com/v1/moderate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Texto para moderar"}'</code></pre>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <h5 class="font-medium text-gray-700 mb-2">2. Resposta da API</h5>
              <pre class="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto"><code>{
  "isOffensive": false,
  "confidence": 85,
  "categories": [],
  "suggestedAction": "approve"
}</code></pre>
            </div>
          </div>

          <!-- Endpoints -->
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-gray-800">Endpoints Principais</h4>
            <div class="space-y-3">
              <div class="border border-gray-200 rounded-lg p-3">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="bg-green-100 text-green-700 px-2 py-1 text-xs rounded font-mono">POST</span>
                  <code class="text-sm">/v1/moderate</code>
                </div>
                <p class="text-sm text-gray-600">Moderar texto simples</p>
              </div>
              
              <div class="border border-gray-200 rounded-lg p-3">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded font-mono">POST</span>
                  <code class="text-sm">/v1/moderate/batch</code>
                </div>
                <p class="text-sm text-gray-600">Moderar múltiplos textos</p>
              </div>
              
              <div class="border border-gray-200 rounded-lg p-3">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="bg-yellow-100 text-yellow-700 px-2 py-1 text-xs rounded font-mono">GET</span>
                  <code class="text-sm">/v1/usage</code>
                </div>
                <p class="text-sm text-gray-600">Consultar uso da API</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create API Key Modal -->
    <div
      v-if="showCreateKeyModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showCreateKeyModal = false"
    >
      <div
        class="bg-white rounded-xl p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Nova Chave de API</h3>
          <button
            @click="showCreateKeyModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <form @submit.prevent="createApiKey" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nome da Chave
            </label>
            <input
              v-model="newKeyName"
              type="text"
              placeholder="Ex: Produção, Desenvolvimento, Teste"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showCreateKeyModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isCreatingKey"
              class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              {{ isCreatingKey ? 'Criando...' : 'Criar Chave' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardLayout from '@/components/DashboardLayout.vue';
import { dashboardService } from '@/lib/services/dashboard';
import { useAuthStore } from '@/stores/auth';
import type { ApiKey, ApiUsageStats } from '@/types/dashboard';
import {
  BarChart3,
  Gauge,
  Clock,
  CheckCircle,
  Plus,
  Key,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ExternalLink,
  X
} from 'lucide-vue-next';

const authStore = useAuthStore();

// Data
const apiKeys = ref<ApiKey[]>([]);
const apiStats = ref<ApiUsageStats>({
  requestsToday: 0,
  requestsThisMonth: 0,
  averageResponseTime: 0,
  successRate: 0
});

const showKey = ref<Record<string, boolean>>({});
const showCreateKeyModal = ref(false);
const newKeyName = ref('');
const isCreatingKey = ref(false);

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const maskApiKey = (key: string) => {
  if (key.length <= 8) return key;
  return key.substring(0, 8) + '•'.repeat(key.length - 12) + key.substring(key.length - 4);
};

const toggleKeyVisibility = (keyId: string) => {
  showKey.value[keyId] = !showKey.value[keyId];
};

const copyApiKey = async (key: string) => {
  try {
    await navigator.clipboard.writeText(key);
    // TODO: Show success notification
    console.log('Chave copiada!');
  } catch (error) {
    console.error('Erro ao copiar chave:', error);
  }
};

const createApiKey = async () => {
  if (!newKeyName.value.trim() || isCreatingKey.value) return;
  
  isCreatingKey.value = true;
  
  try {
    if (authStore.token) {
      dashboardService.setToken(authStore.token);
    }
    
    const response = await dashboardService.createApiKey({ name: newKeyName.value.trim() });
    if (response.success && response.apiKey) {
      apiKeys.value.push(response.apiKey);
    }
    
    newKeyName.value = '';
    showCreateKeyModal.value = false;
    
    // TODO: Show success notification
    console.log('Chave criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar chave:', error);
    // TODO: Show error notification
  } finally {
    isCreatingKey.value = false;
  }
};

const toggleKeyStatus = async (keyId: string) => {
  try {
    if (authStore.token) {
      dashboardService.setToken(authStore.token);
    }
    
    const keyIndex = apiKeys.value.findIndex(k => k.id === keyId);
    if (keyIndex !== -1) {
      const currentStatus = apiKeys.value[keyIndex].isActive;
      // TODO: Implementar updateApiKey no DashboardService
      console.log('Alterando status da chave:', keyId, !currentStatus);
      apiKeys.value[keyIndex].isActive = !currentStatus;
    }
  } catch (error) {
    console.error('Erro ao alterar status da chave:', error);
  }
};

const deleteApiKey = async (keyId: string) => {
  if (!confirm('Tem certeza que deseja excluir esta chave? Esta ação não pode ser desfeita.')) {
    return;
  }
  
  try {
    if (authStore.token) {
      dashboardService.setToken(authStore.token);
    }
    
    await dashboardService.revokeApiKey(keyId);
    apiKeys.value = apiKeys.value.filter(k => k.id !== keyId);
    
    // TODO: Show success notification
    console.log('Chave excluída com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir chave:', error);
  }
};

const loadApiData = async () => {
  try {
    if (authStore.token) {
      dashboardService.setToken(authStore.token);
    }
    
    const [keys, stats] = await Promise.all([
      dashboardService.getApiKeys(),
      Promise.resolve({
        requestsToday: 127,
        requestsThisMonth: 3420,
        averageResponseTime: 245,
        successRate: 99.2
      })
    ]);
    
    apiKeys.value = keys;
    apiStats.value = stats;
  } catch (error) {
    console.error('Erro ao carregar dados da API:', error);
  }
};

// Initialize
onMounted(() => {
  loadApiData();
});
</script>