<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Hero from '../components/Hero.vue';
import ProblemSection from '../components/ProblemSection.vue';
import Features from '../components/Features.vue';
import DemonstrationChatModeration from '../components/DemonstrationChatModeration.vue';
import DemonstrationTwitchModeration from '../components/DemonstrationTwitchModeration.vue';
import Testimonials from '../components/Testimonials.vue';
import Pricing from '../components/Pricing.vue';
import FAQ from '../components/FAQ.vue';
import Footer from '../components/Footer.vue';

// Estado das abas
const activeTab = ref('chat');
const isPartnersVisible = ref(false);

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};

// Iniciar animação quando o componente for visível
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isPartnersVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.1 });

  const partnersSection = document.getElementById('parceiros');
  if (partnersSection) {
    observer.observe(partnersSection);
  }
});
</script>

<template>
  <main class="min-h-screen">
    <!-- Seção Hero -->
    <section id="inicio">
      <Hero />
    </section>

    <!-- Seção do Problema -->
    <section id="problema" class="bg-gradient-to-br from-white via-gray-50 to-emerald-50/30">
      <ProblemSection />
    </section>

    <!-- Seção de Recursos -->
    <section id="recursos" class="bg-gradient-to-br from-emerald-50/30 via-green-50 to-yellow-50/40">
      <Features />
    </section>

    <!-- Demonstração de Moderação -->
    <section id="demo" class="py-16 md:py-24 bg-gradient-to-br from-yellow-50/40 via-amber-50/30 to-emerald-50/50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gradient">Veja ModerAÍ em Ação</h2>
          <p class="text-lg text-gray-700 max-w-3xl mx-auto">
            Experimente nossa tecnologia de moderação em tempo real com estas demonstrações interativas.
          </p>
          <div class="mt-4 bg-yellow-100 border border-yellow-400 rounded-lg p-3 max-w-2xl mx-auto">
            <p class="text-sm text-yellow-800 font-medium">
              ⚠️ Esta é apenas uma simulação para demonstrar onde pode aplicar a ModerAÍ
            </p>
          </div>
        </div>

        <!-- Sistema de Abas -->
        <div class="max-w-6xl mx-auto">
          <!-- Navegação das Abas -->
          <div class="flex justify-center mb-8">
            <div class="bg-white rounded-xl p-2 shadow-lg">
              <button @click="setActiveTab('chat')" :class="[
                'px-6 py-3 rounded-lg font-medium transition-all duration-300',
                activeTab === 'chat'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              ]">
                Moderação de Chat
              </button>
              <button @click="setActiveTab('stream')" :class="[
                'px-6 py-3 rounded-lg font-medium transition-all duration-300 ml-2',
                activeTab === 'stream'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
              ]">
                Moderação de Stream
              </button>
            </div>
          </div>

          <!-- Conteúdo das Abas -->
          <div class="relative">
            <!-- Aba de Chat -->
            <div v-show="activeTab === 'chat'" class="transition-opacity duration-300">
              <DemonstrationChatModeration />
            </div>

            <!-- Aba de Stream -->
            <div v-show="activeTab === 'stream'" class="transition-opacity duration-300">
              <DemonstrationTwitchModeration />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Seção de Depoimentos -->
    <section id="depoimentos" class="bg-gradient-to-br from-emerald-50/50 via-green-50/60 to-teal-50/40">
      <Testimonials />
    </section>

    <!-- Seção de Parceiros -->
    <section id="parceiros" class="py-16 md:py-20 bg-gradient-to-br from-teal-50/40 via-cyan-50/30 to-blue-50/20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12 transition-all duration-1000"
          :class="{ 'opacity-0 translate-y-8': !isPartnersVisible, 'opacity-100 translate-y-0': isPartnersVisible }">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gradient">Nossos Parceiros</h2>
          <p class="text-lg text-gray-700 max-w-3xl mx-auto">
            Empresas que confiam e utilizam a tecnologia ModerAÍ para moderação de conteúdo.
          </p>
        </div>
        
        <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16 max-w-5xl mx-auto transition-all duration-1000"
          :class="{ 'opacity-0 translate-y-8': !isPartnersVisible, 'opacity-100 translate-y-0': isPartnersVisible }">
          <div class="w-40 md:w-48 h-24 flex items-center justify-center p-4 bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105" style="transition-delay: 100ms;">
            <img src="../assets/Bitrix24.svg" alt="Bitrix24" class="max-h-16 max-w-full" />
          </div>
          
          <div class="w-40 md:w-48 h-24 flex items-center justify-center p-4 bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105" style="transition-delay: 200ms;">
            <img src="../assets/n8n-logo.svg" alt="n8n" class="max-h-12 max-w-full" />
          </div>
          
          <div class="w-40 md:w-48 h-24 flex items-center justify-center p-4 bg-white/80 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105" style="transition-delay: 300ms;">
            <img src="../assets/product-launcher.svg" alt="Product Launcher" class="max-h-12 max-w-full" />
          </div>
        </div>
      </div>
    </section>

    <!-- Seção de Preços -->
    <section id="precos" class="bg-gradient-to-br from-blue-50/20 via-indigo-50/15 to-purple-50/10">
      <Pricing />
    </section>

    <!-- Seção FAQ -->
    <section id="faq" class="bg-gradient-to-br from-purple-50/10 via-pink-50/15 to-rose-50/10">
      <FAQ />
    </section>

    <!-- Seção de Documentação -->
    <section id="docs" class="py-16 md:py-24 bg-gradient-to-br from-rose-50/10 via-orange-50/15 to-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gradient">Documentação</h2>
          <p class="text-lg text-gray-700 max-w-3xl mx-auto">
            Acesse nossa documentação completa para integrar a ModerAÍ em seus projetos.
          </p>
        </div>
        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 class="text-xl font-semibold mb-4 text-emerald-700">API Reference</h3>
              <p class="text-gray-600 mb-6">Documentação completa da nossa API REST para integração em qualquer
                plataforma.</p>
              <a href="#" class="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
                Ver Documentação →
              </a>
            </div>
            <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 class="text-xl font-semibold mb-4 text-emerald-700">Guias de Integração</h3>
              <p class="text-gray-600 mb-6">Tutoriais passo a passo para integrar com Discord, Twitch, YouTube e outras
                plataformas.</p>
              <a href="#" class="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
                Ver Guias →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Rodapé -->
    <div class="bg-gradient-to-br from-gray-50 to-gray-100">
      <Footer />
    </div>
  </main>
</template>
