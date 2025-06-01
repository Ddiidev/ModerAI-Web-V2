<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LoginButton from '../../components/LoginButton.svelte';
	import { isAuthenticated, authError } from '$lib/stores/authStore';
	// @ts-ignore
	import murphy from 'murphyjs';

	let mounted = false;

	// Se o usuário já está autenticado, redireciona para a página inicial
	$: if (mounted && $isAuthenticated) {
		goto('/');
	}

	onMount(() => {
		mounted = true;
		murphy.play();
	});
</script>

<svelte:head>
	<title>Login - ModerAI</title>
	<meta name="description" content="Faça login na ModerAI com sua conta Google" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center px-4">
	<div class="max-w-md w-full">
		<!-- Logo e título -->
		<div class="text-center mb-8">
			<div class="mb-6">
				<img 
					src="/src/images/moderai_logo.png" 
					alt="ModerAI Logo" 
					class="h-16 w-auto mx-auto"
				/>
			</div>
			<h1 class="text-4xl font-bold text-gray-900 mb-2">
				Bem-vindo à <span class="text-emerald-600">ModerAI</span>
			</h1>
			<p class="text-gray-600 text-lg">
				Faça login para acessar a plataforma de moderação inteligente
			</p>
		</div>

		<!-- Card de login -->
		<div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
			<div class="text-center mb-6">
				<h2 class="text-2xl font-semibold text-gray-900 mb-2">Entrar na sua conta</h2>
				<p class="text-gray-500">Use sua conta Google para continuar</p>
			</div>

			<!-- Botão de login -->
			<div class="space-y-4">
				<LoginButton 
					variant="primary" 
					size="lg" 
					fullWidth={true}
					customClass="justify-center"
				/>

				<!-- Exibe erros se houver -->
				{#if $authError}
					<div class="bg-red-50 border border-red-200 rounded-lg p-4">
						<div class="flex items-center">
							<svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
							</svg>
							<span class="text-red-700 text-sm">{$authError}</span>
						</div>
					</div>
				{/if}
			</div>

			<!-- Informações adicionais -->
			<div class="mt-8 pt-6 border-t border-gray-100">
				<div class="text-center text-sm text-gray-500">
					<p class="mb-2">Ao fazer login, você concorda com nossos</p>
					<div class="space-x-4">
						<a href="/termos" class="text-emerald-600 hover:text-emerald-700 underline">
							Termos de Uso
						</a>
						<span>e</span>
						<a href="/privacidade" class="text-emerald-600 hover:text-emerald-700 underline">
							Política de Privacidade
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Link para voltar -->
		<div class="text-center mt-6">
			<a 
				href="/" 
				class="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
			>
				← Voltar para a página inicial
			</a>
		</div>
	</div>
</div>