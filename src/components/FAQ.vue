<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ChevronDown, ChevronUp } from 'lucide-vue-next';
import { marked } from 'marked';

// Interface para as perguntas frequentes
interface FAQItem {
  question: string;
  answer: string;
}

// Lista de perguntas frequentes
const faqItems: FAQItem[] = [
  {
    question: 'Como a ModerAÍ detecta conteúdo tóxico?',
    answer: 'Utilizamos 3 fluxos parelelos de moderação de conteúdo.\n\n1º Fluxo: **Algoritimo Jaro similarity** extremamente rápido consegue identificar até **33%** dos textos ofensivos.\n\n2º Fluxo: **Busca de cosseno vetorizada** com base de dados de treinamento. Muito rápido, consegue identificar até **20%**.\n\n3º Fluxo: **LLM (MaritaAI)**, consegue identificar até **46,97%** dos casos.\n\n<br/>Somando os 3 fluxos, chegamos a **99.97%** de eficiência e aproximação da resposta correta!\nOs três são executados em paralelo para ter a melhor performance!'
  },
  {
    question: 'A ModerAÍ funciona em quais idiomas?',
    answer: 'O ModerAÍ é **especialista** em moderação de conteúdo em **Português**, e principalmente no jeitinho brasileiro.'
  },
  {
    question: 'Quanto tempo leva para integrar a ModerAÍ à minha plataforma?',
    answer: 'A integração é **rápida e simples**. Com nossa API REST e SDKs para as principais linguagens de programação, a maioria dos clientes consegue implementar a solução em **menos de um dia**.\n\n **Recursos disponíveis:** \n\n - API RESTful completa;\n\n- SDKs para múltiplas linguagens;\n\n- Documentação detalhada;\n\n- Suporte por e-mail e discord;\n\n- Documentação criada para AI;'
  },
  {
    question: 'A ModerAÍ pode moderar imagens e vídeos?',
    answer: '**Não**, o foco até 2026 é apenas moderação de texto.\n\nMas está no nosso roadmap o desenvolvimento de moderação de **áudio** pois é onde o ModerAÍ pode brilhar ✨. E imagem não tem nada ofensivo que apenas um brasileiro conseguiria fazer. E o foco é o contexto Brasil/brasileiro.\n\n<br/>Mas não paramos por aí!\n\nEmbora isso, teremos no futuro moderação de áudio, imagem e vídeo.'
  },
  {
    question: 'Como a ModerAÍ lida com falsos positivos?',
    answer: 'Nossos modelos são **constantemente refinados** para minimizar falsos positivos. Além disso, oferecemos:\n\n- **Controles de sensibilidade** personalizáveis\n- Ajuste do nível de moderação por comunidade\n- Sistema de feedback para melhorias contínuas\n- *Machine learning* adaptativo\n\nVocê pode fornecer feedback sobre decisões incorretas para melhorar o sistema.'
  },
  {
    question: 'A ModerAÍ armazena o conteúdo dos meus usuários?',
    answer: 'Priorizamos a **privacidade e segurança** dos dados. Por padrão:\n\n- ❌ **Não armazenamos** permanentemente o conteúdo\n- ⚡ Processamento em **tempo real**\n- 🗑️ Dados descartados após análise\n- 📊 Opção de auditoria com armazenamento temporário\n\n- 🧪 Após análise das mensagens acontece o refinamento, e as mensagens não são salvas de forma bruta, apenas como vetor de forma segura.\n\n*Sua privacidade é nossa prioridade.*'
  }
];

// Estado para controlar quais itens estão expandidos
const expandedItems = ref<number[]>([]);
const isVisible = ref(false);

// Função para alternar a expansão de um item
const toggleItem = (index: number) => {
  if (expandedItems.value.includes(index)) {
    expandedItems.value = []; // Recolhe se já estiver expandido
  } else {
    expandedItems.value = [index]; // Expande apenas o item clicado
  }
};

// Verificar se um item está expandido
const isExpanded = (index: number) => {
  return expandedItems.value.includes(index);
};

// Processar markdown para HTML
const processedFaqItems = computed(() => {
  return faqItems.map(item => ({
    ...item,
    processedAnswer: marked(item.answer)
  }));
});

// Iniciar animação quando o componente for visível
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible.value = true;
      observer.disconnect();
    }
  }, { threshold: 0.1 });

  const faqSection = document.getElementById('faq-section');
  if (faqSection) {
    observer.observe(faqSection);
  }

  // Expandir o primeiro item por padrão
  expandedItems.value = [0];
});
</script>

<template>
  <section id="faq-section" class="py-16 md:py-24 bg-emerald-50/30">
    <div class="container mx-auto px-4">
      <!-- Cabeçalho da seção -->
      <div class="text-center mb-16 transition-all duration-1000"
        :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }">
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gradient">Perguntas Frequentes</h2>
        <p class="text-lg text-gray-700 max-w-3xl mx-auto">
          Encontre respostas para as dúvidas mais comuns sobre nossa plataforma de moderação de conteúdo.
        </p>
      </div>

      <!-- Lista de perguntas frequentes -->
      <div class="max-w-3xl mx-auto">
        <div v-for="(item, index) in processedFaqItems" :key="index" class="mb-4 transition-all duration-500 transform"
          :class="{
            'opacity-0 translate-y-8': !isVisible,
            'opacity-100 translate-y-0': isVisible
          }" :style="{ transitionDelay: `${index * 100}ms` }">
          <!-- Pergunta (cabeçalho) -->
          <button @click="toggleItem(index)"
            class="w-full text-left p-5 bg-white/90 backdrop-blur-sm rounded-lg flex justify-between items-center border border-emerald-200/50 hover:bg-emerald-50/70 hover:border-emerald-300/70 transition-all duration-300 shadow-lg hover:shadow-xl"
            :class="{ 'rounded-b-none border-b-0': isExpanded(index) }" :aria-expanded="isExpanded(index)">
            <h3 class="text-lg font-semibold text-gray-800">{{ item.question }}</h3>
            <ChevronDown v-if="!isExpanded(index)" class="w-5 h-5 text-emerald-600" />
            <ChevronUp v-else class="w-5 h-5 text-green-600" />
          </button>

          <!-- Resposta (conteúdo) -->
          <div v-show="isExpanded(index)"
            class="p-5 bg-emerald-50/50 rounded-b-lg border border-emerald-200/50 border-t-0 shadow-lg">
            <div class="text-gray-700 leading-relaxed prose prose-sm max-w-none"
              v-html="processedFaqItems[index].processedAnswer"></div>
          </div>
        </div>
      </div>

      <!-- Nota de suporte -->
      <p class="text-center text-gray-700 mt-12 transition-all duration-1000"
        :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }">
        Não encontrou o que procurava? <a href="mailto:suporte@moderai.dev"
          class="text-emerald-600 hover:text-emerald-700 underline font-medium">Entre em contato com nosso suporte via
          email</a>.
      </p>
    </div>
  </section>
</template>