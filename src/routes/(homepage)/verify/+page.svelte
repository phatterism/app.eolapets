<script>
	// https://mitcheljager.github.io/svelte-confetti/?ref=madewithsvelte.com
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { VERIFICATIONCODE_NUM } from '$lib/consts.js';
	import InputVerificationCode from '$lib/components/InputVerificationCode.svelte';
	import { error } from '@sveltejs/kit';
	export let data;
	export let form;
	const userId = $page.url.searchParams.get('id') || data?.userId;
	let code = $page.url.searchParams.get('code') || '';
	if (!userId) error(402, 'No user specified for verification');
</script>

<section>
	{#if form?.verified}
		<hgroup>
			<h2>You&rsquo;re Verified!</h2>
			<p>
				Thanks for verifying your email address.<br />The next step is to schedule a meet-n-greet,
				which is an in-person assessment of your pet(s).
			</p>
		</hgroup>
	{:else}
		{#if code}
			<hgroup>
				<h2>Get Verified!</h2>
				<p>If the code below looks right, press "Verify Me" to get verified.</p>
			</hgroup>
		{:else}
			<hgroup>
				<h2>You&rsquo;ve Got Mail!</h2>
				<p>
					The next step is to verify your email address by using the code we&rsquo;ve emailed to
					you.
				</p>
			</hgroup>
		{/if}
		<form
			action={`?/verify`}
			method="post"
			use:enhance={({ formElement }) => {
				formElement.classList.add('loading');

				return async ({ update, result }) => {
					// if (result) {
					// 	form = result
					// }
					formElement.classList.remove('loading');
					update();
				};
			}}
		>
			<fieldset>
				<InputVerificationCode count={VERIFICATIONCODE_NUM} name="code" bind:value={code} />
				<br />
				<button type="submit" disabled={code?.length != VERIFICATIONCODE_NUM}>Verify Me</button>
				<input type="hidden" name="userId" value={userId} />
				{#if form?.error}
					<p class="error">{form?.error}</p>
				{/if}
			</fieldset>
		</form>
	{/if}
</section>

<!--TODO <section>
	<hgroup>
		<h3>Problems Signing Up?</h3>
		<p>You can request another verification email.</p>
	</hgroup>
</section> -->
