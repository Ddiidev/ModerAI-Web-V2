<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Github, Twitter, Linkedin, Mail } from 'lucide-vue-next';

const router = useRouter();
const currentYear = new Date().getFullYear();
const email = ref('');
const subscribeStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const errorMessage = ref('');

// Função para validar o formato do email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para assinar a newsletter
const subscribeNewsletter = async () => {
  // Validar o email
  if (!email.value || !isValidEmail(email.value)) {
    errorMessage.value = 'Por favor, insira um email válido.';
    subscribeStatus.value = 'error';
    return;
  }

  // Simular o envio da assinatura
  subscribeStatus.value = 'loading';

  try {
    // Aqui seria implementada a integração com o serviço de newsletter
    await new Promise(resolve => setTimeout(resolve, 1000));

    subscribeStatus.value = 'success';
    email.value = '';
    errorMessage.value = '';

    // Resetar o status após alguns segundos
    setTimeout(() => {
      subscribeStatus.value = 'idle';
    }, 3000);
  } catch (error) {
    subscribeStatus.value = 'error';
    errorMessage.value = 'Ocorreu um erro. Tente novamente mais tarde.';
  }
};

// Navegar para uma rota
const navigateTo = (path: string) => {
  router.push(path);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <footer class="bg-gray-900 pt-16 pb-8 border-t border-gray-800">
    <div class="container mx-auto px-4">
      <!-- Seção principal do rodapé -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <!-- Coluna 1: Logo e descrição -->
        <div class="col-span-1 md:col-span-1">
          <RouterLink to="/" class="flex items-center mb-4 space-x-3 group">
            <div
              class="h-12 w-12 rounded-full p-0.5 bg-gradient-to-r from-green-400 to-yellow-400 shadow-lg group-hover:shadow-xl"
              style="filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.3));">
              <img alt="ModerAÍ logo" class="h-full w-full rounded-full object-cover"
								src="../assets/logo-only-dog.jpg" />
						</div>
						<span
							class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:to-green-800 transition-all duration-300">ModerAÍ</span>
          </RouterLink>
          <p class="text-gray-400 mb-4">
            Soluções avançadas de moderação de conteúdo com inteligência artificial para criar comunidades online mais
            seguras e saudáveis.
          </p>
          <div class="flex space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              class="text-gray-400 hover:text-purple-400 transition-colors">
              <Github class="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              class="text-gray-400 hover:text-purple-400 transition-colors">
              <Twitter class="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
              class="text-gray-400 hover:text-purple-400 transition-colors">
              <Linkedin class="w-5 h-5" />
            </a>
            <a href="mailto:contato@moderai.com.br" class="text-gray-400 hover:text-purple-400 transition-colors">
              <Mail class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Coluna 2: Links rápidos -->
        <div class="col-span-1">
          <h3 class="text-white font-semibold mb-4">Links Rápidos</h3>
          <ul class="space-y-2">
            <li>
              <a @click="navigateTo('/')"
                class="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Início</a>
            </li>
          </ul>
        </div>

        <!-- Coluna 3: Recursos -->
        <div class="col-span-1">
          <h3 class="text-white font-semibold mb-4">Recursos</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-400 hover:text-purple-400 transition-colors">API Reference</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-purple-400 transition-colors">Guias de Integração</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-purple-400 transition-colors">Exemplos de Código</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-purple-400 transition-colors">Status da Plataforma</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-purple-400 transition-colors">Changelog</a>
            </li>
          </ul>
        </div>

        <!-- Coluna 4: Newsletter -->
        <div class="col-span-1">
          <h3 class="text-white font-semibold mb-4">Newsletter</h3>
          <p class="text-gray-400 mb-4">
            Inscreva-se para receber novidades, atualizações e conteúdo exclusivo sobre moderação de conteúdo.
          </p>
          <form @submit.prevent="subscribeNewsletter" class="space-y-2">
            <div class="relative">
              <input v-model="email" type="email" placeholder="Seu email"
                class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                :disabled="subscribeStatus === 'loading' || subscribeStatus === 'success'" />
              <p v-if="subscribeStatus === 'error'" class="text-red-400 text-sm mt-1">{{ errorMessage }}</p>
              <p v-if="subscribeStatus === 'success'" class="text-green-400 text-sm mt-1">Inscrição realizada com
                sucesso!</p>
            </div>
            <button type="submit"
              class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="subscribeStatus === 'loading' || subscribeStatus === 'success'">
              <span v-if="subscribeStatus === 'loading'">Inscrevendo...</span>
              <span v-else-if="subscribeStatus === 'success'">Inscrito!</span>
              <span v-else>Inscrever</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Linha divisória -->
      <div class="border-t border-gray-800 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <!-- Copyright -->
          <p class="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {{ currentYear }} ModerAÍ. Todos os direitos reservados.
          </p>

          <!-- Links legais -->
          <div class="flex space-x-6">
            <a href="#" class="text-gray-500 hover:text-purple-400 text-sm transition-colors">Termos de Serviço</a>
            <a href="#" class="text-gray-500 hover:text-purple-400 text-sm transition-colors">Política de
              Privacidade</a>
            <a href="#" class="text-gray-500 hover:text-purple-400 text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>