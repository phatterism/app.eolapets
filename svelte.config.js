import adapter from 'svelte-adapter-appengine';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import * as child_process from 'node:child_process';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
		//version: { name: child_process.execSync('git rev-parse HEAD').toString().trim() }
	},
	preprocess: [
		vitePreprocess({
			scss: {
				prependData: `@import "./src/lib/styles/variables.scss";`
			}
		})
	]
};

export default config;
