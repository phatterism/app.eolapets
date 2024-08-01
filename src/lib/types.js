////////////////////////////////////////////////////////////////////////////////
//
//  Types
//
////////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {Object} Pet
 * @property {string} name - Pet Name
 * @property {number} age - Pet Age
 * @property {import("$lib/consts").AgeScaleTypes} ageScale - Pet Age Scale
 * @property {string} gender - Pet Gender
 * @property {string} type - Pet Type
 * @property {number} size - Pet Size
 * @property {string} description - Pet Description
 * @property {string[]} features - Pet Features
 * @property {string=} imageURL - Pet Image URL
 */

/**
 * @typedef {Object} Registrant - creates a new Registrant user
 * @property {string} givenName - First Name
 * @property {string} familyName - Last Name
 * @property {string} postalCode - Zip Code
 * @property {string} streetAddress - Street Address
 * @property {string} phoneNumber - Phone Number
 * @property {string} emailAddress - Email Address
 * @property {string} startDate - Start Date
 * @property {string} endDate - End Date
 * @property {boolean} recurring - Recurring
 * @property {boolean} agreed - Agreed
 * @property {boolean} subscribe - Subscribed to newsletter
 * @property {string[]} interests - Interests
 * @property {string[]} schedule - Schedule
 * @property {string[]} referrer - Referrer
 * @property {Pet[]} [pets] - Pets array
 * @property {boolean=} serviceable - Is serviceable
 */

/**
 * @typedef {Object} Applicant - creates a new Applicant user
 * @property {string} givenName - First Name
 * @property {string} familyName - Last Name
 * @property {string} postalCode - Zip Code
 * @property {string} streetAddress - Street Address
 * @property {string} phoneNumber - Phone Number
 * @property {string} emailAddress - Email Address
 * @property {string} startDate - Start Date
 * @property {boolean} agreed - Agreed
 * @property {boolean} subscribe - Subscribed to newsletter
 * @property {string} salary - Salary
 * @property {string} experience - Experience
 * @property {string} details - Details
 * @property {boolean} authorized - Authorized
 * @property {boolean} felony - Felony
 * @property {string[]} interests - Interests
 * @property {string[]} schedule - Schedule
 * @property {string[]} referrer - Referrer
 */

/**
 * @typedef {Object} Subscriber
 * @property {string} givenName - First Name
 * @property {string} emailAddress - Email Address
 * @property {string} postalCode - Zip Code
 */

/**
 * @typedef {Object} TeamRater
 * @property {string} teamId - Team ID
 * @property {string} name - Team name
 * @property {number} rating - rating
 * @property {string=} message - Actual feedback message
 */

/**
 * @typedef {Object} Service
 * @property {string} id - ID of service
 * @property {string} title - Title of the Service
 * @property {string} blurb - Short blrub of service
 * @property {string} description - Description of service
 * @property {string} imageURL - URL of image
 * @property {ServiceItem[]} items - Subservice items
 */

/**
 * @typedef {Object} ServiceItem
 * @property {string} itemId - ID of service
 * @property {string} displayName - Name of the Service
 * @property {string} description - Description of service
 * @property {number} price - Price of service
 * @property {string} imageURL - URL of image
 */
