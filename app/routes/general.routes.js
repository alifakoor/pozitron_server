const { authJWT } = require("../middlewares")
const { uploadFiles } = require("../middlewares")

module.exports = function(app) {
	app.use(function(req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		)
		next()
	})

	app.post(
		"/api/general/upload_image",
		[
			authJWT.verifyToken,
			uploadFiles.uploadImage
		]
	)
}