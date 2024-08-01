<script>
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import { getISODateOffset, autoHeight } from '$lib/utils';
	import InputToggle from '$lib/components/InputToggle.svelte';

	import {
		AGE_SCALE,
		DAYCAMP_TYPES,
		MAX_PET_COUNT,
		PET_FEATURES,
		ORDINALS,
		REFERRER_TYPES,
		REGISTRANT_INTERESTS,
		SITTING_INTEREST_TYPES,
		TIME_DOTW,
		TIME_PART_TYPES,
		TRAINING_INTEREST_TYPES,
		WALKING_INTEREST_TYPES
	} from '$lib/consts';

	/** @type Registrant */
	export let form;
	if (dev) {
		console.log('Developer Mode');
		// document.addEventListener(
		// 	'keydown',
		// 	(event) => {
		// 		//console.log(event.key);
		// 		if (event.key === '/') {
		// 			document.forms.item(0).reset();
		// 		}
		// 	},
		// 	{ passive: true }
		// );
		if (form) console.dir(form);
		if (!form)
			// @ts-ignore
			form = {
				givenName: 'Luis',
				familyName: 'Santi',
				pets: [
					{
						name: 'Rico',
						age: 14,
						ageScale: 'year',
						gender: 'male',
						type: 'poodle',
						size: 15,
						description: 'black with white spots',
						features: ['altered']
					}
				],
				postalCode: '32801',
				streetAddress: '101 Lake Ave',
				emailAddress: 'luissantijr+c' + Math.floor(Math.random() * 0xffff) + '@gmail.com',
				phoneNumber: '407-243-8007',
				referrer: ['google']
			};
	}

	const postalCode = $page.url.searchParams.get('postalCode');

	let interests = form?.interests ?? [];
	const interest = $page.url.searchParams.get('interest');
	if (interest) interests.push(interest);

	let schedule = form?.schedule ?? [];
	let petCount = Number(form?.pets?.length ?? 0);
	let pets = Array.from({ length: MAX_PET_COUNT }, (_, index) => {
		return (
			form?.pets?.[index] ?? {
				name: '',
				age: null,
				ageScale: 'year',
				gender: '',
				type: '',
				size: null,
				description: '',
				features: []
			}
		);
	});
	let recurring = form?.recurring ?? true;
	let referrer = form?.referrer?.[0] ?? '';
	let startDate = form?.startDate ?? getISODateOffset(1);

	// TODO implement snapshot
	export const snapshot = {
		capture: () => JSON.stringify(form),
		restore: (value) => (form = JSON.parse(value))
	};
</script>

<section>
	<form action="?/signup" method="post">
		<!-- use:fieldsets data-error={form?.error} -->
		<fieldset>
			<hgroup>
				<h3>Let&rsquo;s get started&hellip;</h3>
			</hgroup>
			<p>
				<label>
					<span>My name is</span>
					<nobr>
						<input
							type="text"
							name="givenName"
							placeholder="first name"
							size={10}
							autocapitalize="word"
							required
							value={form?.givenName ?? ''}
						/>&nbsp;<input
							type="text"
							name="familyName"
							placeholder="last name"
							size={10}
							autocapitalize="word"
							required
							value={form?.familyName ?? ''}
						/>
					</nobr>
				</label>
			</p>
			<p>
				<label
					>I have
					<select placeholder="0" name="petCount" bind:value={petCount}>
						<option value={0}>no</option>
						{#each pets as _, index}
							<option value={index + 1}>{index + 1}</option>
						{/each}
					</select>
					pet{#if petCount != 1}s{/if}
				</label>
				{#if petCount}
					{#each Array(petCount) as _, index}
						{#if index == 0}
							named
						{:else if index < petCount - 1}
							,
						{:else if index < petCount}and{/if}
						<label>
							<input
								type="text"
								name={`pets.${index}.name`}
								bind:value={pets[index].name}
								placeholder={`${petCount == 1 ? '' : ORDINALS[index]} pet name`}
								size={9}
								required
							/>
						</label>
					{/each}
				{/if}
			</p>
			<p>
				<nobr
					><label>
						<span
							>{#if petCount > 0}We{:else}I{/if} live in</span
						>
						<input
							type="text"
							name="postalCode"
							placeholder="zip code"
							size={7}
							inputmode="numeric"
							maxlength={5}
							pattern="[0-9]*"
							required
							value={form?.postalCode ?? (postalCode || '')}
						/>
					</label></nobr
				>
				<label>
					<nobr><span>and my street address is</span></nobr>
					<input
						type="text"
						name="streetAddress"
						placeholder="street address"
						size={20}
						value={form?.streetAddress ?? ''}
					/>
				</label>
			</p>
			<p>
				<label>
					<span>I can be reached at</span>
					<input
						type="tel"
						name="phoneNumber"
						placeholder="mobile number"
						size={13}
						inputmode="tel"
						required
						value={form?.phoneNumber ?? ''}
					/>
				</label>
			</p>
			<p>
				<label>
					<span>and my email is</span>
					<input
						type="email"
						name="emailAddress"
						placeholder="email address"
						size={24}
						inputmode="email"
						required
						value={form?.emailAddress ?? ''}
					/>
				</label>
				<br />
				<small>This will be used as your log-in name.</small>
			</p>
		</fieldset>

		{#each Array.from({ length: petCount }) as _, index}
			<fieldset>
				<hgroup>
					<h3>
						About your
						{#if petCount !== 1}{ORDINALS[index]}{/if}
						pet
					</h3>
				</hgroup>
				<p>
					<strong>{pets[index].name}</strong> is a
					<label>
						<input
							type="text"
							name={`pets.${index}.age`}
							size={3}
							inputmode="numeric"
							bind:value={pets[index].age}
							maxlength={2}
							placeholder="age"
							pattern="[0-9]*"
							required
						/><select name={`pets.${index}.ageScale`} bind:value={pets[index].ageScale}>
							{#each Object.keys(AGE_SCALE) as scale}
								<option value={scale}>{scale}</option>
							{/each}
						</select>&nbsp;old&nbsp;
					</label>
					<label>
						<select name={`pets.${index}.gender`} bind:value={pets[index].gender} required>
							<option value="" disabled selected hidden> gender </option>
							<option>male</option>
							<option>female</option>
						</select>
					</label>
				</p>
				<p>
					<label>
						<input
							type="text"
							name={`pets.${index}.type`}
							size={24}
							bind:value={pets[index].type}
							placeholder="type/breed"
							required
						/>
					</label>
				</p>
				<p>
					<label>
						that weighs about
						<input
							type="text"
							name={`pets.${index}.size`}
							inputmode="numeric"
							size={6}
							bind:value={pets[index].size}
							maxlength={3}
							placeholder="weight"
							required
						/>
						{#if Number(pets[index].size) != 1}lbs{:else}lb{/if}
					</label>
				</p>
				<p>
					<label>
						and can best be described as<br />
						<textarea
							name={`pets.${index}.description`}
							cols={24}
							rows={2}
							bind:value={pets[index].description}
							placeholder="color/markings/features/personality"
							required
							use:autoHeight
						/>
					</label>
				</p>
				<p>
					<InputToggle
						multiple
						name={`pets.${index}.features`}
						value="altered"
						bind:group={pets[index].features}
					>
						{#if pets[index].gender == 'female'}
							is spayed
						{:else}is neutered{/if}
					</InputToggle>
					{#each Object.entries(PET_FEATURES) as [feature, value]}
						<InputToggle
							multiple
							name={`pets.${index}.features`}
							value={typeof value == 'object' ? feature : value}
							bind:group={pets[index].features}>{feature}</InputToggle
						>
						{#if typeof value == 'object' && pets[index].features.includes(/** @type {never} */ (feature))}
							{#each Object.entries(value) as [feature, value2]}
								<InputToggle
									multiple
									name={`pets.${index}.features`}
									value={value2}
									bind:group={pets[index].features}>{feature}</InputToggle
								>&nbsp;
							{/each}
						{/if}
					{/each}
				</p>
			</fieldset>
		{/each}

		<fieldset>
			<hgroup>
				<h3>How can we help?</h3>
			</hgroup>
			<p>
				I&rsquo;m interested in
				{#each Object.entries(REGISTRANT_INTERESTS) as [interest, value]}
					<InputToggle multiple name="interests" {value} bind:group={interests}
						>{interest}</InputToggle
					>&nbsp;
				{/each}
			</p>
			{#if ~interests.indexOf('other')}
				<p>
					<label>
						<textarea
							cols={24}
							rows={2}
							name="interests"
							placeholder="What other services?"
							required
							value={form?.interests?.[form.interests.indexOf('other') + 1] ?? ''}
							use:autoHeight
						/>
					</label>
				</p>
			{/if}
			{#if ~interests.indexOf('dog-walking')}
				<p>
					My
					{#if petCount > 1}pets need{:else}pet needs{/if}
					<strong>walks</strong> on<br />
					{#each Object.entries(TIME_DOTW) as [day, value]}
						<InputToggle multiple name="schedule" {value} bind:group={schedule}>{day}</InputToggle>
					{/each}<br />
					{#each Object.entries(TIME_PART_TYPES) as [key, value]}
						<InputToggle multiple name="schedule" {value} bind:group={schedule}>{key}</InputToggle
						>&nbsp;
					{/each}
				</p>
				{#if ~schedule.indexOf('some-other-time')}
					<p>
						<label>
							<textarea
								cols={24}
								rows={2}
								name="schedule"
								placeholder="Describe your schedule"
								required
								value={form?.schedule?.[form.schedule.indexOf('some-other-time') + 1] ?? ''}
								use:autoHeight
							/>
						</label>
					</p>
				{/if}
				<p>
					I&rsquo;m also interested in
					{#each Object.entries(WALKING_INTEREST_TYPES) as [interest, value]}
						<InputToggle multiple name="interests" {value} bind:group={interests}
							>{interest}</InputToggle
						>&nbsp;
					{/each}
				</p>
			{/if}

			{#if ~interests.indexOf('pet-sitting')}
				<p>
					I&rsquo;m also interested in
					{#each Object.entries(SITTING_INTEREST_TYPES) as [interest, value]}
						<InputToggle multiple name="interests" {value} bind:group={interests}
							>{interest}</InputToggle
						>&nbsp;
					{/each}
				</p>
			{/if}

			{#if ~interests.indexOf('dog-day-camp')}
				<p>
					I would like the <strong>Day Camp for Dogs</strong> experience to focus on<br />
					{#each Object.entries(DAYCAMP_TYPES) as [key, value]}
						<InputToggle multiple name="interests" {value} bind:group={interests}>{key}</InputToggle
						>&nbsp;
					{/each}
				</p>
			{/if}

			{#if ~interests.indexOf('pet-training')}
				<p>
					I would like to focus <strong>training</strong> around
					{#each Object.entries(TRAINING_INTEREST_TYPES) as [interest, value]}
						<InputToggle multiple name="interests" {value} bind:group={interests}
							>{interest}</InputToggle
						>&nbsp;
					{/each}
				</p>
				{#if ~interests.indexOf('other-training')}
					<p>
						<label>
							<textarea
								name="interests"
								cols={24}
								rows={2}
								placeholder="What behaviors need training?"
								required
								value={form?.interests?.[form.interests.indexOf('other-training') + 1] ?? ''}
								use:autoHeight
							/>
						</label>
					</p>
				{/if}
			{/if}
			<p>
				<label>
					{#if recurring}on an{:else}on a{/if}
					<select name="recurring" bind:value={recurring}>
						<option value={false}>one-off</option>
						<option value={true}>ongoing</option>
					</select>
					schedule
				</label>
				<nobr>
					<label>
						starting on
						<input
							type="date"
							name="startDate"
							size={14}
							placeholder="date"
							required
							min={getISODateOffset(1)}
							bind:value={startDate}
						/>
					</label>
					{#if !recurring}
						<br /><label>
							and ending on
							<input
								type="date"
								name="endDate"
								size={14}
								placeholder="date"
								required
								value={form?.endDate ?? getISODateOffset(1, startDate)}
								min={getISODateOffset(1, startDate)}
							/>
						</label>
					{/if}
				</nobr>
			</p>
			<p>
				<label>
					I was referred to <strong>Eola Pets</strong> by
					<select name="referrer" bind:value={referrer} required>
						<option value="" disabled selected hidden> choose one </option>
						{#each Object.entries(REFERRER_TYPES) as [ref, value]}
							<option {value}>{ref}</option>
						{/each}
					</select>
				</label>
				{#if ~referrer.indexOf('\f')}
					<nobr
						><label>
							named
							<input
								type="text"
								name="referrer"
								size={18}
								placeholder={`${referrer.replace('\f', '')}'s name`}
								value={form?.referrer?.[1] ?? null}
							/>
						</label></nobr
					>
				{/if}
			</p>
			<p>
				<InputToggle name="subscribe" value={true} single checked={form?.subscribe}
					>Subscribe me</InputToggle
				>
				to the newsletter
			</p>
			<p>
				In order to sign up, you must read and agree with our
				<a href="/legal/terms-of-use" target="_blank">Terms of Service</a>
				<br />
				<InputToggle name="agreed" value={true} single required>I agree with the terms</InputToggle>
			</p>
		</fieldset>
		<nav>
			<!-- {#if form?.error}
				<p class="error">{form.error}</p>
			{/if} -->
			<button type="submit">Submit</button>
		</nav>
	</form>
</section>
