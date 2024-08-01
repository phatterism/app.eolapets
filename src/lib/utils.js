/** @param {string} date */
export const getISODateOffset = (offset = 0, date = new Date().toString()) => {
	return new Date(new Date(date).getTime() + offset * 24 * 60 * 60 * 1000)
		.toISOString()
		.split('T')[0];
};

/** @param {HTMLFormElement} form */
export const fieldsets = (form) => {
	//setup fieldsets
	let fieldsets = form.querySelectorAll('fieldset');

	if (form.querySelectorAll('fieldset:not(:disabled)').length > 1) {
		if (form.getAttribute('data-error')) {
			form.setAttribute('active', (fieldsets.length - 1).toString());
		}
		fieldsets.forEach((fieldset, val) => {
			fieldset.disabled = val !== Number(form.getAttribute('active')) || 0 ? true : false;
		});
	}

	/** @param {number} step; @param {Event} event; */
	const fieldsetHandler = async function (step, event) {
		fieldsets = form.querySelectorAll('fieldset');
		fieldsets.forEach((fieldset, val) => {
			fieldset.setAttribute('name', val.toString());
		});

		let fieldset = /** @type {HTMLFieldSetElement} */ (
			form.querySelector('fieldset:not(:disabled)')
		);

		const active = Number(fieldset.getAttribute('name')) + step;
		form.setAttribute('active', active.toString());
		if (fieldsets.length === active) {
			form.classList.add('loading');
			fieldsets.forEach((fieldset) => {
				fieldset.disabled = false;
			});
			return true;
		} else {
			fieldset.disabled = true;
			fieldset = fieldsets[active];
			fieldset.disabled = false;
			const label = /** @type {HTMLLabelElement} */ (fieldset.querySelector('label'));
			if (label) label.focus();
			event.preventDefault();
			return update();
		}
	};

	//setup bottom nav
	const nav = /** @type {HTMLElement} */ (form.querySelector('nav'));
	//nav.innerHTML = '';
	/** @type {HTMLButtonElement} */
	const back = nav.querySelector("button[type='submit']") || document.createElement('button');
	/** @param {Event} event */
	const backHandler = (event) => {
		fieldsetHandler(-1, event);
	};
	//back.type = 'button';
	back.innerText = 'Back';
	back.className = 'back';
	back.addEventListener('click', backHandler);
	nav.appendChild(back);
	const next = document.createElement('button');
	/** @param {Event} event */
	const nextHandler = (event) => {
		fieldsetHandler(1, event);
	};
	next.type = 'submit';
	next.innerText = fieldsets[fieldsets.length - 1].disabled != false ? 'Next' : 'Submit';
	nav.appendChild(next);
	//setup
	form.addEventListener('submit', nextHandler);

	const update = function () {
		back.style.display = !fieldsets[0].disabled ? 'none' : 'inline-block';
		next.innerText = fieldsets[fieldsets.length - 1].disabled != false ? 'Next' : 'Submit';
		return false;
	};

	update();

	return {
		destroy() {
			back.removeEventListener('click', backHandler);
			form.removeEventListener('submit', nextHandler);
		}
	};
};

/** @param {HTMLTextAreaElement} textarea */
export const autoHeight = (textarea) => {
	textarea.style.height = '1em';
	textarea.style.overflow = 'hidden';
	textarea.rows = 1;

	function inputChangeHandler() {
		textarea.style.height = '';
		textarea.style.height = textarea.scrollHeight + 4 + 'px';
	}

	textarea.addEventListener('input', inputChangeHandler);
	inputChangeHandler();

	return {
		destroy() {
			textarea.removeEventListener('input', inputChangeHandler);
		}
	};
};
