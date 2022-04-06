'use strict';

const sequelize = require('./conn');
const Product = require('../db/models/product');
require('./associations');
const {DataTypes} = require("sequelize");

(async () => {
	try {
		await sequelize.sync({ alter: true, force: process.env.FORCE || false });

		console.log('Tables have been created successfully.');
	} catch(e) {
		console.error(`Error Migrate Models, Error: ${e}`);
	} finally {
		process.exit(1);
	}
})();