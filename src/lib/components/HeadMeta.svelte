<script>
	//https://svead.vercel.app/?ref=madewithsvelte.com
	/** @type {string} */
	export let title;
	/** @type {string} */
	export let description;
	/** @type {string} */
	export let type = 'website';
	/** @type {string} */
	export let locale = 'en_US';
	/** @type {string|null} */
	export let image = null;
	/** @type {string} */
	export let url = 'https://eolapets.com';
</script>

<svelte:head>
	<meta name={title} />
	<meta name="description" content={description} />
	<meta property="og:locale" content={locale} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={title} />
	{#if image}
		<meta property="og:image" content={image} />
		<meta itemprop="image" content={image} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content={image} />
	{/if}
	<meta itemprop="name" content={title} />
	<meta property="og:url" content={url} />
	<meta name="twitter:site" content="@eolapets" />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:title" content={title} />
	<title>{title}</title>
	<slot />
</svelte:head>
