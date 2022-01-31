'use strict';

const sequelize = require('./conn');

const User = require('./models/user');
const Business = require('./models/business');

(async () => {
	try {
		await sequelize.sync({ alter: true });
		// await Business.sync({ alter: true, force: true });
		// await User.sync({ alter: true, force: true });

		console.log('Tables have been created successfully.');
	} catch(e) {
		console.error(`Error Migrate Models, Error: ${e}`);
	} finally {
		process.exit(1);
	}
})();