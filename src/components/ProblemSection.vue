<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Globe, Bot, MessageSquareWarning, Zap } from 'lucide-vue-next';

// Interface para os problemas
interface Problem {
  icon: any;
  title: string;
  description: string;
}

// Lista de problemas
const problems: Problem[] = [
  {
    icon: Globe,
    title: 'Soluções Globais Não Entendem o Brasil',
    description: 'Moderadores de texto internacionais falham em detectar ofensas sutis, ironias e gírias brasileiras.'
  },
  {
    icon: Bot,
    title: 'Falsos Positivos e Negativos',
    description: 'Sistemas genéricos subestimam a toxicidade de conteúdo local e podem bloquear conteúdo inofensivo.'
  },
  {
    icon: MessageSquareWarning,
    title: 'Receber feedback',
    description: 'Toda requisição recebe feedback do motivo detalhado do conteúdo estar com flag de tóxico/ofensivo'
  },
  {
    icon: Zap,
    title: 'Serviços Atuais Difíceis de Integrar',
    description: 'Soluções existentes possuem integração complexa ou limites de requisição restritivos.'
  }
];

// Estado para animação
const isVisible = ref(false);

// Iniciar animação quando o componente for visível
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.1 });

  const problemSection = document.getElementById('problem-section');
  if (problemSection) {
    observer.observe(problemSection);
  }
});
</script>

<template>
  <section id="problem-section" class="py-24 md:py-32 relative overflow-hidden">
    <!-- Círculos decorativos com blur -->
    <div
      class="absolute top-20 right-10 w-80 h-80 bg-gradient-to-r from-red-300/10 to-orange-400/10 rounded-full filter blur-3xl animate-pulse"
      style="animation-delay: 1s;"></div>
    <div
      class="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-l from-gray-300/8 to-slate-400/8 rounded-full filter blur-3xl animate-pulse"
      style="animation-delay: 3s;"></div>

    <!-- Elementos geométricos decorativos -->
    <div class="absolute top-1/3 left-1/4 w-20 h-20 border border-red-300/30 rounded-full animate-spin"
      style="animation-duration: 15s;"></div>
    <div class="absolute bottom-1/4 right-1/3 w-16 h-16 border border-gray-300/30 rounded-lg rotate-45 animate-bounce"
      style="animation-duration: 4s;"></div>

    <div class="container mx-auto px-4 relative z-10 max-w-4xl">
      <!-- Cabeçalho da seção -->
      <div class="text-center mb-20">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gray-800">O Problema</h2>
        <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
          Moderação de conteúdo no Brasil enfrenta desafios únicos que soluções globais não conseguem resolver.
        </p>
      </div>

      <!-- Grade de problemas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
        <div v-for="(problem, index) in problems" :key="index"
          class="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:transform hover:-translate-y-2 border border-gray-100"
          :class="{ 'opacity-0 translate-y-8': !isVisible, 'opacity-100 translate-y-0': isVisible }"
          :style="{ transitionDelay: `${index * 150}ms` }">
          <!-- Ícone -->
          <div
            class="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-red-400 to-orange-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <component :is="problem.icon" class="w-8 h-8" />
          </div>

          <!-- Título e descrição -->
          <h3 class="text-2xl font-bold mb-4 text-gray-800 group-hover:text-red-700 transition-colors duration-300">{{
            problem.title }}</h3>
          <p class="text-gray-600 leading-relaxed text-lg">{{ problem.description }}</p>

          <!-- Borda decorativa inferior -->
          <div
            class="mt-6 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500">
          </div>
        </div>
      </div>
    </div>

    <!-- Separador visual -->
    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent z-10">
    </div>
  </section>
</template>

<style scoped>
/* Estilos adicionais se necessário */
</style>