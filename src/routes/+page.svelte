<script lang="ts">
	// @ts-ignore
	import murphy from "murphyjs";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { signOut } from "@auth/sveltekit/client";
	import { Dna, Brain, Globe, Cpu, Menu, X } from "@lucide/svelte";
	import LoginButton from "../components/LoginButton.svelte";
	import DemonstrationChatModeration from "../components/DemonstrationChatModeration.svelte";
	import DemonstrationTwitchModeration from "../components/DemonstrationTwitchModeration.svelte";


	let mounted = false;
	let scrollY = 0;
	let mobileMenuOpen = false;

	let activeTab: "chat" | "twitch" = "chat";

	$: session = $page.data.session;
	$: isAuthenticated = !!(session && session.user);

	// Função para alternar o menu mobile
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Variáveis para animação de contagem
	let precisionCount = 0;
	let statesCount = 0;
	let contentsCount = 0;
	let countingStarted = false;

	// Função para animar contagem usando binding reativo do Svelte
	function animateCount(
		element: string,
		start: number,
		end: number,
		duration: number,
	): () => void {
		let startTime: number | null = null;
		let animationFrame: number;

		function animate(timestamp: number): void {
			if (!startTime) startTime = timestamp;
			const elapsed = timestamp - startTime;
			const progress = Math.min(elapsed / duration, 1);

			if (element === "precision") {
				precisionCount = start + (end - start) * progress;
			} else if (element === "states") {
				statesCount = Math.round(start + (end - start) * progress);
			} else if (element === "contents") {
				contentsCount = Math.round(start + (end - start) * progress);
			}

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		}

		animationFrame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationFrame);
	}

	function handleLogin() {
		// signIn('google'); // Poderia ser usado para login direto, mas vamos manter o redirecionamento para /login por enquanto
		goto("/login");
	}

	function handleSignOut(): void {
		signOut();
	}

	// Função para iniciar animação de contagem
	function startCounting() {
		if (countingStarted) return;
		countingStarted = true;

		// Inicia as animações de contagem
		animateCount("precision", 0, 99.97, 2000);
		animateCount("states", 0, 2, 1500);
		animateCount("contents", 0, 1000000, 3000);
	}

	onMount(() => {
		mounted = true;
		murphy.play();

		// Cria um Intersection Observer para detectar quando a seção de estatísticas está visível
		const statsSection = document.querySelector("#stats-section");
		if (statsSection) {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						startCounting();
						observer.disconnect();
					}
				},
				{ threshold: 0.2 },
			);

			observer.observe(statsSection);
		} else {
			// Fallback se o elemento não for encontrado
			setTimeout(startCounting, 1000);
		}

		return () => {};
	});

	const features = [
		{
			title: "DNA Brasileiro",
			icon: Dna,
			description:
				"Desenvolvido especificamente para ser especialista 🕵🏻 no contexto cultural e regional do Brasil",
		},
		{
			title: "Moderação Inteligente",
			icon: Brain,
			description:
				"3 fluxos de moderação paralelas para garantir a melhor assertividade do Brasil.",
		},
		{
			title: "Cobertura Nacional",
			icon: Globe,
			description:
				"Entende as nuances regionais de cada estado brasileiro",
		},
		{
			title: "API eficiente",
			icon: Cpu,
			description:
				"Integração simples, e com o MELHOR tempo ⌛ de resposta!",
		},
	];

	// Estado para controlar a exibição de informações de excedentes
	let showExcedentesInicial = false;
	let showExcedentesPro = false;

	const plans = [
		{
			name: "Inicial",
			icon: "🌱",
			price: "R$ 34,90",
			period: "/mês",
			description:
				"Para quem quer começar com moderação de qualidade! Longe de qualquer toxicidade.",
			features: [
				"750 mil palavras",
				"Suporte por e-mail",
				"Moderação com contexto de gírias e memes",
				"Ideal para bots, MVPs ou micro-SaaS",
			],
			whatsappMessages: "93,7 mil",
			excedenteCost: "R$ 0,000465",
			excedentExample: "10 mil palavras extras custam apenas R$ 4,65",
			callToAction: "Comece simples, sem complicação",
		},
		{
			name: "Pro",
			icon: "🚀",
			price: "R$ 164,90",
			period: "/mês",
			description:
				"Para quem já tem tração e não pode correr risco de informações tóxicas",
			features: [
				"5 milhões de palavras/mês",
				"Prioridade no suporte",
				"Ajustes finos no tom da moderação (agressivo, neutro, leve)",
				"Pronto para SaaS em crescimento e marketplaces",
			],
			whatsappMessages: "647 mil",
			excedenteCost: "R$ 0,000330",
			excedentExample: "10 mil palavras extras custam apenas R$ 3,30",
			callToAction: "Escale com confiança, do jeito BR",
			popular: true,
		},
		{
			name: "Enterprise",
			icon: "🏢",
			price: "Sob medida",
			period: "",
			description: "Grandes volumes? Casos complexos?",
			features: [
				"Volume personalizado",
				"Prioridade no suporte",
				"Ajustes finos no tom da moderação (agressivo, neutro, leve)",
				"Suporte prioritário na implantação do serviço ao seu negócio",
			],
			excedenteCost: "R$ 0,000200",
			callToAction: "Criamos juntos o plano ideal",
		},
	];

	const pricingTable = [
		{
			words: "750.000",
			whatsapp: "~93.750 mensagens",
			readingTime: "~83,4 horas (3 dias sem parar pra respirar 👃🏻)",
		},
		{
			words: "5.000.000",
			whatsapp: "~647.000 mensagens",
			readingTime:
				"~731,3 horas (30 dias piscando um olho 👁️ de cada vez)",
		},
	];
</script>

<svelte:head>
	<title>ModerAÍ - Moderação de Conteúdo com DNA Brasileiro</title>
	<meta
		name="description"
		content="Serviço de moderação de conteúdo ofensivo com DNA brasileiro. Entende região por região do Brasil."
	/>
	<meta
		property="og:image"
		content="https://raw.githubusercontent.com/Ddiidev/ModerAI-Web/refs/heads/main/images/og.png"
	/>
	<link
		rel="icon"
		href="https://raw.githubusercontent.com/Ddiidev/ModerAI-Web/refs/heads/main/images/favicon.ico"
	/>
	<script
		src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
		type="module"
	></script>
</svelte:head>

<svelte:window bind:scrollY />

<div
	class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-yellow-50"
>
	<!-- Header -->
	<header
		class="relative z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100"
		data-murphy="fade"
		data-murphy-duration="800"
	>
		<nav class="container mx-auto px-6 py-4">
			<div class="flex items-center justify-between">
				<div
					class="flex items-center space-x-3"
					data-murphy="fade-right"
					data-murphy-duration="600"
				>
					<img
						src="https://ddiidev.github.io/ModerAI-Web/images/logo-only-dog.jpg"
						alt="ModerAÍ Cachorro Caramelo"
						class="h-10 w-10 rounded-full object-cover shadow-lg"
					/>
					<span
						class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-yellow-600 bg-clip-text text-transparent"
					>
						ModerAÍ
					</span>
				</div>

				<div
					class="hidden md:flex items-center space-x-8"
					data-murphy="fade-left"
					data-murphy-duration="600"
				>
					<a
						href="#features"
						class="text-gray-700 hover:text-emerald-600">Recursos</a
					>
					<a
						href="#pricing"
						class="text-gray-700 hover:text-emerald-600">Preços</a
					>
					<a
						href="#contact"
						class="text-gray-700 hover:text-emerald-600">Contato</a
					>
					<LoginButton variant="accent" size="md" />
				</div>

				<!-- Mobile Menu Controls -->
				<div class="md:hidden flex items-center space-x-2">
					<!-- Login Button (Icon Only) -->
					<LoginButton variant="accent" size="sm" iconOnly={true} />

					<!-- Mobile Menu Button -->
					<button 
						class="flex items-center text-gray-700 hover:text-emerald-600 focus:outline-none" 
						on:click={toggleMobileMenu}
						aria-label="Toggle mobile menu"
					>
						{#if mobileMenuOpen}
							<X size={24} />
						{:else}
							<Menu size={24} />
						{/if}
					</button>
				</div>
			</div>

			<!-- Mobile Menu -->
			{#if mobileMenuOpen}
				<div class="md:hidden py-4 mt-2 bg-white/95 rounded-lg shadow-lg">
					<div class="flex flex-col space-y-4 px-4">
						<a
							href="#features"
							class="text-gray-700 hover:text-emerald-600 py-2 border-b border-gray-100"
							on:click={() => (mobileMenuOpen = false)}
						>Recursos</a
						>
						<a
							href="#pricing"
							class="text-gray-700 hover:text-emerald-600 py-2 border-b border-gray-100"
							on:click={() => (mobileMenuOpen = false)}
						>Preços</a
						>
						<a
							href="#contact"
							class="text-gray-700 hover:text-emerald-600 py-2 border-b border-gray-100"
							on:click={() => (mobileMenuOpen = false)}
						>Contato</a
						>
					</div>
				</div>
			{/if}
		</nav>
	</header>

	<!-- Hero Section -->
	<section
		class="relative py-20 overflow-hidden"
		data-murphy="fade"
		data-murphy-duration="1000"
	>
		<div
			class="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-yellow-600/5"
		></div>
		<div class="container mx-auto px-6 relative z-10">
			<div class="text-center max-w-4xl mx-auto">
				<div
					class="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-yellow-100 px-4 py-2 rounded-full text-sm font-medium text-emerald-700 mb-8"
					data-murphy="fade-down"
					data-murphy-duration="800"
					data-murphy-delay="200"
				>
					<img
						src="https://ddiidev.github.io/ModerAI-Web/images/logo-only-dog.jpg"
						alt="Cachorro Caramelo"
						class="w-6 h-6 rounded-full object-cover"
					/>
					<span>Feito no Brasil, para o Brasil</span>
				</div>

				<h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
					<span>
						<div class="flex justify-center">
							{#each "ModerAÍ" as char, i}
								<p
									class="bg-gradient-to-r from-emerald-600 to-yellow-600 bg-clip-text text-transparent"
									data-murphy="bottom-to-top"
									data-murphy-ease="linear"
									data-murphy-animation-delay={100 + i * 100}
								>
									{char}
								</p>
							{/each}
						</div>
					</span>
					<br />
					<span
						class="text-gray-900"
						data-murphy="fade-up"
						data-murphy-delay="700"
						data-murphy-duration="800"
						>A Moderação que Entende o Brasil</span
					>
				</h1>

				<p
					class="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto"
					data-murphy="fade-up"
					data-murphy-delay="900"
					data-murphy-duration="800"
				>
					Serviço de moderação de conteúdo ofensivo com DNA
					brasileiro. Nossa IA entende as nuances culturais e
					regionais de cada canto do país.
				</p>

				<div
					class="flex flex-col sm:flex-row gap-4 justify-center"
					data-murphy="fade-up"
					data-murphy-delay="1100"
					data-murphy-duration="800"
				>
					<button
						class="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
					>
						Teste Gratuitamente
					</button>
					<button
						class="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300"
					>
						Ver Demonstração
					</button>
				</div>
			</div>
		</div>

		<!-- Floating elements with scroll animation -->
		<div
			class="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-emerald-400 to-yellow-400 rounded-full opacity-70"
			data-murphy="fade-right"
			data-murphy-duration="1200"
			data-murphy-delay="300"
			data-murphy-distance="50"
		></div>
		<div
			class="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-emerald-400 rounded-full opacity-40"
			data-murphy="fade-left"
			data-murphy-duration="1200"
			data-murphy-delay="500"
			data-murphy-distance="50"
		></div>
	</section>

	<!-- Demonstration Section -->
	<section
		class="py-20 bg-white"
		data-murphy="fade"
		data-murphy-duration="800"
	>
		<div class="container mx-auto px-6">
			<div class="text-center max-w-4xl mx-auto mb-16">
				<h2
					class="text-4xl font-bold mb-6 text-gray-800"
					data-murphy="fade-up"
					data-murphy-duration="800"
					data-murphy-delay="200"
				>
					Veja a Moderação em Ação
				</h2>
				<p
					class="text-xl text-gray-600"
					data-murphy="fade-up"
					data-murphy-duration="800"
					data-murphy-delay="400"
				>
					Conheça exemplos práticos de onde aplicar o ModerAÍ. Embora
					seja uma solução de uso amplo, veja como funciona em
					cenários específicos como moderação de chat e streams.
				</p>
			</div>

			<div
				class="bg-white rounded-lg p-8 shadow-lg border border-gray-100"
			>
				<h3 class="text-2xl font-bold text-gray-800 mb-4">
					Exemplos de Aplicação
				</h3>
				<p class="text-lg text-gray-600 mb-8">
					Veja demonstrações de como o ModerAÍ pode ser aplicado em
					diferentes contextos. Estes são exemplos visuais que mostram
					o potencial da nossa solução.
				</p>

				<!-- Tabs Navigation -->
				<div class="flex mb-8 bg-gray-100 rounded-lg p-2">
					<button
						class="flex-1 py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 {activeTab ===
						'chat'
							? 'bg-gradient-to-r from-emerald-500 to-yellow-400 text-white shadow-lg'
							: 'text-gray-600 hover:text-gray-800 hover:bg-white'}"
						on:click={() => (activeTab = "chat")}
					>
						Moderação Chat
					</button>
					<button
						class="flex-1 py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 {activeTab ===
						'twitch'
							? 'bg-gradient-to-r from-emerald-500 to-yellow-400 text-white shadow-lg'
							: 'text-gray-600 hover:text-gray-800 hover:bg-white'}"
						on:click={() => (activeTab = "twitch")}
					>
						Moderação Twitch
					</button>
				</div>

				<!-- Tab Content -->
				{#if activeTab === "twitch"}
					<DemonstrationTwitchModeration />
				{:else if activeTab === "chat"}
					<DemonstrationChatModeration />
				{/if}
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section
		class="py-20 bg-white"
		data-murphy="fade"
		data-murphy-duration="800"
		data-murphy-root-margin="-100px"
	>
		<div class="container mx-auto px-6">
			<div class="text-center max-w-4xl mx-auto mb-16">
				<h2
					class="text-4xl font-bold mb-6 text-gray-800"
					data-murphy="fade-up"
					data-murphy-duration="800"
					data-murphy-delay="200"
				>
					Por que escolher o ModerAÍ?
				</h2>
				<p
					class="text-xl text-gray-600"
					data-murphy="fade-up"
					data-murphy-duration="800"
					data-murphy-delay="400"
				>
					Nossa tecnologia foi desenvolvida especificamente para o
					contexto brasileiro, entendendo as nuances culturais e
					regionais do país.
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
				{#each features as feature, i}
					<div
						class="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1"
						data-murphy="fade-up"
						data-murphy-duration="800"
						data-murphy-delay={200 * (i + 1)}
					>
						<div
							class="w-16 h-16 bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-full flex items-center justify-center mb-6 transition-transform duration-300"
						>
							<svelte:component
								this={feature.icon}
								class="w-8 h-8 text-white"
							/>
						</div>
						<h3 class="text-xl font-bold text-gray-800 mb-2">
							{feature.title}
						</h3>
						<p class="text-gray-600">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Technology Section -->
	<section
		class="py-20 bg-white"
		data-murphy="fade"
		data-murphy-duration="800"
		data-murphy-root-margin="-100px"
	>
		<div class="container mx-auto px-6">
			<div
				class="text-center mb-16"
				data-murphy="fade-up"
				data-murphy-duration="800"
			>
				<h2 class="text-4xl font-bold text-gray-900 mb-6">
					Tecnologia Multicamadas de Ponta
				</h2>
				<p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
					Nossa plataforma multicamadas de moderação garante máxima
					performance e precisão contextual:
				</p>
			</div>

			<div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
				<div
					class="flex flex-col items-start bg-gradient-to-r from-emerald-50 to-yellow-50 p-8 rounded-2xl border border-emerald-100 shadow-lg"
					data-murphy="fade-right"
					data-murphy-duration="800"
					data-murphy-delay="200"
					data-murphy-root-margin="-100px"
				>
					<div
						class="w-16 h-16 bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 flex-shrink-0"
					>
						1
					</div>
					<div>
						<h3 class="text-2xl font-bold text-gray-900 mb-3">
							Análise Estrutural Rápida
						</h3>
						<p class="text-gray-700 leading-relaxed">
							Identificamos variações e padrões conhecidos de
							conteúdo ofensivo com um algoritmo de alta
							performance, ideal para detecções ágeis e precisas. <span
								class="text-emerald-600 font-medium"
								>(Referência ao Jaro Similarity)</span
							>
						</p>
					</div>
				</div>

				<div
					class="flex flex-col items-start bg-gradient-to-r from-yellow-50 to-emerald-50 p-8 rounded-2xl border border-yellow-100 shadow-lg"
					data-murphy="fade-up"
					data-murphy-duration="800"
					data-murphy-delay="400"
					data-murphy-root-margin="-100px"
				>
					<div
						class="w-16 h-16 bg-gradient-to-r from-yellow-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 flex-shrink-0"
					>
						2
					</div>
					<div>
						<h3 class="text-2xl font-bold text-gray-900 mb-3">
							Inteligência Vetorial Avançada
						</h3>
						<p class="text-gray-700 leading-relaxed">
							Analisamos o significado e a intenção por trás do
							texto através da detecção baseada em vetores,
							capturando nuances e contextos mais complexos.
						</p>
					</div>
				</div>

				<div
					class="flex flex-col items-start bg-gradient-to-r from-emerald-50 to-yellow-50 p-8 rounded-2xl border border-emerald-100 shadow-lg"
					data-murphy="fade-left"
					data-murphy-duration="800"
					data-murphy-delay="600"
					data-murphy-root-margin="-100px"
				>
					<div
						class="w-16 h-16 bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 flex-shrink-0"
					>
						3
					</div>
					<div>
						<h3 class="text-2xl font-bold text-gray-900 mb-3">
							Moderação Contextual com LLM
						</h3>
						<p class="text-gray-700 leading-relaxed">
							Nossos Modelos de Linguagem de Larga Escala (LLMs)
							oferecem a mais profunda compreensão contextual,
							identificando formas sutis e novas de conteúdo
							inadequado, assegurando uma moderação fiel e
							inteligente.
						</p>
					</div>
				</div>
			</div>

			<div class="text-center mt-12">
				<div
					class="bg-gradient-to-r from-emerald-500/40 to-yellow-500/40 text-gray-800 p-6 rounded-2xl shadow-lg max-w-4xl mx-auto border border-emerald-100"
					data-murphy="fade-up"
					data-murphy-duration="800"
					data-murphy-delay="800"
					data-murphy-root-margin="-100px"
				>
					<h3 class="text-2xl font-bold mb-4">
						💡 Diferencial Brasileiro
					</h3>
					<p class="text-lg leading-relaxed">
						Tudo isso entendendo o nosso contexto brasileiro melhor
						e
						<span class="font-bold"
							>custando menos que APIs de moderação de conteúdo
							global.</span
						>
					</p>
				</div>
			</div>
		</div>
	</section>
	<section
		class="py-20 bg-gradient-to-br from-emerald-50 to-yellow-50 overflow-hidden"
		data-murphy="fade"
		data-murphy-duration="800"
		data-murphy-root-margin="-100px"
	>
		<div class="container mx-auto px-6">
			<div class="flex flex-col lg:flex-row items-center justify-between">
				<div
					class="lg:w-1/2 mb-12 lg:mb-0"
					data-murphy="fade-right"
					data-murphy-duration="800"
					data-murphy-delay="200"
				>
					<h2 class="text-4xl font-bold text-gray-900 mb-6">
						Conhece o Nosso Mascote?
					</h2>
					<p class="text-xl text-gray-600 mb-6 leading-relaxed">
						Nosso querido cachorro caramelo representa a brasilidade
						e a confiança que o ModerAÍ traz para a moderação de
						conteúdo. Assim como ele é protetor e amigo, nossa IA
						protege suas comunidades online.
					</p>
					<div
						class="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-lg"
					>
						<img
							src="https://ddiidev.github.io/ModerAI-Web/images/logo-only-dog.jpg"
							alt="Cachorro Caramelo ModerAÍ"
							class="w-16 h-16 rounded-full object-cover shadow-md"
						/>
						<div>
							<h3 class="font-bold text-gray-900">Caramelo</h3>
							<p class="text-gray-600">
								Guardião Digital do Brasil
							</p>
						</div>
					</div>
				</div>

				<div
					class="lg:w-1/2 flex justify-end"
					data-murphy="fade-right"
					data-murphy-duration="1200"
					data-murphy-delay="400"
					data-murphy-distance="100"
				>
					<div
						class="transform transition-transform duration-5000 animate-dog-walk"
					>
						<dotlottie-player
							src="https://lottie.host/a9eed732-34ee-486b-ad27-a2184be7570c/YqodaXWRY9.lottie"
							background="transparent"
							speed="1"
							style="width: 300px; height: 300px"
							loop
							autoplay
						></dotlottie-player>
					</div>
				</div>
			</div>
		</div>
	</section>
	<section
		class="py-20 bg-gradient-to-r from-emerald-900 to-yellow-900 text-white"
		data-murphy="fade"
		data-murphy-duration="800"
		data-murphy-root-margin="-100px"
	>
		<div class="container mx-auto px-6">
			<div class="text-center max-w-4xl mx-auto">
				<h2
					class="text-4xl font-bold mb-6"
					data-murphy="fade-up"
					data-murphy-duration="800"
					data-murphy-delay="200"
				>
					Confiança que Fala Português
				</h2>
				<p
					class="text-xl opacity-90 mb-12"
					data-murphy="fade-up"
					data-murphy-duration="800"
					data-murphy-delay="400"
				>
					Desenvolvido por brasileiros, para brasileiros. Entendemos a
					diferença entre "massa" em São Paulo e "massa" no Nordeste.
					Nossa IA foi treinada com dados exclusivamente brasileiros.
				</p>

				<div class="grid md:grid-cols-3 gap-8 mt-16">
					<div
						class="text-center"
						data-murphy="fade-up"
						data-murphy-duration="800"
						data-murphy-delay="600"
					>
						<div class="text-4xl font-bold mb-2">
							{precisionCount.toFixed(2)}%
						</div>
						<div class="text-emerald-200">
							Precisão na Moderação
						</div>
					</div>
					<div
						class="text-center"
						data-murphy="fade-up"
						data-murphy-duration="800"
						data-murphy-delay="800"
					>
						<a href="\#" class="group">
							<div
								class="text-4xl font-bold mb-2 group-hover:text-emerald-300 transition-colors"
							>
								{statesCount}
							</div>
							<div class="text-emerald-200 mb-1">
								Estados Cobertos
							</div>
							<div
								class="text-sm text-emerald-300 underline hover:text-emerald-100 transition-colors"
							>
								Solicite o seu estado
							</div>
						</a>
					</div>
					<div
						class="text-center"
						data-murphy="fade-up"
						data-murphy-duration="800"
						data-murphy-delay="1000"
					>
						<div class="text-4xl font-bold mb-2">
							{contentsCount.toLocaleString("pt-BR")}+
						</div>
						<div class="text-emerald-200">Conteúdos Moderados</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Pricing Section -->
	<section
		id="pricing"
		class="py-20 bg-gray-50"
		data-murphy="fade"
		data-murphy-duration="800"
		data-murphy-root-margin="-100px"
	>
		<div class="container mx-auto px-6">
			<div
				class="text-center mb-16"
				data-murphy="fade-up"
				data-murphy-duration="800"
				data-murphy-root-margin="-100px"
			>
				<h2 class="text-4xl font-bold text-gray-900 mb-4">
					Nossos Planos
				</h2>
				<h3 class="text-xl text-gray-700 mb-10">
					Moderação inteligente com o jeitinho brasileiro
				</h3>

				<!-- Banner de Crédito Grátis -->
				<div
					class="bg-gradient-to-r from-emerald-100 to-yellow-100 border-2 border-emerald-500 rounded-lg p-4 mb-10 max-w-3xl mx-auto"
				>
					<div class="flex items-center justify-center gap-3">
						<div class="text-3xl">🎁</div>
						<p class="text-lg font-medium text-emerald-800">
							Ganhe <span class="font-bold">R$ 5 de crédito</span>
							ao se cadastrar!
							<span class="text-gray-700"
								>(equivale a 11 mil palavras, estimado a 1.375
								mensagens do WhatsApp ou 1 hora de leitura)</span
							>
						</p>
					</div>
				</div>

				<p class="text-center text-lg mb-16">
					Escolha o plano que combina com seu produto
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
				{#each plans as plan, i}
					<div
						class="bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex flex-col"
						class:border-emerald-500={plan.popular}
						class:border-gray-200={!plan.popular}
						class:scale-105={plan.popular}
						class:relative={plan.popular}
						data-murphy="fade-up"
						data-murphy-duration="800"
						data-murphy-delay={200 + i * 200}
						data-murphy-root-margin="-100px"
						data-murphy-easing={plan.popular
							? "bounce"
							: "ease-in-out"}
					>
						{#if plan.popular}
							<div
								class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full font-bold text-sm"
							>
								Mais Popular
							</div>
						{/if}

						<div class="text-center mb-4">
							<div class="text-4xl mb-2">{plan.icon}</div>
							<h3 class="text-2xl font-bold text-gray-900 mb-2">
								{plan.name}
							</h3>
							<div class="mb-4">
								<span
									class="text-4xl font-bold text-emerald-600"
									>{plan.price}</span
								>
								<span class="text-gray-600">{plan.period}</span>
							</div>
							<p class="text-gray-600 italic mb-6">
								{plan.description}
							</p>
						</div>

						<ul class="space-y-3 mb-6 flex-grow">
							{#each plan.features as feature}
								<li class="flex items-center space-x-3">
									<span class="text-emerald-500">✔️</span>
									<span class="text-gray-700">{feature}</span>
								</li>
							{/each}
						</ul>

						{#if plan.whatsappMessages}
							<p class="text-gray-500 text-sm mb-4 text-center">
								Modere até <strong
									>{plan.whatsappMessages}</strong
								> msg do WhatsApp
							</p>
						{/if}

						{#if plan.excedenteCost && plan.name !== "Enterprise"}
							<div class="mt-2 mb-3">
								<button
									class="text-emerald-600 text-sm flex items-center gap-1 hover:underline mx-auto"
									on:click={() => {
										if (plan.name === "Inicial") {
											showExcedentesInicial =
												!showExcedentesInicial;
										} else if (plan.name === "Pro") {
											showExcedentesPro =
												!showExcedentesPro;
										}
									}}
								>
									<span>
										{#if (plan.name === "Inicial" && !showExcedentesInicial) || (plan.name === "Pro" && !showExcedentesPro)}
											➕ Ver custo de palavras excedentes
										{:else}
											➖ Ocultar custo de palavras
											excedentes
										{/if}
									</span>
								</button>
								{#if (plan.name === "Inicial" && showExcedentesInicial) || (plan.name === "Pro" && showExcedentesPro)}
									<div
										class="mt-2 p-3 bg-emerald-50 rounded-md text-sm text-gray-700 text-left"
									>
										<p>
											Custo por palavra que excede o
											plano: <strong
												>{plan.excedenteCost}</strong
											>
										</p>
										<p class="mt-1">
											<em>Exemplo:</em>
											{plan.excedentExample}
										</p>
									</div>
								{/if}
							</div>
						{/if}

						{#if plan.name === "Enterprise"}
							<p class="text-gray-500 text-sm mb-4 text-center">
								Custo por palavra excedente: <strong
									>{plan.excedenteCost}</strong
								>
							</p>
						{/if}

						{#if plan.name === "Inicial"}
							<div class="flex gap-3 w-full mb-4">
								<button
									class="flex-1 bg-gray-100 text-gray-800 px-4 py-3 rounded shadow-md hover:bg-gray-200 transition-all duration-300 font-semibold"
								>
									Testar grátis
								</button>
								<button
									class="bg-gradient-to-r from-emerald-500 to-yellow-400 text-white px-6 py-3 rounded shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
								>
									Assinar
								</button>
							</div>
						{:else if plan.name === "Pro"}
							<button
								class="w-full bg-gradient-to-r from-emerald-500 to-yellow-400 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg mb-4"
							>
								Assinar
							</button>
						{:else}
							<button
								class="w-full bg-gradient-to-r from-emerald-500 to-yellow-400 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg mb-4"
							>
								Fale Conosco
							</button>
						{/if}

						<p class="text-emerald-600 font-medium text-center">
							➡️ {plan.callToAction}
						</p>
					</div>
				{/each}
			</div>

			<!-- Tabela Comparativa -->
			<div class="overflow-x-auto mb-10 mt-16">
				<table
					class="min-w-full bg-white rounded-xl shadow text-gray-800 mx-auto"
				>
					<caption class="text-sm text-gray-500 mb-2 mt-1">
						Valores aproximados. Estimativas para WhatsApp (8
						palavras/mensagem, 180 palavras/minuto de leitura).
					</caption>
					<thead>
						<tr>
							<th class="px-4 py-3 border-b text-left"
								>Total de Palavras</th
							>
							<th class="px-4 py-3 border-b text-left"
								>Mensagens WhatsApp</th
							>
							<th class="px-4 py-3 border-b text-left"
								>Tempo de Leitura (em horas e dias)</th
							>
						</tr>
					</thead>
					<tbody>
						{#each pricingTable as row, i}
							<tr class="hover:bg-emerald-50">
								<td
									class="px-4 py-2 {i <
									pricingTable.length - 1
										? 'border-b'
										: ''}">{row.words}</td
								>
								<td
									class="px-4 py-2 {i <
									pricingTable.length - 1
										? 'border-b'
										: ''}">{row.whatsapp}</td
								>
								<td
									class="px-4 py-2 {i <
									pricingTable.length - 1
										? 'border-b'
										: ''}">{row.readingTime}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<p class="mt-8 text-center text-gray-700">
				Modelo de precificação: <strong
					>baseado em palavras processadas</strong
				>. Escolha o plano conforme o volume de textos que deseja
				moderar. Para volumes maiores ou necessidades específicas, entre
				em contato para uma proposta personalizada.
			</p>
		</div>
	</section>

	<!-- CTA Section -->
	<section
		class="py-20 bg-gradient-to-r from-emerald-600 to-yellow-600 text-white"
	>
		<div class="container mx-auto px-6 text-center">
			<h2
				class="text-4xl font-bold mb-6"
				data-murphy="fade-up"
				data-murphy-duration="800"
				data-murphy-delay="200"
			>
				Pronto para Moderar com Autoridade?
			</h2>
			<p
				class="text-xl opacity-90 mb-8 max-w-2xl mx-auto"
				data-murphy="fade-up"
				data-murphy-duration="800"
				data-murphy-delay="400"
			>
				Junte-se às empresas que confiam no ModerAÍ para manter suas
				plataformas seguras e respeitosas.
			</p>
			<button
				class="bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
				data-murphy="fade-up"
				data-murphy-duration="800"
				data-murphy-delay="600"
				data-murphy-easing="bounce"
			>
				Começar Teste Gratuito
			</button>
		</div>
	</section>

	<!-- Footer -->
	<footer id="contact" class="bg-gray-900 text-white py-16">
		<div class="container mx-auto px-6">
			<div class="grid md:grid-cols-4 gap-8">
				<div class="col-span-2">
					<div class="flex items-center space-x-3 mb-6">
						<img
							src="https://ddiidev.github.io/ModerAI-Web/images/logo-only-dog.jpg"
							alt="ModerAÍ Cachorro Caramelo"
							class="h-8 w-8 rounded-full object-cover shadow-lg"
						/>
						<span class="text-xl font-bold">ModerAÍ</span>
					</div>
					<p class="text-gray-400 mb-6 max-w-md">
						A solução de moderação de conteúdo mais brasileira do
						mercado. Protegendo comunidades digitais com
						inteligência artificial nacional.
					</p>
					<div class="flex space-x-4">
						<a
							href="\#"
							class="text-gray-400 hover:text-emerald-400 transition-colors"
							>LinkedIn</a
						>
						<a
							href="\#"
							class="text-gray-400 hover:text-emerald-400 transition-colors"
							>Twitter</a
						>
						<a
							href="\#"
							class="text-gray-400 hover:text-emerald-400 transition-colors"
							>GitHub</a
						>
					</div>
				</div>

				<div>
					<h3 class="font-bold mb-4">Produto</h3>
					<ul class="space-y-2">
						<li>
							<a
								href="\#"
								class="text-gray-400 hover:text-white transition-colors"
								>Recursos</a
							>
						</li>
						<li>
							<a
								href="\#"
								class="text-gray-400 hover:text-white transition-colors"
								>Preços</a
							>
						</li>
						<li>
							<a
								href="\#"
								class="text-gray-400 hover:text-white transition-colors"
								>API</a
							>
						</li>
						<li>
							<a
								href="\#"
								class="text-gray-400 hover:text-white transition-colors"
								>Documentação</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="font-bold mb-4">Suporte</h3>
					<ul class="space-y-2">
						<li>
							<a
								href="\#"
								class="text-gray-400 hover:text-white transition-colors"
								>Contato</a
							>
						</li>
						<li>
							<a
								href="\#"
								class="text-gray-400 hover:text-white transition-colors"
								>FAQ</a
							>
						</li>
						<li>
							<a
								href="\#"
								class="text-gray-400 hover:text-white transition-colors"
								>Status</a
							>
						</li>
						<li>
							<a
								href="\#"
								class="text-gray-400 hover:text-white transition-colors"
								>Termos</a
							>
						</li>
					</ul>
				</div>
			</div>

			<div
				class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
			>
				<p>
					&copy; 2024 ModerAÍ. Todos os direitos reservados. Feito com
					💚 no Brasil.
				</p>
			</div>
		</div>
	</footer>
</div>

<style>
	@keyframes dogWalk {
		0% {
			transform: translateX(100px);
		}
		100% {
			transform: translateX(0);
		}
	}

	.animate-dog-walk {
		animation: dogWalk 3s ease-in-out infinite alternate;
	}
</style>
