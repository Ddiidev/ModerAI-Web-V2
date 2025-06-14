<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import Button from './Button.vue';
import { LogOut, ChevronDown, User } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';

// Store de autenticação
const authStore = useAuthStore();
const router = useRouter();

// Estado local
const showSubMenu = ref(false);
const hideTimeout = ref<number | null>(null);

// Função para fazer logout
const signOut = () => {
  authStore.logout();
  showSubMenu.value = false;
  router.push('/');
};

// Função para fazer login
const handleLogin = () => {
  console.log('Iniciando login...');
  authStore.loginWithGoogle();
};

// Funções para controlar o submenu
const handleMouseEnter = () => {
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
  showSubMenu.value = true;
};

const handleMouseLeave = () => {
  hideTimeout.value = window.setTimeout(() => {
    showSubMenu.value = false;
  }, 300);
};

// Verificar callback do Google na URL
const checkGoogleCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    console.log('Processando callback do Google...');
    try {
      const success = await authStore.handleGoogleCallback(code);
      if (success) {
        console.log('Login realizado com sucesso!');
        // Limpar a URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error('Erro no callback:', error);
    }
  }
};

// Watch para mudanças no estado de autenticação
watch(() => authStore.currentUser, (newUser) => {
  console.log('Estado do usuário alterado:', newUser);
}, { immediate: true });

// Limpar timeout ao desmontar o componente
onUnmounted(() => {
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
  }
});

// Inicializar autenticação ao montar o componente
onMounted(async () => {
  console.log('Inicializando autenticação...');
  authStore.initAuth();

  // Verificar se há callback do Google
  await checkGoogleCallback();

  console.log('Estado inicial:', {
    isAuthenticated: authStore.isAuthenticated,
    currentUser: authStore.currentUser,
    token: authStore.token
  });
});
</script>

<template>
  <div class="relative">
    <!-- Botão de login quando não autenticado -->
    <Button v-if="!authStore.isAuthenticated" @click="handleLogin" variant="primary">
      Entrar
    </Button>

    <!-- Botão de usuário quando autenticado -->
    <div v-else
      class="flex items-center gap-3 cursor-pointer bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
      @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <!-- Avatar do usuário -->
      <div
        class="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-emerald-400 to-green-500 border-2 border-white shadow-lg">
        <img v-if="authStore.currentUser?.picture" :src="authStore.currentUser.picture" alt="Avatar do usuário"
          class="w-full h-full object-cover">
        <User v-else class="w-full h-full p-2 text-white" />
      </div>

      <!-- Nome/email do usuário -->
      <div class="hidden xl:block">
        <p class="text-sm font-semibold text-gray-800">
          {{ authStore.currentUser?.name || authStore.currentUser?.email || 'Usuário' }}
        </p>
      </div>

      <!-- Ícone de dropdown -->
      <ChevronDown class="w-4 h-4 text-emerald-600 transition-transform duration-300"
        :class="{ 'rotate-180': showSubMenu }" />

      <!-- Submenu dropdown -->
      <div v-if="showSubMenu"
        class="absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl py-2 z-50 border border-emerald-200/50 overflow-hidden">
        <!-- Header do menu -->
        <div class="px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200/50">
          <p class="text-sm font-semibold text-gray-800">
            {{ authStore.currentUser?.name || 'Usuário' }}
          </p>
          <p class="text-xs text-emerald-600">
            {{ authStore.currentUser?.email }}
          </p>
        </div>

        <!-- Itens do menu -->
        <div class="py-2">
          <RouterLink to="/dashboard"
            class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center">
              <User class="w-4 h-4 text-white" />
            </div>
            <div class="text-left">
              <p class="font-medium">Dashboard</p>
              <p class="text-xs text-gray-500">Painel de controle</p>
            </div>
          </RouterLink>

          <button @click="signOut"
            class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center">
              <LogOut class="w-4 h-4 text-white" />
            </div>
            <div class="text-left">
              <p class="font-medium">Sair</p>
              <p class="text-xs text-gray-500">Fazer logout</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>