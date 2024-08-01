<script>
	import { page } from '$app/stores';
	import '$lib/styles/main.scss';
</script>

<header></header>
<main>
	<section>
		<hgroup>
			<h1>Whoopsy!</h1>
			<p>
				We hate that this happened.<br />
				<strong>{$page.status}</strong>
				{$page.error?.message}
			</p>
		</hgroup>
	</section>
</main>
<footer></footer>
