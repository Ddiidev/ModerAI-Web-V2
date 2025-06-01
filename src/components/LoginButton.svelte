<script lang="ts">
	import { signIn, signOut } from "@auth/sveltekit/client";
	import { page } from "$app/stores";
	import Button from "./Button.svelte";
	import { LayoutDashboard, LogOut } from "@lucide/svelte";

	export let variant:
		| "primary"
		| "accent"
		| "outline"
		| "light"
		| "gray"
		| "ghost" = "accent";
	export let size: "sm" | "md" | "lg" = "md";
	export let fullWidth: boolean = false;
	export let customClass: string = "";
	export let iconOnly: boolean = false;

	$: session = $page.data.session;
	$: isAuthenticated = !!(session && session.user);
	let showSubMenu = false;
	let hideTimeout: any = null;

	function handleSignIn() {
		signIn("google");
	}

	function handleSignOut() {
		signOut();
	}

	function handleMouseEnter() {
		if (hideTimeout) {
			clearTimeout(hideTimeout);
			hideTimeout = null;
		}
		showSubMenu = true;
	}

	function handleMouseLeave() {
		hideTimeout = setTimeout(() => {
			showSubMenu = false;
			hideTimeout = null;
		}, 200);
	}
</script>

{#if isAuthenticated}
	<div
		class="relative inline-block"
		role="button"
		tabindex="0"
		on:mouseenter={handleMouseEnter}
		on:mouseleave={handleMouseLeave}
	>
		<div class="flex flex-row items-center gap-2" role="menu" tabindex="0">
			{#if session?.user?.image}
				<img
					src={session.user.image}
					alt={session.user.name || "User"}
					class="w-8 h-8 rounded-full border-2 border-emerald-200"
				/>
			{/if}
			{#if !iconOnly}
				<div class="flex flex-row items-center gap-1">
					<span class="text-sm text-gray-600">Olá,</span>
					<span class="font-semibold text-emerald-700">
						{session?.user?.name || session?.user?.email || "Usuário"}
					</span>
				</div>
			{/if}
		</div>
		{#if showSubMenu}
			<div
				class="absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg p-px z-10"
				style="background: linear-gradient(to bottom right, #10B981, #F59E0B);"
				role="menu"
				tabindex="-1"
			>
				<div class="bg-white rounded-md p-2">
					<div class="font-semibold text-gray-700 px-2 py-1">
						{session?.user?.name || session?.user?.email}
					</div>
					<hr class="my-1 border-gray-200" />
					<a
						href="/dasboard"
						class="block px-2 py-1 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded"
						><LayoutDashboard
							class="inline-block w-4 h-4 mr-2"
						/>Dashboard</a
					>
					<a
						href="/#"
						on:click|preventDefault={handleSignOut}
						class="block px-2 py-1 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded"
					>
						<LogOut class="inline-block w-4 h-4 mr-2" />Sair
					</a>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<Button
		{variant}
		{size}
		{fullWidth}
		on:click={handleSignIn}
		customClass="flex items-center gap-2 {customClass}"
	>
		<svg class="w-5 h-5" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			/>
			<path
				fill="currentColor"
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
			/>
			<path
				fill="currentColor"
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
			/>
			<path
				fill="currentColor"
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
			/>
		</svg>
		{#if !iconOnly}
			Entrar com Google
		{/if}
	</Button>
{/if}
