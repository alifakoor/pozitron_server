module.exports = (sequelize, Sequelize) => {
	const Static = sequelize.define("statics", {
		section: {
			type: Sequelize.STRING(20), // VARCHAR(20)
			validate: {
				isIn: [[
					"product",
					"customer",
					"user",
					"category"
				]]
			}
		},
		section_id: {
			type: Sequelize.BIGINT(20)
		},
		path: {
			type: Sequelize.TEXT
		},
		title: {
			type: Sequelize.STRING(150)
		},
		description: {
			type: Sequelize.TEXT
		},
		type: {
			type: Sequelize.STRING(20),
			validate: {
				isIn: [[
					"regular",
					"irregular"
				]]
			}
		},
		status: {
			type: Sequelize.STRING(20),
			validate: {
				isIn: [[
					"draft",
					"pending",
					"private",
					"publish",
					"available",
					"unavailable"
				]]
			}
		}
	}, {
		underscored: true,
	})

	return Static
}