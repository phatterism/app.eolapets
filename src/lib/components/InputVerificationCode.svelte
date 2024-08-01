<script>
	/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
	/** @type {number}*/
	export let count;
	/** @type {string} */
	export let value;
	/** @type {string} */
	export let name;
	/** @type {string[]} */
	let code = value ? value.split('') : [];

	/** @param {KeyboardEvent} event */
	function codeKeyHandler(event) {
		if (event.key == 'Backspace') {
			if (code.length == 0) return;
			let index = code.length--;
			value = code.join('');
			/** @type HTMLInputElement | null */
			let element = document.querySelector(`[tabindex="${index}"]`);
			if (element) element.select();
		}
	}

	/** @param {Event} event */
	function codeInputHandler(event) {
		/** @type {HTMLInputElement | null} */
		const target = /** @type {HTMLInputElement} */ (event.target);
		if (!target) return;
		let charCode = String(target.value).charCodeAt(0) - 48;
		if (charCode < 0 || charCode > 9) {
			code = code.slice(0, target.tabIndex - 1);
			return false;
		} else {
			value = code.join('');
			let element = /** @type {HTMLInputElement} */ (
				document.querySelector(`[tabindex="${target.tabIndex + 1}"]`)
			);
			if (element) element.focus();
		}
	}

	/** @param {FocusEvent} event */
	function codeFocusHandler(event) {
		/** @type {HTMLInputElement} */
		const target = /** @type {HTMLInputElement} */ (event.target);
		target.select();
	}
</script>

<p class="code">
	{#each Array(count) as _, i}
		<input
			type="text"
			tabindex={i + 1}
			inputmode="numeric"
			size={1}
			maxlength={1}
			bind:value={code[i]}
			on:keydown={codeKeyHandler}
			on:input={codeInputHandler}
			on:focus={codeFocusHandler}
		/>
	{/each}
</p>
<input type="hidden" {name} bind:value />

<style lang="scss">
	.code {
		list-style: none;
		display: flex;
		justify-content: center;
		font-size: 200%;
		input {
			border-radius: 8px;
			text-align: center;
			border: 4px solid;
			width: 1.2em;
			padding: 0.25em 0;
			margin: 0 0.1em;
			&:focus {
				border-color: var(--accent-color);
			}
		}
	}

	@media (min-width: 768px) {
		.code {
			font-size: 200%;
		}
	}
</style>
