<script lang="ts">
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import LoginButton from "../../components/LoginButton.svelte";
	import Button from "../../components/Button.svelte";
	// @ts-ignore
	import murphy from "murphyjs";

	export let data;

	$: session = data.session;

	onMount(() => {
		murphy.play();
	});
</script>

<svelte:head>
	<title>Área Protegida - ModerAI</title>
	<meta
		name="description"
		content="Área protegida da ModerAI - Acesso restrito a usuários autenticados"
	/>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100"
>
	<!-- Header -->
	<header class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center">
					<img
						src="/src/images/moderai_logo.png"
						alt="ModerAI Logo"
						class="h-8 w-auto"
					/>
					<a href="/">
						<h1 class="ml-3 text-xl font-bold text-gray-900">
							Moder<span class="text-emerald-600">AI</span>
							<span
								class="bg-clip-text text-transparent bg-gradient-to-br from-emerald-500 to-amber-500"
								>Dashboard</span
							>
						</h1>
					</a>
				</div>
				<div class="flex items-center space-x-4">
					<LoginButton variant="ghost" size="sm" />
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Welcome Section -->
		<div
			class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8"
		>
			<div class="text-center">
				<div class="mb-6">
					{#if session?.user?.image}
						<img
							src={session.user.image}
							alt={session.user.name || "User"}
							class="w-20 h-20 rounded-full border-4 border-emerald-200 mx-auto mb-4"
						/>
					{/if}
					<h2 class="text-3xl font-bold text-gray-900 mb-2">
						Bem-vindo, {session?.user?.name || "Usuário"}! 🎉
					</h2>
					<p class="text-gray-600 text-lg">
						Você está na área protegida da ModerAI
					</p>
				</div>

				<!-- User Info -->
				<!-- <div class="bg-emerald-50 rounded-lg p-6 max-w-md mx-auto">
					<h3 class="text-lg font-semibold text-emerald-800 mb-4">
						Informações da Conta
					</h3>
					<div class="space-y-2 text-left">
						<div class="flex justify-between">
							<span class="text-emerald-700 font-medium"
								>Nome:</span
							>
							<span class="text-emerald-900"
								>{session?.user?.name || "N/A"}</span
							>
						</div>
						<div class="flex justify-between">
							<span class="text-emerald-700 font-medium"
								>Email:</span
							>
							<span class="text-emerald-900"
								>{session?.user?.email || "N/A"}</span
							>
						</div>
						<div class="flex justify-between">
							<span class="text-emerald-700 font-medium">ID:</span
							>
							<span class="text-emerald-900 font-mono text-sm"
								>{session?.user?.id || "N/A"}</span
							>
						</div>
					</div>
				</div> -->
			</div>
		</div>

		<!-- Features Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
			<!-- Feature 1 -->
			<div
				class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
			>
				<div class="flex items-center mb-4">
					<div class="bg-emerald-100 rounded-lg p-3">
						<svg
							class="w-6 h-6 text-emerald-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</div>
					<h3 class="ml-3 text-lg font-semibold text-gray-900">
						Moderação Ativa
					</h3>
				</div>
				<p class="text-gray-600 mb-4">
					Sistema de moderação inteligente funcionando 24/7
				</p>
				<div class="flex items-center text-emerald-600">
					<span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"
					></span>
					<span class="text-sm font-medium">Online</span>
				</div>
			</div>

			<!-- Feature 2 -->
			<div
				class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
			>
				<div class="flex items-center mb-4">
					<div class="bg-blue-100 rounded-lg p-3">
						<svg
							class="w-6 h-6 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							></path>
						</svg>
					</div>
					<h3 class="ml-3 text-lg font-semibold text-gray-900">
						Analytics
					</h3>
				</div>
				<p class="text-gray-600 mb-4">
					Relatórios detalhados sobre moderação e performance
				</p>
				<Button variant="outline" size="sm">Ver Relatórios</Button>
			</div>

			<!-- Feature 3 -->
			<div
				class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
			>
				<div class="flex items-center mb-4">
					<div class="bg-purple-100 rounded-lg p-3">
						<svg
							class="w-6 h-6 text-purple-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							></path>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							></path>
						</svg>
					</div>
					<h3 class="ml-3 text-lg font-semibold text-gray-900">
						Configurações
					</h3>
				</div>
				<p class="text-gray-600 mb-4">
					Personalize as regras de moderação para seu contexto
				</p>
				<Button variant="primary" size="sm">Configurar</Button>
			</div>
		</div>

		<!-- Navigation Links -->
		<div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
			<h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">
				Navegação Rápida
			</h3>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Button variant="primary" size="md" fullWidth={true} href="/">
					🏠 Página Inicial
				</Button>
				<Button variant="accent" size="md" fullWidth={true}>
					📊 Dashboard
				</Button>
				<Button variant="outline" size="md" fullWidth={true}>
					⚙️ Configurações
				</Button>
				<Button variant="light" size="md" fullWidth={true}>
					📞 Suporte
				</Button>
			</div>
		</div>
	</main>
</div>
