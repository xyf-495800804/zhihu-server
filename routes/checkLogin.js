// 引入路由
const router = require('koa-router')()
// 引入utils
const utils = require('../libs/utils')

/* ------检测当前用户是否登录接口开始------ */
router.get('/users/checkLogin', async (ctx, next) => {
	try {
		//若当前的cookies中字段是否存在
		if (ctx.cookies.get('id')) {
			ctx.body = {
				status: 200,
				//从cookies中取出name字段并返回
				name: decodeURIComponent(ctx.cookies.get('name')),
			}
		} else {
			ctx.body = {
				//未登录返回202
				status: 202,
			}
		}
	} catch (err) {
		// console.log(err)
		utils.catchError(err)
	}
})
/* ------检测当前用户是否登录接口结束------ */

module.exports = router
