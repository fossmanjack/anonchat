import { v4 as uuidv4 } from 'uuid';

// accepts a string and string length, returns a string truncated to the specified length
export const truncateString = (str, num) => str.length >= num ? str.slice(0, num)+' ...' : str;

// accepts a string, strips out protected characters
export const sanitize = str => str.replace(/[~!@#$%^&*().,<>?_=+:;\'\"\/\-\[\]\{\}\\\|\`]/g, '');

// accepts a string, returns a camelizedString
export const camelize = str => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, c) => c.toUpperCase());

// accepts a string, returns an array [ 'firstWord', 'rest of string' ]
const parseInput = str => {
	const [ lead, ...rest ] = str.split(' ');
	if(!rest.length) return [ lead ];

	return [ lead, rest.join(' ') ];
}

// if passed a length argument, returns a hex value of that length (up to 15 chars)
// if not passed an arg, returns a v4 uuid
export const genuuid = len => {
	if(len) return Math.random().toString(16).slice(2, len > 13 ? 15 : 2 + len);
	else return uuidv4();
}

