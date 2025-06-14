<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

// Interface para mensagens de chat
interface MessageChat {
	id: string;
	author: string;
	content: string;
	avatar: string;
	delay: number;
	isOffensive?: boolean;
	isModerAI?: boolean;
	replaceMessageId?: string;
	replacementContent?: string;
}

// Referências para elementos do DOM
const messagesContainer = ref<HTMLElement | null>(null);

// Estado
const isAnimating = ref(false);
const messageIndex = ref(0);
const messages = ref<MessageChat[]>([]);

// Sequência de chat para demonstração
const chatSequence: MessageChat[] = [
	{
		id: "1",
		author: "Maria (Atendente)",
		content: "Olá! Bem-vindo ao suporte da BaiãoFood! Como posso ajudá-lo hoje?",
		avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/64/28.jpg",
		delay: 1500
	},
	{
		id: "2",
		author: "Carlos",
		content: "Oi Maria, fiz um pedido há 2 horas e ainda não chegou. Vocês têm previsão?",
		avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/64/5.jpg",
		delay: 2500
	},
	{
		id: "3",
		author: "Maria (Atendente)",
		content: "Entendo sua preocupação, Carlos. Vou verificar o status do seu pedido. Pode me informar o número?",
		avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/64/28.jpg",
		delay: 2000
	},
	{
		id: "4",
		author: "Carlos",
		content: "Que atendimento de merda! Vocês são incompetentes, sua burra!",
		avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/64/5.jpg",
		delay: 1800,
		isOffensive: true,
		replaceMessageId: "4",
		replacementContent: "A mensagem do Carlos foi removida por conter conteúdo ofensivo."
	},
	{
		id: "6",
		author: "Maria (Atendente)",
		content: "Obrigada, ModerAÍ! Carlos, estou aqui para ajudar. Vamos resolver seu pedido com respeito mútuo. 😊",
		avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/64/28.jpg",
		delay: 1500
	}
];

// Função para adicionar mensagens com atraso
const addMessage = async (message: MessageChat) => {
	messages.value.push(message);
	await nextTick();

	// Se a mensagem atual tiver uma mensagem para substituir
	if (message.replaceMessageId && message.replacementContent) {
		const indexToReplace = messages.value.findIndex(msg => msg.id === message.replaceMessageId);
		if (indexToReplace !== -1) {
			// Espera 1 segundo antes de remover a mensagem ofensiva e adicionar a de substituição
			setTimeout(() => {
				messages.value.splice(indexToReplace, 1); // Remove a mensagem ofensiva
				messages.value.splice(indexToReplace, 0, {
					id: `moderated-${message.replaceMessageId}`,
					author: "ModerAÍ 🤖", // Autor da mensagem de substituição
					content: message.replacementContent ?? "",
					avatar: "../assets/logo-only-dog.jpg", // Avatar do ModerAÍ
					delay: 0,
					isModerAI: true
				});
				nextTick(() => {
					if (messagesContainer.value) {
						messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
					}
				});
			}, 1000); // 1 segundo para a mensagem ofensiva ser visível
		}
	}

	// Scroll para a última mensagem
	if (messagesContainer.value) {
		messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
	}
};

// Função para iniciar a demonstração
const startDemo = async () => {
	if (isAnimating.value) return;

	isAnimating.value = true;
	messages.value = [];
	messageIndex.value = 0;

	for (const message of chatSequence) {
		await new Promise(resolve => setTimeout(resolve, message.delay));
		await addMessage(message);
	}

	isAnimating.value = false;

	// Aguarda 3 segundos e reinicia automaticamente
	setTimeout(() => {
		startDemo();
	}, 3000);
};

// Função para parar a demonstração
const stopDemo = () => {
	isAnimating.value = false;
	messages.value = [];
	messageIndex.value = 0;
};

// Iniciar demonstração automaticamente quando o componente for montado
onMounted(() => {
	startDemo();
});
</script>

<template>
	<section class="py-12 md:py-16 relative overflow-hidden">

		<!-- Círculos decorativos com blur -->
		<div class="absolute top-10 left-20 w-96 h-96 bg-gradient-to-r from-green-400/8 to-emerald-500/8 rounded-full filter blur-3xl animate-pulse"
			style="animation-delay: 2s;"></div>
		<div class="absolute bottom-10 right-20 w-80 h-80 bg-gradient-to-l from-yellow-400/10 to-amber-500/10 rounded-full filter blur-3xl animate-pulse"
			style="animation-delay: 4s;"></div>

		<!-- Elementos geométricos decorativos -->
		<div class="absolute top-1/4 right-1/3 w-24 h-24 border border-green-400/20 rounded-full animate-spin"
			style="animation-duration: 25s;"></div>
		<div class="absolute bottom-1/3 left-1/4 w-20 h-20 border border-yellow-400/20 rounded-lg rotate-45 animate-bounce"
			style="animation-duration: 5s;"></div>

		<div class="container mx-auto px-6 relative z-10">
			<!-- Container da demonstração -->
			<div class="max-w-4xl mx-auto">
				<!-- Simulador de chat -->
				<div
					class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-200/50 overflow-hidden">
					<!-- Cabeçalho do chat -->
					<div class="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-4">
								<div
									class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden relative">
									<span class="absolute text-2xl">🍽️</span>
								</div>
								<div>
									<h3 class="text-xl font-bold">BaiãoFood - Suporte</h3>
									<p class="text-emerald-100 text-sm">Protegido pela ModerAÍ</p>
								</div>
							</div>

							<!-- Status da moderação -->
							<div class="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
								<div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
								<span class="text-sm font-medium">Moderação Ativa</span>
							</div>
						</div>
					</div>

					<!-- Área de mensagens -->
					<div ref="messagesContainer"
						class="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/50 to-emerald-50/30">
						<div v-for="message in messages" :key="message.id" class="flex gap-3 animate-fade-in" :class="{
							'justify-end': message.isModerAI,
							'opacity-50': message.isOffensive && !message.isModerAI
						}">
							<!-- Avatar -->
							<div v-if="!message.isModerAI"
								class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-lg">
								<img :src="message.avatar" :alt="message.author" class="w-full h-full object-cover" />
							</div>

							<!-- Mensagem -->
							<div class="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-300"
								:class="{
									'bg-gradient-to-r from-emerald-500 to-green-600 text-white': message.isModerAI,
									'bg-white border border-gray-200 text-gray-800': !message.isModerAI && !message.isOffensive,
									'bg-red-100 border border-red-300 text-red-800': message.isOffensive && !message.isModerAI
								}">
								<!-- Nome do autor -->
								<div v-if="!message.isModerAI" class="text-xs font-semibold mb-1" :class="{
									'text-gray-600': !message.isOffensive,
									'text-red-600': message.isOffensive
								}">
									{{ message.author }}
								</div>

								<!-- Conteúdo da mensagem -->
								<div class="text-sm leading-relaxed" :class="{
									'line-through': message.isOffensive && !message.isModerAI
								}">
									{{ message.content }}
								</div>

								<!-- Badge da ModerAI -->
								<div v-if="message.isModerAI" class="flex items-center gap-2 mt-2">
									<div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"></path>
										</svg>
									</div>
									<span class="text-xs font-medium text-white/90">ModerAÍ</span>
								</div>
							</div>

							<!-- Avatar da ModerAI -->
							<div v-if="message.isModerAI"
								class="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white">
								<img src="../assets/logo-only-dog.jpg" alt="ModerAÍ Avatar"
									class="w-full h-full object-cover rounded-full" />
							</div>
						</div>

						<!-- Mensagem de carregamento quando está animando -->
						<div v-if="isAnimating" class="flex gap-3 animate-pulse">
							<div class="w-10 h-10 bg-gray-300 rounded-full"></div>
							<div class="bg-gray-200 rounded-2xl px-4 py-3">
								<div class="flex gap-1">
									<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
									<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
										style="animation-delay: 0.1s;"></div>
									<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
										style="animation-delay: 0.2s;"></div>
								</div>
							</div>
						</div>
					</div>
				</div>


			</div>
		</div>

	</section>
</template>

<style scoped>
@keyframes fade-in {
	from {
		opacity: 0;
		transform: translateY(10px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in {
	animation: fade-in 0.5s ease-out;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
	width: 6px;
}

::-webkit-scrollbar-track {
	background: #f1f5f9;
	border-radius: 3px;
}

::-webkit-scrollbar-thumb {
	background: linear-gradient(to bottom, #10b981, #059669);
	border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
	background: linear-gradient(to bottom, #059669, #047857);
}
</style>