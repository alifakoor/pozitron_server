'use strict'

function calculateDiscount(regularPrice, salePrice) {
	regularPrice = Number(regularPrice)
	salePrice = Number(salePrice)
	if (salePrice >= regularPrice) return 0
	return Math.floor(((regularPrice - salePrice) * 100) / regularPrice)
}

module.exports = {
	calculateDiscount
}