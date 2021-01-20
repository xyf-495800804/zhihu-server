const Sequelize = require('sequelize')
const sequelize = require('../database/db')

//使用sequelize定义模型
const Articles = sequelize.define(
	'articles',
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
		/* title字段 */
		title: {
			/* 类型为char */
			type: Sequelize.CHAR,
		},
		/* content字段 */
		content: {
			/* 类型为text */
			type: Sequelize.TEXT,
		},
		/* excerpt字段 */
		excerpt: {
			/* 类型为varchar */
			type: Sequelize.STRING,
		},
		/* creatorId字段 */
		creatorId: {
			/* 类型为int */
			type: Sequelize.INTEGER.UNSIGNED,
		},
		/* type字段 */
		type: {
			/* 类型为int */
			type: Sequelize.INTEGER.UNSIGNED,
		},
		/* cover字段 */
		cover: {
			/* 类型为char */
			type: Sequelize.CHAR,
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

Articles.associate = (models) => {
	//关联articles表与user表,方便联表查询
	Articles.belongsTo(models.users, { foreignKey: 'creatorId', as: 'author' })
	//关联articles表与status表,方便联表查询
	Articles.hasOne(models.likes, { foreignKey: 'targetId', as: 'status' })
}

/*  创建表,默认是false，true则是删除啊原有表，再创建*/
Articles.sync({
	force: false,
})

// 导出
module.exports = Articles
