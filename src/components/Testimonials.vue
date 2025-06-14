<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Interface para os depoimentos
interface Testimonial {
  content: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

// Lista de depoimentos
const testimonials: Testimonial[] = [
  {
    content: "Desde que implementamos a ModerAÍ no nosso bot de WhatsApp, a qualidade do atendimento melhorou drasticamente. Os atendentes agora podem focar em resolver problemas reais, sem perder tempo com mensagens tóxicas ou spam.",
    author: "Ana Silva",
    role: "Supervisora de Atendimento",
    company: "Bitrix24",
    avatar: "/avatars/avatar-1.jpg"
  },
  {
    content: 'Super apoio!!! Como profissional da área esse tipo de produto vem pra somar demais no mercado brasileiro. Vou querer testar!',
    author: 'Thiago',
    role: 'Trust & Safety, Gerente de Comunidade',
    company: 'Não informado',
    avatar: '/avatars/avatar-4.jpg'
  }
];

// Estado para animação
const isVisible = ref(false);
const activeIndex = ref(0);

// Função para avançar para o próximo depoimento
const nextTestimonial = () => {
  activeIndex.value = (activeIndex.value + 1) % testimonials.length;
};

// Função para voltar para o depoimento anterior
const prevTestimonial = () => {
  activeIndex.value = (activeIndex.value - 1 + testimonials.length) % testimonials.length;
};

// Iniciar animação quando o componente for visível
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.1 });

  const testimonialsSection = document.getElementById('testimonials-section');
  if (testimonialsSection) {
    observer.observe(testimonialsSection);
  }

  // Rotação automática dos depoimentos
  const interval = setInterval(() => {
    nextTestimonial();
  }, 8000);

  // Limpar o intervalo quando o componente for desmontado
  return () => clearInterval(interval);
});
</script>

<template>
  <section id="testimonials-section" class="py-24 md:py-32 relative overflow-hidden">
    <!-- Fundo com gradiente verde-amarelo -->
    <div class="absolute inset-0 bg-gradient-to-br from-green-600/5 via-emerald-600/5 to-yellow-500/5 z-0"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-green-900/10 via-transparent to-yellow-400/10 z-0"></div>

    <!-- Círculos decorativos com blur -->
    <div
      class="absolute top-10 right-20 w-96 h-96 bg-gradient-to-r from-green-400/8 to-emerald-500/8 rounded-full filter blur-3xl animate-pulse"
      style="animation-delay: 2s;"></div>
    <div
      class="absolute bottom-10 left-20 w-80 h-80 bg-gradient-to-l from-yellow-400/10 to-amber-500/10 rounded-full filter blur-3xl animate-pulse"
      style="animation-delay: 4s;"></div>

    <!-- Elementos geométricos decorativos -->
    <div class="absolute top-1/4 left-1/3 w-24 h-24 border border-green-400/20 rounded-full animate-spin"
      style="animation-duration: 25s;"></div>
    <div class="absolute bottom-1/3 right-1/4 w-20 h-20 border border-yellow-400/20 rounded-lg rotate-45 animate-bounce"
      style="animation-duration: 5s;"></div>

    <div class="container mx-auto px-6 relative z-10">
      <!-- Cabeçalho da seção -->
      <div class="text-center mb-20" :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
        style="transition: all 1s ease-out;">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gradient">O que estão falando do ModerAÍ</h2>
        <p class="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
          Veja como a ModerAÍ está transformando o atendimento ao cliente e melhorando a vida dos atendentes em bots de
          WhatsApp e chats de suporte.
        </p>
      </div>

      <!-- Carrossel de depoimentos -->
      <div class="max-w-5xl mx-auto relative">
        <div class="transition-all duration-1000 transform"
          :class="{ 'opacity-0 scale-95': !isVisible, 'opacity-100 scale-100': isVisible }">
          <!-- Depoimento atual -->
          <div
            class="bg-white/90 backdrop-blur-sm rounded-3xl p-10 md:p-12 shadow-2xl border border-green-100/50 relative overflow-hidden">
            <!-- Aspas decorativas -->
            <div class="absolute top-6 left-8 text-6xl text-green-400/20 font-serif">"</div>
            <div class="absolute bottom-6 right-8 text-6xl text-yellow-400/20 font-serif rotate-180">"</div>

            <!-- Conteúdo do depoimento -->
            <div class="relative z-10">
              <p class="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed font-medium italic">
                {{ testimonials[activeIndex].content }}
              </p>

              <!-- Informações do autor -->
              <div class="flex items-center gap-6">
                <!-- Avatar -->
                <div
                  class="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {{ testimonials[activeIndex].author.charAt(0) }}
                </div>

                <!-- Detalhes do autor -->
                <div>
                  <h4 class="text-xl font-bold text-gray-800">{{ testimonials[activeIndex].author }}</h4>
                  <p class="text-green-600 font-medium">{{ testimonials[activeIndex].role }}</p>
                  <p class="text-gray-500">{{ testimonials[activeIndex].company }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Indicadores de navegação -->
          <div class="flex justify-center mt-10 gap-3">
            <button v-for="(testimonial, index) in testimonials" :key="index" @click="activeIndex = index"
              class="w-4 h-4 rounded-full transition-all duration-300 hover:scale-125"
              :class="index === activeIndex ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' : 'bg-gray-300 hover:bg-gray-400'"></button>
          </div>

          <!-- Botões de navegação -->
          <div class="flex justify-between items-center mt-8">
            <button @click="prevTestimonial"
              class="flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <button @click="nextTestimonial"
              class="flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Separador visual -->
    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent z-10">
    </div>
  </section>
</template>

<style>
.animate-dog-walk {
  animation: dog-walk 15s linear infinite;
}

@keyframes dog-walk {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}
</style>