<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { authActions } from '$lib/stores/authStore';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	// Reativo para detectar mudanças na sessão
	$: if (data.session) {
		// Se há uma sessão ativa, atualiza o store de autenticação
		if (data.session.user) {
			authActions.setSession({
				user: {
					id: data.session.user.id || '',
					email: data.session.user.email || '',
					name: data.session.user.name || '',
					image: data.session.user.image || undefined,
				},
				expires: data.session.expires
			});
		}
	} else {
		// Se não há sessão, garante que o store está limpo
		authActions.logout();
	}

	onMount(() => {
		// Inicializa o store de autenticação
		authActions.init();
	});
</script>

<main>
	<slot />
</main>
