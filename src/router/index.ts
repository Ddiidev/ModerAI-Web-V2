import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import ChatView from '../views/ChatView.vue'
import ApiView from '../views/ApiView.vue'
import WorkspaceView from '../views/WorkspaceView.vue'
import ConfigView from '../views/ConfigView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
      meta: { requiresAuth: true }
    },
    {
      path: '/api',
      name: 'api',
      component: ApiView,
      meta: { requiresAuth: true }
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: WorkspaceView,
      meta: { requiresAuth: true }
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView,
      meta: { requiresAuth: true }
    },
    {
      path: '/auth/callback/google',
      name: 'googleCallback',
      component: {
        render: () => null,
        
        beforeRouteEnter(to, from, next) {
          // Extrair o código da URL
          const code = to.query.code as string;
          const authStore = useAuthStore();
          
          if (code) {
            // Processar o callback do Google
            authStore.handleGoogleCallback(code)
              .then(() => {
                // Redirecionar para o dashboard após autenticação
                next('/dashboard');
              })
              .catch(() => {
                // Em caso de erro, redirecionar para a página inicial
                next('/');
              });
          } else {
            // Se não houver código, redirecionar para a página inicial
            next('/');
          }
        }
      }
    }
  ],
  // Comportamento de rolagem para o topo ao mudar de página
  scrollBehavior() {
    return { top: 0 }
  }
})

// Guard de navegação para rotas protegidas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirecionar para home se não estiver autenticado
    next('/')
  } else {
    next()
  }
})

export default router
