////////////////////////////////////////////////////////////////////////////////
//
//  CONSTANTS
//  These are variables that are used all about the site
//
////////////////////////////////////////////////////////////////////////////////

export const VERIFICATIONCODE_NUM = 6;
export const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th'];
export const MAX_PET_COUNT = 5;

/**
 * @typedef {string} AgeScaleTypes;
 * @typedef {string} TimePartTypes;
 * @typedef {string|Object} PetFeatures;
 * @typedef {string} TimeDayOfTheWeek;
 * @typedef {string} ReferrerTypes;
 */

/** @enum {AgeScaleTypes} */
export const AGE_SCALE = {
	year: 'year',
	month: 'month',
	weeks: 'weeks'
};

/** @enum {PetFeatures} */
export const PET_FEATURES = {
	'up-to-date vaccinations': 'vaccinated',
	'needs medication': 'medicated',
	'can be aggressive': {
		'ok with humans': 'human-friendly',
		'ok with pets': 'pet-friendly',
		'is leash aggressive': 'leash-aggressive'
	},
	'requires some training': {
		'is potty trained': 'potty-trained',
		'is leash trained': 'leash-trained'
	},
	'seperation anxiety': 'seperation-anxiety',
	'shy/reactive': 'shy-reactive',
	energetic: 'over-active'
};

export const REGISTRANT_INTERESTS = {
	'dog walking': 'dog-walking',
	'pet sitting': 'pet-sitting',
	'dog day camp': 'dog-day-camp',
	'pet training': 'pet-training',
	other: 'other'
};

/** @enum {TimeDayOfTheWeek} */
export const TIME_DOTW = {
	Sunday: 'sunday',
	Monday: 'monday',
	Tuesday: 'tuesday',
	Wednesday: 'wednesday',
	Thursday: 'thursday',
	Friday: 'friday',
	Saturday: 'saturday'
};

/** @enum {TimePartTypes} */
export const TIME_PART_TYPES = {
	morning: 'morning',
	afternoon: 'afternoon',
	evenings: 'evenings',
	'some other time': 'some-other-time'
};

export const DAYCAMP_TYPES = {
	enrichment: 'enrichment',
	'well-being': 'well-being',
	socialization: 'socialization',
	exercise: 'exercise'
};

export const WALKING_INTEREST_TYPES = {
	'pack/group walks': 'group-walks',
	'structured walks': 'structured-walks',
	'long walks/exercise': 'long-walks'
};

export const SITTING_INTEREST_TYPES = {
	overnights: 'overnight',
	'extended daycare': 'extended-daycare'
};

export const TRAINING_INTEREST_TYPES = {
	'house training': 'house-training',
	'leash training': 'leash-training',
	'crate training': 'crate-training',
	socialization: 'socialization',
	'other training': 'other-training'
};

/** @enum {ReferrerTypes} */
export const REFERRER_TYPES = {
	Instagram: 'instagram',
	Google: 'google',
	Yelp: 'yelp',
	Facebook: 'facebook',
	'a team member': 'team-member\f',
	'my apartment complex\f': 'complex\f',
	'just walked by the shop': 'walked-by',
	'an existing client\f': 'client\f',
	'a business': 'business\f',
	'some other entitiy': 'other\f'
};

/*

"imageUrl2": "https://lh3.googleusercontent.com/p/AF1QipMzn2lkoH5oBt8ofkmF2PkEu4apsdtqFCCmJcR0",
"imageUrl3": "https://lh5.googleusercontent.com/p/AF1QipOKj1yPCOIlTD5ob_cbNvFDG_mK2CtVJMc64ut6",
    	
*/
