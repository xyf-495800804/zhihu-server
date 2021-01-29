const Sequelize = require('sequelize')
const sequelize = require('../database/db')

//使用sequelize定义模型
const Comments = sequelize.define(
	'comments',
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
		/* targetId字段 */
		targetId: {
			/* 类型为int */
			type: Sequelize.INTEGER.UNSIGNED,
		},
		/* type字段 */
		type: {
			/* 类型为int */
			type: Sequelize.INTEGER.UNSIGNED,
		},
		/* content字段 */
		content: {
			/* 类型为text */
			type: Sequelize.STRING,
		},
		/* excerpt字段 */
		targetType: {
			/* 类型为int */
			type: Sequelize.INTEGER.UNSIGNED,
		},
		/* creatorId字段 */
		creatorId: {
			/* 类型为int */
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

Comments.associate = (models) => {
	//关联articles表与user表,方便联表查询
	Comments.belongsTo(models.users, { foreignKey: 'creatorId', as: 'author' })
	//关联articles表与status表,方便联表查询
	Comments.hasMany(models.comments, {
		foreignKey: 'targetId',
		as: 'comments',
	})
}

/*  创建表,默认是false，true则是删除啊原有表，再创建*/
Comments.sync({
	force: false,
})

// 导出
module.exports = Comments
