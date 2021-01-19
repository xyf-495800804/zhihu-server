// 引入路由
const router = require('koa-router')()
// 引入utils
const utils = require('../libs/utils')

/* ------退出接口开始------ */
router.post('/users/logout', async (ctx, next) => {
	//获取cookies中所有字段的内容
	const cookies = {
		id: ctx.cookies.get('id'),
		name: ctx.cookies.get('name'),
		email: ctx.cookies.get('email'),
	}
	try {
		//摧毁cookies
		utils.destoryCookies(ctx, cookies)
		ctx.body = {
			status: 200,
		}
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------退出接口结束------ */

module.exports = router
