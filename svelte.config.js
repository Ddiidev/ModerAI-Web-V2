import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


const config = {
	trustHost: true,
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			out: 'build'
		})
	}
};

export default config;
