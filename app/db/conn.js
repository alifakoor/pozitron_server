'use strict'

// load configurations
require('dotenv').config({ path: `.${process.env.NODE_ENV}.env`});

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS, {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: process.env.DB_DIALECT || 'mysql',
		timezone: '+03:30',
		define: {
			freezeTableName: true
		},
		pool: {
			max: 5, // maximum number of connection in pool
			min: 0, // minimum number of connection in pool
			acquire: 15000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
			idle: 10000 //maximum time, in milliseconds, that a connection can be idle before being released
		}
});

(async () => {
	try {
		await sequelize.authenticate();
		console.log('Database connection has been established successfully.');
	} catch(e) {
		console.log(`Unable to connect to the database, error: ${e}`);
		process.exit(1);
	}
})();

module.exports = sequelize;