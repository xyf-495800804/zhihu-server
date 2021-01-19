// Load the full build.
const _ = require('lodash')
// 引入路由
const router = require('koa-router')()
// 引入User
let User = require('../models/User')
//引入utils的设置cookies
const utils = require('../libs/utils')

/* ------登录接口开始------ */
router.post('/users/login', async (ctx, next) => {
	//获取请求参数
	const { name, pwd } = ctx.request.body
	//定义查询条件
	const where = {
		name,
		pwd,
	}
	//定义查询字段
	const attributes = ['name', 'id', 'email']
	try {
		//查询user表
		await User.findOne({ where, attributes }).then((res) => {
			//查询结果为空
			if (res === null) {
				ctx.body = {
					status: 206,
					msg: '用户名或者密码不对,请修改后重新登录',
				}
				return
			} else {
				//查询结果不为空
				//设置cookies
				utils.setCookies(ctx, res.dataValues)
				ctx.body = {
					status: 200,
					msg: '登录成功',
				}
			}
		})
		//查询出错
	} catch (err) {
		// console.log(err)
		//捕获错误
		utils.catchError(err)
	}
})
/* ------登录接口结束------ */

module.exports = router
