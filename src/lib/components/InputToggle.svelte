<script>
	/** @type {string} */
	export let name;
	/** @type {any} */
	export let value;
	/** @type {any[]|null} */
	export let group = null;
	/** @type {boolean} */
	export let multiple = false;
	/** @type {boolean} */
	export let required = false;
	/** @type {boolean} */
	export let single = false;
	/** @type {boolean} */
	export let checked = false;

	if (group) {
		checked = ~group.indexOf(value) != 0;
	}

	$: {
		if (multiple && group) {
			const index = group.indexOf(value);
			if (checked && index === -1) {
				group = [...group, value];
			} else if (!checked && index !== -1) {
				group.splice(index, 1);
				group = group;
			}
		}
	}
</script>

<label class="toggle-input">
	{#if single}
		<input type="checkbox" {name} {value} {required} {checked} />
	{:else if !multiple}
		<input type="radio" {name} {value} bind:group {required} {checked} />
	{:else}
		<input type="checkbox" {name} {value} {required} bind:checked />
	{/if}
	<span><slot /></span>
</label>

<style lang="scss">
	input {
		position: absolute;
		border: none;
		appearance: none;

		&:focus + span,
		&:hover + span {
			color: var(--accent-color) !important;
		}

		& + span {
			display: inline-block;
			background: var(--dark-color-light);
			color: var(--header-color);
			border-radius: 2em;
			font-size: 100%;
			padding: 0.5em 0.75em;
			margin: 0.2em 0 0.2em;
			white-space: nowrap;
			transition:
				background-color var(--transition-time),
				color var(--transition-time);
			cursor: pointer;
		}

		&:checked + span {
			background: var(--header-color);
			color: white;
		}
	}
</style>
