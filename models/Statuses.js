const Sequelize = require('sequelize')
const sequelize = require('../database/db')

//使用sequelize定义模型
const Statuses = sequelize.define(
	'statuses',
	{
		//id字段
		id: {
			/* 类型为int */
			type: Sequelize.INTEGER.UNSIGNED,
			/* 是否为主键 */
			primaryKey: true,
			/* 是否自增 */
			autoIncrement: true,
		},
		/* voteup */
		voteup: {
			/* 类型为char */
			type: Sequelize.TEXT,
		},
		/* Votedown */
		Votedown: {
			/* 类型为char */
			type: Sequelize.TEXT,
		},
		/* favorite字段 */
		favorite: {
			/* 类型为char */
			type: Sequelize.TEXT,
		},
		/* thanks字段 */
		thanks: {
			/* 类型为char */
			type: Sequelize.TEXT,
		},
		/* targetType字段 */
		targetType: {
			/* 类型为text */
			type: Sequelize.INTEGER.UNSIGNED,
		},
		/* targetId字段 */
		targetId: {
			/* 类型为char */
			type: Sequelize.INTEGER.UNSIGNED,
		},
		// createdAt字段
		/* createdAt: {
			//类型为data
			type: Sequelize.DATE,
			allowNull: true,
		},
		//updatedAt字段
		updatedAt: {
			// 类型为data
			type: Sequelize.DATE,
			allowNull: true,
		}, */
	},
	{
		// freezeTableName,默认为true,会自动给表名表示为复数:user=>users,为false则表示,使用我设置的表名
		freezeTableName: false,
		//timestamps,默认为true,表示数据库中是否会自动更新createdAte和updatedAt字段,false表示不会增加这个字段
		timestamps: false,
	}
)

/*  创建表,默认是false，true则是删除啊原有表，再创建*/
Statuses.sync({
	force: false,
})

// 导出
module.exports = Statuses
