const multer = require('multer');
const path = require('path');
const util = require('util');

class Upload {
	#storageOptions = null;

	constructor(section) {
		this.#storageOptions = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, path.join(__dirname, '../public/uploads/' + section));
			},
			filename: function (req, file, cb) {
				cb(null, `${Date.now()}_${file.originalname}`);
			}
		});
	}

	single(req, res, fieldname) {
		return util.promisify(multer({
			storage: this.#storageOptions,
			fileFilter: (req, file, cb) => {
				if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
					return cb(new Error('Only ".png", ".jpeg" and ".jpg" files are allowed'), false);
				}
				cb(null, true);
			}
		}).single(fieldname))(req, res);
	}

	array(req, res, fieldname) {
		return util.promisify(multer({
			storage: this.#storageOptions,
			fileFilter: (req, file, cb) => {
				if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
					return cb(new Error('Only .png and .jpeg files are allowed'), false);
				}
				cb(null, true);
			}
		}).array(fieldname))(req, res);
	}
}

module.exports = Upload;