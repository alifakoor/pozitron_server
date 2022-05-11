'use strict'

function calculateDiscount(regularPrice, salePrice) {
	if (regularPrice === "" || salePrice === "") return 0
	if (regularPrice === undefined || salePrice === undefined) return 0
	regularPrice = Number(regularPrice)
	salePrice = Number(salePrice)
	if (salePrice >= regularPrice) return 0
	return Math.floor(((regularPrice - salePrice) * 100) / regularPrice)
}
function calculateSalePrice(regularPrice, discount) {
	if (regularPrice === "" || discount === "") return 0
	if (regularPrice === undefined || discount === undefined) return 0
	regularPrice = Number(regularPrice)
	discount = Number(discount)
	if (discount === 0) return regularPrice
	return Math.floor(regularPrice * ((100 - discount) / 100))
}
function calculateDimension(length, width, height) {
	if (!length && !width && !height) return false;
	return {
		length: length ? Number(length) : 0,
		width: width ? Number(width) : 0,
		height: height ? Number(height) : 0,
	}
}

module.exports = {
	calculateDiscount,
	calculateSalePrice,
	calculateDimension
}