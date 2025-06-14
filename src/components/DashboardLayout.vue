<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50">
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-emerald-200/50 shadow-xl transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-center h-20 border-b border-emerald-200/50">
        <RouterLink to="/" class="flex items-center space-x-3 group">
          <div class="h-10 w-10 rounded-full p-0.5 bg-gradient-to-r from-green-400 to-yellow-400 shadow-lg group-hover:shadow-xl"
               style="filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.3));">
            <img alt="ModerAÍ logo" class="h-full w-full rounded-full object-cover"
                 src="../assets/logo-only-dog.jpg" />
          </div>
          <span class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:to-green-800 transition-all duration-300">
            ModerAÍ
          </span>
        </RouterLink>
      </div>

      <!-- Navigation -->
      <nav class="mt-8 px-4">
        <div class="space-y-2">
          <!-- Dashboard -->
          <RouterLink
            to="/dashboard"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 group"
            :class="{ 'bg-emerald-100 text-emerald-700 shadow-sm': $route.name === 'dashboard' }"
          >
            <BarChart3 class="w-5 h-5 mr-3" />
            <span class="font-medium">Dashboard</span>
          </RouterLink>

          <!-- Chat -->
          <RouterLink
            to="/chat"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 group"
            :class="{ 'bg-emerald-100 text-emerald-700 shadow-sm': $route.name === 'chat' }"
          >
            <MessageSquare class="w-5 h-5 mr-3" />
            <span class="font-medium">Chat</span>
          </RouterLink>

          <!-- API -->
          <RouterLink
            to="/api"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 group"
            :class="{ 'bg-emerald-100 text-emerald-700 shadow-sm': $route.name === 'api' }"
          >
            <Key class="w-5 h-5 mr-3" />
            <span class="font-medium">API</span>
          </RouterLink>

          <!-- Workspace -->
          <RouterLink
            to="/workspace"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 group"
            :class="{ 'bg-emerald-100 text-emerald-700 shadow-sm': $route.name === 'workspace' }"
          >
            <Briefcase class="w-5 h-5 mr-3" />
            <span class="font-medium">Workspace</span>
          </RouterLink>

          <!-- Configurações -->
          <RouterLink
            to="/config"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 group"
            :class="{ 'bg-emerald-100 text-emerald-700 shadow-sm': $route.name === 'config' }"
          >
            <Settings class="w-5 h-5 mr-3" />
            <span class="font-medium">Configurações</span>
          </RouterLink>
        </div>

        <!-- Documentação da API -->
        <div class="mt-8 pt-8 border-t border-emerald-200/50">
          <a
            href="https://docs.moderai.com.br"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 group"
          >
            <ExternalLink class="w-5 h-5 mr-3" />
            <span class="font-medium">Documentação da API</span>
          </a>
        </div>

        <!-- User Info -->
        <div class="mt-8 pt-8 border-t border-emerald-200/50">
          <div class="flex items-center px-4 py-3">
            <img
              :src="authStore.currentUser?.picture || '/default-avatar.png'"
              :alt="authStore.currentUser?.name || 'Usuário'"
              class="w-8 h-8 rounded-full mr-3"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-700 truncate">
                {{ authStore.currentUser?.name || 'Usuário' }}
              </p>
              <p class="text-xs text-gray-500 truncate">
                {{ authStore.currentUser?.email || 'email@exemplo.com' }}
              </p>
            </div>
          </div>
          <button
            @click="logout"
            class="w-full mt-2 flex items-center px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
          >
            <LogOut class="w-4 h-4 mr-2" />
            Sair
          </button>
        </div>
      </nav>
    </aside>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Main content -->
    <div class="lg:ml-64">
      <!-- Top bar -->
      <header class="bg-white/80 backdrop-blur-xl border-b border-emerald-200/50 shadow-sm">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center">
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
            >
              <Menu class="w-6 h-6" />
            </button>
            <h1 class="ml-4 lg:ml-0 text-2xl font-bold text-emerald-700">
              {{ pageTitle }}
            </h1>
          </div>
          
          <!-- Credits display -->
          <div class="flex items-center space-x-4">
            <div class="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
              <div class="flex items-center space-x-2">
                <Coins class="w-5 h-5 text-emerald-600" />
                <span class="text-sm font-medium text-emerald-700">
                  R$ {{ credits.balance.toFixed(2) }}
                </span>
                <span class="text-xs text-emerald-600">
                  ({{ credits.wordsRemaining }} palavras)
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { dashboardService } from '@/lib/services/dashboard';
import type { CreditData } from '@/types/dashboard';
import {
  BarChart3,
  MessageSquare,
  Key,
  Briefcase,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  Coins
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const sidebarOpen = ref(false);

// Credits data
const credits = ref<CreditData>({
  balance: 0,
  wordsRemaining: 0,
  promotionActive: false,
  promotionEndDate: '',
  promotionRate: 0
});

// Page title mapping
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    chat: 'Chat / Playground',
    api: 'Gerenciamento de API',
    workspace: 'Workspace',
    config: 'Configurações'
  };
  return titles[route.name as string] || 'Dashboard';
});

// Load credits data
const loadCredits = async () => {
  try {
    if (authStore.token) {
      dashboardService.setToken(authStore.token);
    }
    credits.value = await dashboardService.getCreditData();
  } catch (error) {
    console.error('Erro ao carregar dados de créditos:', error);
  }
};

// Logout function
const logout = () => {
  authStore.logout();
  router.push('/');
};

// Initialize
onMounted(() => {
  loadCredits();
});
</script>