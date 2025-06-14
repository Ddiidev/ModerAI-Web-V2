<script setup lang="ts">
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { useAuthStore } from './stores/auth';
import LoginButton from './components/LoginButton.vue';
import { Menu, X } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const showMobileMenu = ref(false);

// Verificar se está em uma página do dashboard
const isDashboardPage = computed(() => {
	const dashboardRoutes = ['dashboard', 'chat', 'api', 'workspace', 'config'];
	return dashboardRoutes.includes(route.name as string);
});

// Inicializar o store de autenticação
onMounted(() => {
	authStore.initAuth();
});

// Função para scroll suave para seções
const scrollToSection = (sectionId: string) => {
	// Fechar menu mobile ao navegar
	showMobileMenu.value = false;

	// Se não estiver na página inicial, navegar primeiro
	if (router.currentRoute.value.name !== 'home') {
		router.push('/').then(() => {
			setTimeout(() => {
				const element = document.getElementById(sectionId);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}, 100);
		});
	} else {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
};
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 text-gray-900">
		<!-- Cabeçalho -->
		<header v-if="!isDashboardPage"
			class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-emerald-200/50 shadow-lg">
			<div class="container mx-auto px-6 py-4">
				<div class="flex items-center justify-between">
					<!-- Logo -->
					<RouterLink to="/" class="flex items-center space-x-3 group">
						<div class="h-12 w-12 rounded-full p-0.5 bg-gradient-to-r from-green-400 to-yellow-400 shadow-lg group-hover:shadow-xl"
							style="filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.3));">
							<img alt="ModerAÍ logo" class="h-full w-full rounded-full object-cover"
								src="./assets/logo-only-dog.jpg" />
						</div>
						<span
							class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:to-green-800 transition-all duration-300">ModerAÍ</span>
					</RouterLink>

					<!-- Navegação principal (desktop) -->
					<nav class="hidden md:flex items-center space-x-8">
						<button @click="scrollToSection('problema')"
							class="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group cursor-pointer">
							Problema
							<span
								class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-600 group-hover:w-full transition-all duration-300"></span>
						</button>
						<button @click="scrollToSection('recursos')"
							class="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group cursor-pointer">
							Recursos
							<span
								class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-600 group-hover:w-full transition-all duration-300"></span>
						</button>
						<button @click="scrollToSection('demo')"
							class="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group cursor-pointer">
							Demonstração
							<span
								class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-600 group-hover:w-full transition-all duration-300"></span>
						</button>
						<button @click="scrollToSection('precos')"
							class="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group cursor-pointer">
							Preços
							<span
								class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-600 group-hover:w-full transition-all duration-300"></span>
						</button>
					</nav>

					<!-- Área direita com LoginButton e menu hamburger -->
					<div class="flex items-center gap-4">
						<!-- Botão de login/perfil (sempre visível) -->
						<LoginButton />

						<!-- Botão do menu hamburger (mobile) -->
						<button @click="showMobileMenu = !showMobileMenu"
							class="md:hidden p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-emerald-200/50 hover:bg-emerald-50 transition-all duration-300">
							<Menu v-if="!showMobileMenu" class="w-6 h-6 text-emerald-600" />
							<X v-else class="w-6 h-6 text-emerald-600" />
						</button>
					</div>
				</div>
			</div>

			<!-- Menu Mobile Dropdown -->
			<div v-if="showMobileMenu"
				class="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-emerald-200/50 shadow-xl z-40">
				<nav class="container mx-auto px-6 py-4">
					<div class="flex flex-col space-y-4">
						<button @click="scrollToSection('problema')"
							class="text-left text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-emerald-50">
							Problema
						</button>
						<button @click="scrollToSection('recursos')"
							class="text-left text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-emerald-50">
							Recursos
						</button>
						<button @click="scrollToSection('demo')"
							class="text-left text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-emerald-50">
							Demonstração
						</button>
						<button @click="scrollToSection('precos')"
							class="text-left text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-emerald-50">
							Preços
						</button>
					</div>
				</nav>
			</div>
		</header>

		<!-- Espaçador para compensar o cabeçalho fixo -->
		<div v-if="!isDashboardPage" class="pt-20"></div>

		<!-- Conteúdo principal -->
		<RouterView />
	</div>
</template>

<style>
/* Estilos globais adicionais */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
	font-family: 'Inter', sans-serif;
}

/* Gradiente de texto personalizado */
.text-gradient {
	background: linear-gradient(135deg, #059669 0%, #10b981 50%, #fbbf24 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	animation: gradient-shift 3s ease-in-out infinite;
}

@keyframes gradient-shift {

	0%,
	100% {
		background-position: 0% 50%;
	}

	50% {
		background-position: 100% 50%;
	}
}

/* Animação de flutuação */
.animate-float {
	animation: float 6s ease-in-out infinite;
}

@keyframes float {

	0%,
	100% {
		transform: translateY(0px);
	}

	50% {
		transform: translateY(-10px);
	}
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
	width: 8px;
}

::-webkit-scrollbar-track {
	background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
	background: linear-gradient(135deg, #059669, #10b981);
	border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
	background: linear-gradient(135deg, #047857, #059669);
}
</style>
