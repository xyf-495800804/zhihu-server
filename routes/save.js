// 引入路由
const router = require('koa-router')()
// 引入Articles
let Articles = require('../models/Articles')
// 引入utils
const utils = require('../libs/utils')

/* ------新建保存文章接口开始------ */
router.post('/articles/save', async (ctx, next) => {
	const { content, excerpt, title, creatorId } = ctx.request.body
	try {
		await Articles.create({
			content,
			excerpt,
			title,
			creatorId,
		}).then((res) => {
			ctx.body = {
				status: 200,
				msg: '创建文章成功',
				data: res,
			}
		})
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------新建保存文章接口结束------ */

module.exports = router
