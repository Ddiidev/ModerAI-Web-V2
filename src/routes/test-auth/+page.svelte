<script lang="ts">
	import { onMount } from 'svelte';
	import LoginButton from '../../components/LoginButton.svelte';
	import Button from '../../components/Button.svelte';
	import { authStore, isAuthenticated, currentUser } from '$lib/stores/authStore';

	export let data;

	$: session = data.session;

	onMount(() => {
		console.log('Session data:', session);
		console.log('Auth store:', $authStore);
		console.log('Is authenticated:', $isAuthenticated);
		console.log('Current user:', $currentUser);
	});
</script>

<svelte:head>
	<title>Teste de Autenticação - ModerAI</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-4xl mx-auto px-4">
		<h1 class="text-3xl font-bold text-gray-900 mb-8">Teste de Autenticação</h1>
		
		<!-- Status da Sessão -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold mb-4">Status da Sessão</h2>
			<div class="space-y-2">
				<p><strong>Sessão existe:</strong> {session ? 'Sim' : 'Não'}</p>
				<p><strong>Usuário autenticado:</strong> {$isAuthenticated ? 'Sim' : 'Não'}</p>
				{#if session}
					<p><strong>Nome:</strong> {session.user?.name || 'N/A'}</p>
					<p><strong>Email:</strong> {session.user?.email || 'N/A'}</p>
					<p><strong>ID:</strong> {session.user?.id || 'N/A'}</p>
					<p><strong>Expira em:</strong> {session.expires || 'N/A'}</p>
				{/if}
			</div>
		</div>

		<!-- Auth Store Status -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold mb-4">Auth Store Status</h2>
			<div class="space-y-2">
				<p><strong>Is Authenticated:</strong> {$authStore.isAuthenticated ? 'Sim' : 'Não'}</p>
				<p><strong>Is Loading:</strong> {$authStore.isLoading ? 'Sim' : 'Não'}</p>
				<p><strong>Error:</strong> {$authStore.error || 'Nenhum'}</p>
				<p><strong>Token:</strong> {$authStore.token ? 'Presente' : 'Ausente'}</p>
				{#if $authStore.user}
					<p><strong>User Name:</strong> {$authStore.user.name}</p>
					<p><strong>User Email:</strong> {$authStore.user.email}</p>
				{/if}
			</div>
		</div>

		<!-- Componente de Login -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold mb-4">Componente de Login</h2>
			<LoginButton variant="primary" size="md" />
		</div>

		<!-- Navegação -->
		<div class="bg-white rounded-lg shadow p-6">
			<h2 class="text-xl font-semibold mb-4">Navegação</h2>
			<div class="flex gap-4">
				<Button variant="outline" href="/">Página Inicial</Button>
				<Button variant="outline" href="/login">Página de Login</Button>
				<Button variant="outline" href="/protected">Área Protegida</Button>
			</div>
		</div>
	</div>
</div>