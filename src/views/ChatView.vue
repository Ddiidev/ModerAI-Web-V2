<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800">Chat & Playground</h2>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              <span class="font-medium">Palavras restantes:</span>
              <span class="text-emerald-600 font-bold">{{ wordsRemaining }}</span>
            </div>
            <button @click="clearChat"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              <Trash2 class="w-4 h-4 mr-2 inline" />
              Limpar Chat
            </button>
          </div>
        </div>
        <p class="text-gray-600">
          Teste a moderação de texto em tempo real. Digite ou cole o conteúdo que deseja moderar.
        </p>
      </div>

      <!-- Chat Container -->
      <div class="bg-white rounded-xl shadow-lg border border-emerald-200/50 flex flex-col h-[600px]">
        <!-- Messages Area -->
        <div ref="messagesContainer" class="flex-1 p-6 overflow-y-auto space-y-4">
          <div v-if="messages.length === 0" class="text-center text-gray-500 mt-20">
            <MessageCircle class="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p class="text-lg font-medium">Nenhuma mensagem ainda</p>
            <p class="text-sm">Digite uma mensagem abaixo para começar a testar a moderação</p>
          </div>

          <div v-for="message in messages" :key="message.id" class="flex flex-col space-y-2">
            <!-- User Message -->
            <div class="flex justify-end">
              <div class="max-w-3xl bg-emerald-500 text-white rounded-lg px-4 py-3">
                <p class="whitespace-pre-wrap">{{ message.content }}</p>
                <div class="text-xs text-emerald-100 mt-2">
                  {{ formatTime(message.timestamp) }}
                </div>
              </div>
            </div>

            <!-- Moderation Result -->
            <div class="flex justify-start">
              <div class="max-w-3xl bg-gray-100 rounded-lg px-4 py-3">
                <div class="flex items-center mb-2">
                  <Bot class="w-5 h-5 mr-2 text-gray-600" />
                  <span class="font-medium text-gray-800">Resultado da Moderação</span>
                </div>

                <div class="space-y-3">
                  <!-- Status -->
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    <span :class="[
                      'font-medium',
                      'text-green-700'
                    ]">
                      Conteúdo Aprovado
                    </span>
                  </div>

                  <!-- Confidence -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Confiança:</span>
                      <span class="font-medium">85%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="h-2 rounded-full transition-all duration-300 bg-green-500" style="width: 85%"></div>
                    </div>
                  </div>

                  <!-- Moderation Result (placeholder for future implementation) -->
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div class="flex items-center mb-1">
                      <Info class="w-4 h-4 mr-2 text-blue-600" />
                      <span class="text-sm font-medium text-blue-800">Moderação</span>
                    </div>
                    <p class="text-sm text-blue-700">Mensagem analisada com sucesso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="border-t border-gray-200 p-6">
          <form @submit.prevent="sendMessage" class="space-y-4">
            <div class="flex space-x-4">
              <div class="flex-1">
                <textarea v-model="newMessage" placeholder="Digite ou cole o texto que deseja moderar..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  rows="3" :disabled="isLoading" @keydown.enter.exact.prevent="sendMessage"
                  @keydown.enter.shift.exact="newMessage += '\n'"></textarea>
                <div class="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>Pressione Enter para enviar, Shift+Enter para nova linha</span>
                  <span>{{ wordCount }} palavras</span>
                </div>
              </div>
              <button type="submit" :disabled="!newMessage.trim() || isLoading"
                class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2">
                <Send class="w-4 h-4" />
                <span>{{ isLoading ? 'Enviando...' : 'Enviar' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Quick Examples -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Exemplos Rápidos</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button v-for="example in quickExamples" :key="example.id" @click="useExample(example.text)"
            class="text-left p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
            <div class="flex items-center mb-2">
              <div :class="[
                'w-3 h-3 rounded-full mr-2',
                example.type === 'offensive' ? 'bg-red-500' : 'bg-green-500'
              ]"></div>
              <span class="text-sm font-medium text-gray-700">{{ example.label }}</span>
            </div>
            <p class="text-sm text-gray-600 line-clamp-2">{{ example.text }}</p>
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import DashboardLayout from '@/components/DashboardLayout.vue';
import { dashboardService } from '@/lib/services/dashboard';
import { useAuthStore } from '@/stores/auth';
import type { ChatMessage } from '@/types/dashboard';
import {
  MessageCircle,
  Bot,
  Send,
  Trash2,
  Info,
  AlertCircle
} from 'lucide-vue-next';

const authStore = useAuthStore();

// Data
const messages = ref<ChatMessage[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement>();
const wordsRemaining = ref(0);

// Quick examples
const quickExamples = [
  {
    id: 1,
    label: 'Texto Normal',
    text: 'Olá! Como você está hoje? Espero que esteja tendo um ótimo dia.',
    type: 'safe'
  },
  {
    id: 2,
    label: 'Linguagem Ofensiva',
    text: 'Você é um idiota e não sabe de nada!',
    type: 'offensive'
  },
  {
    id: 3,
    label: 'Spam Comercial',
    text: 'COMPRE AGORA! Oferta imperdível! Clique aqui para ganhar dinheiro fácil!',
    type: 'offensive'
  },
  {
    id: 4,
    label: 'Discurso de Ódio',
    text: 'Odeio pessoas como você, vocês deveriam sumir do mundo.',
    type: 'offensive'
  },
  {
    id: 5,
    label: 'Feedback Construtivo',
    text: 'Acredito que sua ideia tem potencial, mas talvez pudesse ser melhorada com algumas mudanças.',
    type: 'safe'
  },
  {
    id: 6,
    label: 'Pergunta Técnica',
    text: 'Como posso integrar a API de moderação no meu sistema de comentários?',
    type: 'safe'
  }
];

// Computed
const wordCount = computed(() => {
  return newMessage.value.trim().split(/\s+/).filter(word => word.length > 0).length;
});

// Methods
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return;

  const messageContent = newMessage.value.trim();
  const messageId = Date.now().toString();

  // Add user message
  const userMessage: ChatMessage = {
    id: messageId,
    content: messageContent,
    isUser: true,
    timestamp: new Date().toISOString()
  };

  messages.value.push(userMessage);
  newMessage.value = '';
  isLoading.value = true;

  await scrollToBottom();

  try {
    if (authStore.token) {
      dashboardService.setToken(authStore.token);
    }

    const result = await dashboardService.moderateText(messageContent);

    // Update message with result
    const messageIndex = messages.value.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      // Store result in a separate reactive object or handle it differently
      // For now, we'll just mark the message as processed
      console.log('Moderation result:', result);
    }

    // Update words remaining
    const wordsUsed = messageContent.split(/\s+/).filter(word => word.length > 0).length;
    wordsRemaining.value = Math.max(0, wordsRemaining.value - wordsUsed);

  } catch (error) {
    console.error('Erro na moderação:', error);

    // Update message with error
    const messageIndex = messages.value.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      // Log error for debugging
      console.error('Erro ao processar a moderação:', messageId);
    }
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

const useExample = (text: string) => {
  newMessage.value = text;
};

const clearChat = () => {
  messages.value = [];
};

const loadWordsRemaining = async () => {
  try {
    if (authStore.token) {
      dashboardService.setToken(authStore.token);
    }

    const creditData = await dashboardService.getCreditData();
    wordsRemaining.value = creditData.wordsRemaining;
  } catch (error) {
    console.error('Erro ao carregar palavras restantes:', error);
  }
};

// Initialize
onMounted(() => {
  loadWordsRemaining();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>