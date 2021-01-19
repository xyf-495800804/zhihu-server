//sequelize连接数据库配置
const Sequelize = require('sequelize')

const config = require('./config')

console.log('init sequelize...')

const sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	{
		host: config.host, //数据库地址
		dialect: 'mysql', //指定连接的数据库类型
		// 禁用时间戳
		define: {
			timestamps: false,
		},
		pool: {
			max: 5, //连接池最大连接数量
			min: 0, //最小连接数量
			idle: 10000, //如果一个线程 10秒内没有被使用过的话，就释放
		},
		logging: true, //执行过程会log一些sql的logging,设为false不显示
		timezone: '+08:00', //东八时区
	}
)

module.exports = sequelize
