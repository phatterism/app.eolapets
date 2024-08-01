<script>
	//https://itnext.io/make-your-pwas-look-handsome-on-ios-fd8fdfcd5777
	import '$lib/styles/main.scss';

	import { browser } from '$app/environment';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	if (browser && window?.navigator?.standalone) {
		document.body.classList.add('standalone');
		//window.document.body.ontouchstart = null;
	}
</script>

<Header />
<main>
	<slot />
</main>
<Footer />
