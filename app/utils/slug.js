'use strict';

function generateSlug(value) {
	return value.split(' ').join('-');
}

module.exports = {
	generateSlug
}