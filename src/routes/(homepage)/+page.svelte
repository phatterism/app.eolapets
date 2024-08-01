<script>
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { quadInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let verbs = ['walking', 'pet sitting', 'training', 'bathing', 'socializing'];
	let index = 0;
	let hour = dev ? 10 : new Date().getHours();

	onMount(() => {
		let interval = setInterval(function () {
			index++;
			if (index == verbs.length) {
				index = 0;
				hour = new Date().getHours();
			}
		}, 2500);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="full-color">
	<section id="hero">
		<article>
			<h1 inert>
				We could be<br />
				<div class="verb-holder">
					{#each verbs as _, i}
						{#if index == i}
							<u in:fly={{ y: '1em', easing: quadInOut }} out:fly={{ y: '-1em', easing: quadInOut }}
								>{verbs[i]}</u
							>
						{/if}
					{/each}
				</div>
				<br />your dog{#if hour > 7 && hour < 18}<br />right now{/if}.
			</h1>
			<p>
				<strong>Downtown Orlando&rsquo;s</strong> pet care pros and we cant wait to meet your pet!
			</p>
			<p>
				<a href="/signup">
					<button style="user-select:none;user-drag:none;">Get Started</button>
				</a>
			</p>
		</article>
	</section>
</div>

<section id="services">
	<hgroup>
		<h1>Happy Pets</h1>
		<p>
			We offer quality pet services guarenteed to make pets happy. Our availability is 365 days a
			year from AM to PM.
		</p>
	</hgroup>
	<article></article>
	<!-- services-->
</section>

<section id="team">
	<hgroup>
		<h1>Happy Humans</h1>
		<p>
			We hire right from the community so we get to know you and your pet in your hood. which means
			we know which street blocks to avoid, which local dogs are friendly and your neighbors will
			get to know us, too!
		</p>
	</hgroup>
</section>

<section id="reviews">
	<hgroup>
		<h1>Happy Neighborhood</h1>
		<p>
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita nam nostrum ut repellat
			ipsam esse illum ab unde, cupiditate doloremque. Eligendi quos libero incidunt obcaecati?
		</p>
	</hgroup>
</section>

<section id="local">
	<hgroup>
		<h1>We&rsquo;re Super Local</h1>
	</hgroup>
</section>

<section id="retail"></section>

<style lang="scss">
	// mobile first
	.full-color {
		width: 100%;
		background: url(/img/hero-pug.jpg) no-repeat;
		background-position: right 40%;
		background-size: 200vw;
		margin: 0;
		padding: 1em;
	}
	#hero {
		min-height: 90vh;
		padding: 0 1em;
		position: relative;
		button {
			position: absolute;
			bottom: 0%;
			left: 0%;
		}
		article {
			h1 {
				font-size: calc(min(290%, max(7vh, 190%)));
				margin: 0;
				color: #f9db58;
				line-height: 0.85;
			}
			.verb-holder {
				position: relative;
			}
			u {
				position: absolute;
				display: inline-block;
				white-space: nowrap;
				text-decoration: none;
			}
			p {
				font-weight: 400;
				font-size: 125%;
				color: white;
			}
		}
	}

	@media (min-width: $break-small) {
		.full-color {
			background-position: right 71%;
			background-size: 105vw;
		}
		#hero {
			display: flex;
			min-height: 75vh;
			article {
				width: 32em;
				display: flex;
				flex-direction: column;
				align-content: center;
				justify-content: center;
				h1 {
					font-size: 400%;
				}
			}
			button {
				position: relative;
				bottom: 0%;
				left: 0%;
			}
		}
	}
	button {
		background-color: white;
		color: var(--button-default-color);
		&:hover,
		&:focus {
			background-color: #f9db58;
			color: white;
		}
	}
</style>
