const formidable = require("formidable")
const fs = require("fs")

uploadImage = (req, res, next) => {
	const form = new formidable.IncomingForm()
	form.parse(req, function (err, fields, file) {
		const format = file.fileToUpload.type.split("/")
		const now = new Date()
		const name = 'onp-' + now.getTime() + '.' + format[1]
		const oldPath = file.fileToUpload.path
		const newPath = 'app/statics/products/' + name
		fs.rename(oldPath, newPath, function (err) {
			if (err) throw err
			res.status(200).send({
				url: '/products/' + name
			})
		})
	})
}

createFileName = (file) => {
	const format = file.fileToUpload.type.split("/")
	const now = new Date()
	let day = now.getDate()
	let month = now.getMonth() + 1
	const year = now.getFullYear()
	const hour = now.getHours()
	const min = now.getMinutes()
	const sec = now.getSeconds()
	if (day < 10) day = `0${day}`
	if (month > 10) month = `0${month}`
	return 'onp-' + year + '-' + month + '-' + day + '.' + format[1]
}

const uploadFiles = {
	uploadImage: uploadImage
}

module.exports = uploadFiles