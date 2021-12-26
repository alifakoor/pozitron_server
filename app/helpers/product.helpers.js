'use strict'

function calculateDiscount(regularPrice, salePrice) {
	regularPrice = Number(regularPrice)
	salePrice = Number(salePrice)
	if (salePrice >= regularPrice) return 0
	return Math.floor(((regularPrice - salePrice) * 100) / regularPrice)
}
function calculateSalePrice(regularPrice, discount) {
	regularPrice = Number(regularPrice)
	discount = Number(discount)
	if (discount === 0) return regularPrice
	return Math.floor(regularPrice * ((100 - discount) / 100))
}

module.exports = {
	calculateDiscount,
	calculateSalePrice
}