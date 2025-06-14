<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from './Button.vue';
import { useAuthStore } from '../stores/auth';
import { ArrowRight } from 'lucide-vue-next';

// Propriedades
const props = defineProps<{
  title?: string;
  subtitle?: string;
  showButtons?: boolean;
}>();

// Valores padrão para as propriedades
const title = props.title || 'Moderação de Texto com DNA 🧬 Brasileiro';
const subtitle = props.subtitle || 'Proteja sua comunidade online com uma solução de moderação que realmente entende o contexto cultural brasileiro.';
const showButtons = props.showButtons !== undefined ? props.showButtons : true;

// Estado
const router = useRouter();
const authStore = useAuthStore();
const isAnimating = ref(false);
const animationComplete = ref(false);

// Função para navegar para a página de demonstração
const goToDemo = () => {
  router.push('/demo');
};

// Função para iniciar a animação
const startAnimation = () => {
  if (isAnimating.value || animationComplete.value) return;

  isAnimating.value = true;
  setTimeout(() => {
    animationComplete.value = true;
    isAnimating.value = false;
  }, 1000);
};

// Iniciar animação quando o componente for montado
onMounted(() => {
  startAnimation();
});
</script>

<template>
  <section
    class="relative overflow-hidden py-20 md:py-32 lg:py-40 min-h-screen flex items-center bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50">
    <!-- Fundo com gradiente verde-amarelo e efeito de blur -->
    <div class="absolute inset-0 bg-gradient-to-br from-green-400/30 via-emerald-500/20 to-yellow-400/30 z-0"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-green-900/10 via-transparent to-yellow-300/10 z-0"></div>

    <!-- Círculos decorativos com blur -->
    <div
      class="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-full filter blur-3xl animate-pulse">
    </div>
    <div
      class="absolute top-20 right-20 w-96 h-96 bg-gradient-to-l from-yellow-400/15 to-amber-500/15 rounded-full filter blur-3xl animate-pulse"
      style="animation-delay: 2s;"></div>
    <div
      class="absolute bottom-20 left-1/4 w-64 h-64 bg-gradient-to-tr from-green-500/10 to-yellow-400/10 rounded-full filter blur-2xl animate-pulse"
      style="animation-delay: 4s;"></div>

    <!-- Elementos geométricos decorativos -->
    <div class="absolute top-1/4 right-1/3 w-32 h-32 border border-green-400/20 rounded-full animate-spin"
      style="animation-duration: 20s;"></div>
    <div class="absolute bottom-1/3 left-1/4 w-24 h-24 border border-yellow-400/20 rounded-lg rotate-45 animate-bounce"
      style="animation-duration: 3s;"></div>

    <!-- Conteúdo principal -->
    <div class="container mx-auto px-6 relative z-10">
      <div class="max-w-5xl mx-auto text-center">
        <!-- Logo e Título com animação de gradiente -->
        <div class="flex flex-col items-center mb-8">
          <!-- Logo -->
          <div class="mb-6 transform transition-all duration-1000"
            :class="{ 'opacity-0 scale-75 translate-y-10': !animationComplete, 'opacity-100 scale-100 translate-y-0': animationComplete }"
            style="transition-delay: 0.2s;">
            <div class="relative">
              <div
                class="rounded-4xl w-24 h-24 md:w-64 md:h-64 p-1.5 bg-gradient-to-r from-green-400 to-yellow-400 shadow-2xl animate-pulse"
                style="filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.4));">
                <img alt="ModerAÍ logo" class="w-full h-full rounded-4xl object-cover shadow-md shadow-green-300"
                  src="../assets/moderai_logo.png" />
              </div>
              <!-- Efeito de brilho -->
              <div
                class="absolute inset-0 rounded-4xl bg-gradient-to-r from-green-400/20 to-yellow-400/20 animate-ping">
              </div>
            </div>
          </div>

          <!-- Título -->
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient animate-float leading-tight"
            :class="{ 'opacity-0 translate-y-10': !animationComplete, 'opacity-100 translate-y-0': animationComplete }"
            style="transition: all 1s ease-out 0.4s;">
            {{ title }}
          </h1>
        </div>

        <!-- Subtítulo -->
        <p class="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
          :class="{ 'opacity-0 translate-y-10': !animationComplete, 'opacity-100 translate-y-0': animationComplete }"
          style="transition: all 1s ease-out 0.6s;">
          {{ subtitle }}
        </p>

        <!-- Botões de ação -->
        <div v-if="showButtons" class="flex flex-col sm:flex-row justify-center gap-6"
          :class="{ 'opacity-0 translate-y-10': !animationComplete, 'opacity-100 translate-y-0': animationComplete }"
          style="transition: all 1s ease-out 0.8s;">
          <Button variant="primary" size="xl" rounded="lg" @click="goToDemo"
            class="flex items-center justify-center gap-3 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300">
            Ver demonstração
            <ArrowRight class="w-6 h-6" />
          </Button>

          <Button v-if="!authStore.isAuthenticated" variant="secondary" size="xl" rounded="lg"
            @click="authStore.loginWithGoogle()"
            class="border-2 border-green-500 text-green-700 hover:bg-green-50 shadow-lg hover:shadow-green-500/20 transform hover:scale-105 transition-all duration-300">
            Começar agora
          </Button>

          <Button v-else variant="secondary" size="xl" rounded="lg" @click="router.push('/dashboard')"
            class="border-2 border-green-500 text-green-700 hover:bg-green-50 shadow-lg hover:shadow-green-500/20 transform hover:scale-105 transition-all duration-300">
            Acessar dashboard
          </Button>
        </div>
      </div>
    </div>

    <!-- Separador visual na parte inferior -->
    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-10">
    </div>
  </section>
</template>