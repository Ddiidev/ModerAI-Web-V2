<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Shield, MessageSquare, Zap, BarChart4, Users, Bot, Glasses } from 'lucide-vue-next';

// Interface para os recursos
interface Feature {
  icon: any;
  title: string;
  description: string;
}

// Lista de recursos
const features: Feature[] = [
  {
    icon: Shield,
    title: 'Proteção em Tempo Real',
    description: 'Detecte e filtre conteúdo tóxico ou inadequado instantaneamente, antes mesmo de ser publicado.'
  },
  {
    icon: Glasses,
    title: 'Transparência e Explicabilidade',
    description: 'Relatórios claros sobre por que um texto foi sinalizado, com métricas de precisão e confiança.'
  },
  {
    icon: Zap,
    title: 'Alta Performance',
    description: 'Nossa API de baixa latência processa milhares de mensagens por segundo sem comprometer a qualidade.'
  },
  {
    icon: BarChart4,
    title: 'Análise Detalhada',
    description: 'Obtenha insights sobre o conteúdo da sua plataforma com relatórios e métricas avançadas (Beta).'
  },
  {
    icon: Users,
    title: 'Comunidade Saudável',
    description: 'Crie um ambiente online seguro e acolhedor para todos os seus usuários.'
  },
  {
    icon: Bot,
    title: 'Flow de Moderação Inteligente',
    description: 'Sistema inteligente com três camadas de moderação para análise precisa e contextual de conteúdo.'
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

  const featuresSection = document.getElementById('features-section');
  if (featuresSection) {
    observer.observe(featuresSection);
  }
});
</script>

<template>
  <section id="features-section" class="py-24 md:py-32 relative overflow-hidden">
    <!-- Círculos decorativos com blur -->
    <div
      class="absolute top-20 right-10 w-80 h-80 bg-gradient-to-r from-green-300/10 to-emerald-400/10 rounded-full filter blur-3xl animate-pulse"
      style="animation-delay: 1s;"></div>
    <div
      class="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-l from-yellow-300/8 to-amber-400/8 rounded-full filter blur-3xl animate-pulse"
      style="animation-delay: 3s;"></div>

    <!-- Elementos geométricos decorativos -->
    <div class="absolute top-1/3 left-1/4 w-20 h-20 border border-green-300/30 rounded-full animate-spin"
      style="animation-duration: 15s;"></div>
    <div class="absolute bottom-1/4 right-1/3 w-16 h-16 border border-yellow-300/30 rounded-lg rotate-45 animate-bounce"
      style="animation-duration: 4s;"></div>

    <div class="container mx-auto px-6 relative z-10">
      <!-- Cabeçalho da seção -->
      <div class="text-center mb-20">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gradient">Recursos Poderosos</h2>
        <p class="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
          Nossa plataforma oferece ferramentas avançadas de moderação para manter sua comunidade segura.
        </p>
      </div>

      <!-- Grade de recursos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        <div v-for="(feature, index) in features" :key="index"
          class="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-3 border border-green-100/50"
          :class="{ 'opacity-0 translate-y-8': !isVisible, 'opacity-100 translate-y-0': isVisible }"
          :style="{ transitionDelay: `${index * 150}ms` }">
          <!-- Ícone -->
          <div
            class="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <component :is="feature.icon" class="w-8 h-8" />
          </div>

          <!-- Título e descrição -->
          <h3 class="text-2xl font-bold mb-4 text-gray-800 group-hover:text-green-700 transition-colors duration-300">{{
            feature.title }}</h3>
          <p class="text-gray-600 leading-relaxed text-lg">{{ feature.description }}</p>

          <!-- Borda decorativa inferior -->
          <div
            class="mt-6 h-1 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500">
          </div>
        </div>
      </div>
    </div>

    <!-- Separador visual -->
    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent z-10">
    </div>
  </section>
</template>