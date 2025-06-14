<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Button from './Button.vue';
import { useAuthStore } from '../stores/auth';
import { Check } from 'lucide-vue-next';

// Interface para os planos
interface Plan {
  id: string;
  name: string;
  icon: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  whatsappMessages?: string;
  excedenteCost?: string;
  excedentExample?: string;
  callToAction: string;
}

// Estado
const authStore = useAuthStore();
const isVisible = ref(false);
const showAllExcedentes = ref(false);

// Lista de planos
const plans: Plan[] = [
  {
    id: 'inicial',
    name: 'Inicial',
    icon: '🌱',
    price: 'R$ 34,90',
    period: '/mês',
    description: 'Para quem quer começar com moderação de qualidade! Longe de qualquer toxicidade.',
    features: [
      '750 mil palavras',
      'Suporte por e-mail',
      'Moderação com contexto de gírias e memes',
      'Ideal para bots, MVPs ou micro-SaaS'
    ],
    whatsappMessages: '93,7 mil',
    excedenteCost: 'R$ 0,000465',
    excedentExample: '10 mil palavras extras custam apenas R$ 4,65',
    callToAction: 'Comece simples, sem complicação'
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: '🚀',
    price: 'R$ 164,90',
    period: '/mês',
    description: 'Para quem já tem tração e não pode correr risco de informações tóxicas',
    features: [
      '5 milhões de palavras/mês',
      'Prioridade no suporte',
      'Ajustes finos no tom da moderação (agressivo, neutro, leve)',
      'Pronto para SaaS em crescimento e marketplaces'
    ],
    whatsappMessages: '647 mil',
    excedenteCost: 'R$ 0,000330',
    excedentExample: '10 mil palavras extras custam apenas R$ 3,30',
    callToAction: 'Escale com confiança, do jeito BR',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: '🏢',
    price: 'Sob medida',
    period: '',
    description: 'Grandes volumes? Casos complexos?',
    features: [
      'Volume personalizado',
      'Prioridade no suporte',
      'Ajustes finos no tom da moderação (agressivo, neutro, leve)',
      'Suporte prioritário na implantação do serviço ao seu negócio'
    ],
    excedenteCost: 'R$ 0,000200',
    callToAction: 'Criamos juntos o plano ideal'
  }
];

// Tabela de comparação de valores
const pricingTable = [
  {
    words: '750.000',
    whatsapp: '~93.750 mensagens',
    readingTime: '~83,4 horas (equivalente a 3 dias mandando msg initerruptamente.)'
  },
  {
    words: '5.000.000',
    whatsapp: '~647.000 mensagens',
    readingTime: '~731,3 horas (equivalente a 30 dias lendo mensagem do whatsapp sem parar.)'
  }
];

// Função para iniciar o processo de inscrição
const startSubscription = (planId: string) => {
  if (!authStore.isAuthenticated) {
    authStore.loginWithGoogle();
    return;
  }

  // Lógica para iniciar a assinatura do plano selecionado
  console.log(`Iniciando assinatura do plano ${planId}`);
  // Aqui seria implementada a integração com o sistema de pagamentos
};

// Iniciar animação quando o componente for visível
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.1 });

  const pricingSection = document.getElementById('pricing-section');
  if (pricingSection) {
    observer.observe(pricingSection);
  }
});
</script>

<template>
  <section id="pricing-section" class="py-12 md:py-16 relative">
    <!-- Fundo com gradiente verde-amarelo -->
    <div class="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 z-0"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-green-900/5 via-transparent to-yellow-400/5 z-0"></div>

    <!-- Círculos decorativos com blur -->
    <div
      class="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-green-400/10 to-emerald-500/10 rounded-full filter blur-3xl animate-pulse"
      style="animation-delay: 1s;"></div>
    <div
      class="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-l from-yellow-400/12 to-amber-500/12 rounded-full filter blur-3xl animate-pulse"
      style="animation-delay: 3s;"></div>

    <!-- Elementos geométricos decorativos -->
    <div class="absolute top-1/3 left-1/4 w-20 h-20 border border-green-400/20 rounded-full animate-spin"
      style="animation-duration: 20s;"></div>
    <div class="absolute bottom-1/4 right-1/3 w-16 h-16 border border-yellow-400/20 rounded-lg rotate-45 animate-bounce"
      style="animation-duration: 4s;"></div>

    <div class="container mx-auto px-6 relative z-10">
      <!-- Cabeçalho da seção -->
      <div class="text-center mb-12" :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
        style="transition: all 1s ease-out;">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Nossos Planos</h2>
        <h3 class="text-xl md:text-2xl text-gray-700 mb-6 font-medium">Moderação inteligente com o jeitinho brasileiro
        </h3>

        <!-- Banner de Crédito Grátis -->
        <div
          class="bg-gradient-to-r from-emerald-100/80 to-yellow-100/80 backdrop-blur-sm border-2 border-emerald-400/50 rounded-xl p-4 mb-8 max-w-3xl mx-auto shadow-lg">
          <div class="flex items-center justify-center gap-3">
            <div class="text-2xl animate-bounce">🎁</div>
            <p class="text-sm font-medium text-emerald-800">
              Ganhe <span class="font-bold text-emerald-700">R$ 5 de crédito</span> ao se cadastrar!
              <span class="text-gray-700 block mt-1 text-xs">(equivale a 11 mil palavras, estimado a 1.375 mensagens do
                WhatsApp ou 1 hora de leitura)</span>
            </p>
          </div>
        </div>

        <p class="text-center text-lg text-gray-700 mb-8 font-medium">Escolha o plano que combina com seu produto</p>
      </div>

      <!-- Grade de planos -->
      <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div v-for="(plan, i) in plans" :key="plan.id"
          class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2 flex flex-col group relative"
          :class="{
            'border-emerald-400 shadow-emerald-200/50': plan.popular,
            'border-green-200/50': !plan.popular,
            'scale-105': plan.popular,
            'relative': plan.popular
          }" :style="{ transitionDelay: `${i * 150}ms` }">
          <!-- Efeito de brilho no hover -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-green-400/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl">
          </div>

          <!-- Badge de plano popular -->
          <div v-if="plan.popular"
            class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900 px-4 py-1 rounded-full font-bold text-xs shadow-lg z-20 ">
            🚀 Recomendado
          </div>

          <!-- Cabeçalho do plano -->
          <div class="text-center mb-4 relative z-10">
            <div class="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{{ plan.icon }}</div>
            <h3
              class="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors duration-300">
              {{ plan.name }}</h3>
            <div class="mb-3">
              <span
                class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">{{
                  plan.price }}</span>
              <span class="text-gray-600 text-sm">{{ plan.period }}</span>
            </div>
            <p class="text-gray-600 italic mb-4 text-sm leading-relaxed">{{ plan.description }}</p>
          </div>

          <!-- Lista de recursos -->
          <ul class="space-y-2 mb-4 flex-grow relative z-10">
            <li v-for="feature in plan.features" :key="feature" class="flex items-start space-x-2 group/item">
              <span
                class="text-emerald-500 text-sm mt-0.5 group-hover/item:scale-125 transition-transform duration-200">✔️</span>
              <span class="text-gray-700 text-sm leading-relaxed">{{ feature }}</span>
            </li>
          </ul>

          <!-- Informações de mensagens WhatsApp -->
          <p v-if="plan.whatsappMessages"
            class="text-gray-600 text-xs mb-4 text-center bg-emerald-50/50 rounded-lg p-2 relative z-10">
            Modere até <strong class="text-emerald-700">{{ plan.whatsappMessages }}</strong> mensagens
          </p>

          <!-- Botões de ação -->
          <div class="mt-auto relative z-10 space-y-2">
            <!-- Botão principal baseado no plano -->
            <div v-if="plan.id === 'inicial'" class="flex gap-2">
              <Button @click="startSubscription(plan.id)" variant="secondary" size="sm"
                class="flex-1 font-medium text-sm py-2 shadow-md hover:shadow-lg transition-all duration-300 bg-white border-2 border-emerald-400 text-emerald-700 hover:bg-emerald-50">
                Teste Grátis
              </Button>
              <Button @click="startSubscription(plan.id)" variant="primary" size="sm"
                class="flex-1 font-medium text-sm py-2 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white">
                Assinar
              </Button>
            </div>
            <Button v-else @click="startSubscription(plan.id)" :variant="plan.popular ? 'primary' : 'secondary'"
              size="sm" full-width rounded="lg"
              class="font-medium text-sm py-2 shadow-md hover:shadow-lg transition-all duration-300" :class="{
                'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white': plan.popular,
                'bg-white border-2 border-emerald-400 text-emerald-700 hover:bg-emerald-50': !plan.popular
              }">
              Assinar
            </Button>
          </div>

          <!-- Informações de excedente (expandível) -->
          <div v-if="plan.excedenteCost" class="mt-3 relative z-10">
            <button @click="showAllExcedentes = !showAllExcedentes"
              class="text-emerald-600 hover:text-emerald-700 text-xs font-medium transition-colors duration-200 flex items-center gap-1 mx-auto">
              <span>Ver detalhes de excedente</span>
              <svg class="w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': showAllExcedentes }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <div v-show="showAllExcedentes"
              class="mt-2 p-3 bg-emerald-50/70 rounded-lg border border-emerald-200/50 transition-all duration-300">
              <p class="text-xs text-gray-700 mb-1">
                <strong>Custo por palavra excedente:</strong> {{ plan.excedenteCost }}
              </p>
              <p v-if="plan.excedentExample" class="text-xs text-gray-600 italic">
                {{ plan.excedentExample }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção de comparação de valores -->
      <div class="mt-12 max-w-3xl mx-auto">
        <div class="text-center mb-6">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Para você ter uma ideia...</h3>
          <p class="text-sm text-gray-700">Veja o que cada volume de palavras representa</p>
        </div>

        <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200/50">
          <div class="grid md:grid-cols-2 gap-4">
            <div v-for="(item, index) in pricingTable" :key="index"
              class="text-center p-4 bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-xl border border-emerald-200/30">
              <h4 class="text-lg font-bold text-emerald-700 mb-2">{{ item.words }} palavras</h4>
              <div class="space-y-1 text-gray-700">
                <p class="text-sm">📱 {{ item.whatsapp }}</p>
                <p class="text-sm">📖 {{ item.readingTime }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to action final -->
      <div class="text-center mt-12">
        <div
          class="bg-gradient-to-r from-emerald-100/80 to-yellow-100/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-lg">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Pronto para começar?</h3>
          <p class="text-sm text-gray-700 mb-4">Experimente nossa moderação inteligente hoje mesmo!</p>
          <Button @click="startSubscription('inicial')" variant="primary" size="lg" rounded="lg"
            class="font-medium text-sm px-8 py-2 shadow-md hover:shadow-lg transition-all duration-300">
            🚀 Começar Agora
          </Button>
        </div>
      </div>
    </div>

    <!-- Separador visual -->
    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent z-10">
    </div>
  </section>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #10b981, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>