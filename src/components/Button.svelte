<script lang="ts">
	// import { twMerge } from 'tailwind-merge';
	import { createEventDispatcher } from 'svelte';

	export let variant: 'primary' | 'accent' | 'outline' | 'light' | 'gray' | 'ghost' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let rounded: 'sm' | 'md' | 'lg' | 'full' = 'lg';
	export let href: string | undefined = undefined;
	export let disabled: boolean = false;
	export let fullWidth: boolean = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let customClass: string = '';

	// Base classes for all buttons
	const baseStyles =
		'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

	// Variant specific styles
	const variantStyles = {
		primary: {
			classes:
				'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white focus:ring-emerald-500 shadow-lg',
			hover: 'hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl hover:-translate-y-1'
		},
		accent: {
			classes:
				'bg-gradient-to-r from-emerald-500 to-yellow-400 text-white focus:ring-emerald-400 shadow-lg',
			hover: 'hover:shadow-xl hover:-translate-y-1' // Original examples don't show gradient change on hover for this
		},
		outline: {
			classes: 'border-2 border-emerald-600 text-emerald-600 bg-transparent focus:ring-emerald-500',
			hover: 'hover:bg-emerald-600 hover:text-white' // Matches "Ver Demonstração" button
		},
		light: {
			classes: 'bg-white text-emerald-600 focus:ring-emerald-500 shadow-lg',
			hover: 'hover:bg-gray-100 hover:shadow-xl hover:-translate-y-1'
		},
		gray: {
			classes: 'bg-gray-100 text-gray-800 focus:ring-gray-500 shadow-md', // Matches "Testar grátis" on Inicial plan
			hover: 'hover:bg-gray-200 hover:shadow-lg'
		},
		ghost: {
			classes: 'text-gray-600 hover:text-emerald-600 focus:ring-emerald-500',
			hover: 'hover:bg-emerald-50'
		}
	};

	// Size specific styles
	const sizeStyles = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-2 text-base', // Based on header button
		lg: 'px-8 py-4 text-lg' // Based on hero buttons
	};

	// Rounded corner styles
	const roundedStyles = {
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		full: 'rounded-full'
	};

	let klasses: string;
	$: {
		const currentVariant = variantStyles[variant];
		klasses = [
			baseStyles,
			currentVariant.classes,
			sizeStyles[size],
			roundedStyles[rounded],
			fullWidth ? 'w-full' : '',
			disabled ? 'opacity-50 cursor-not-allowed' : currentVariant.hover,
			customClass
		]
			.filter(Boolean)
			.join(' ');
	}

	const dispatch = createEventDispatcher();

	function handleClick(event: MouseEvent) {
		if (disabled) {
			event.preventDefault();
			return;
		}
		dispatch('click', event);
	}
</script>

{#if href}
	<a
		{...$$restProps}
		href={disabled ? undefined : href}
		class={klasses}
		role="button"
		aria-disabled={disabled ? 'true' : undefined}
		on:click={handleClick}
		target={$$restProps.target || (href && (href.startsWith('http') || href.startsWith('//')) ? '_blank' : undefined)}
		rel={$$restProps.rel ||
			(href && (href.startsWith('http') || href.startsWith('//')) ? 'noopener noreferrer' : undefined)}
	>
		<slot>Button</slot>
	</a>
{:else}
	<button
		{...$$restProps}
		type={type}
		{disabled}
		class={klasses}
		on:click={handleClick}
	>
		<slot>Button</slot>
	</button>
{/if}