<script>
	import Logo from '$lib/images/eola-pets-cloud-logo.svg';
</script>

<header>
	<nav>
		<!-- <div>
			<a href="/team">Team</a>
			<a href="/services">Services</a>
			<a href="/retail">Retail</a>
		</div> -->
		<a href="/" class="logo-link">
			<img src={Logo} alt="Eola Pets" width="80em" height="80em" />
		</a>
		<div>
			<a href="/login">Log-in</a>
			<a href="/signup">
				<button>Sign Up</button>
			</a>
		</div>
	</nav>
</header>

<style lang="scss">
	header {
		position: fixed;
		width: 100%;
		z-index: 255;
		top: 0;
		background: white;
		transition: top var(--transition-time) ease-in-out;
		// background: url('https://lh5.googleusercontent.com/p/AF1QipNLKX2_-clUVXa-pM-b-tHrxbJPYELxWmary-e0')
		// 	100px -100px var(--header-color);
	}
	nav {
		margin: 1em 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		justify-items: end;
	}
	a {
		display: inline-block;
		margin: 0 0.5em;
	}
	@media (min-width: $break-small) {
	}
</style>
