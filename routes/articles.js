// 引入路由
const router = require('koa-router')()
// 引入Articles
let Articles = require('../models/Articles')
// 引入status
let Statuses = require('../models/Statuses')
// 引入users
let users = require('../models/User')
// 引入utils
const utils = require('../libs/utils')
// 引入lodash
const _ = require('lodash')
// 提取出默认attributes配置
const { userAttributes, articleAttributes } = require('../config/default')
// 增加通用include配置
const articleInclude = [
	{
		// 包含users表
		model: users,
		// 需要的字段
		attributes: userAttributes,
		//重命名为author字段
		as: 'author',
	},
	{
		// 包含status表
		model: Statuses,
		as: 'status',
		// 目标类型为0的文章
		where: {
			targetType: 0,
		},
	},
]

/* ------新建文章接口开始------ */
router.post('/articles/create', async (ctx, next) => {
	// 从请求体中获得content,excerpt,title,imgUrl,userId变量
	const { content, excerpt, title, imgUrl, creatorId } = ctx.request.body
	try {
		// 创建文章
		await Articles.create({
			content,
			excerpt,
			title,
			cover: imgUrl,
			creatorId: creatorId,
			type: 0,
		}).then((res) => {
			console.log(res.dataValues.id)
			return Statuses.create({
				// 支持字段
				voteup: '[]',
				// 反对字段
				Votedown: '[]',
				// 收藏字段
				favorite: '[]',
				// 感谢字段
				thanks: '[]',
				// 目标ID
				targetId: res.dataValues.id,
				// 目标类型
				targetType: 0,
			}).then((res) => {
				ctx.body = {
					status: 200,
					msg: '文章创建成功',
				}
			})
		})
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------新建文章接口结束------ */

/* ------删除文章接口开始------ */
router.post('/articles/delete', async (ctx, next) => {
	// 提取articlesId和userId参数(文章id和人物id)
	const { articlesId, userId } = ctx.request.body
	// 创建where条件
	const where = {
		id: articlesId,
		creatorId: userId,
	}
	try {
		// 先判断文章是否存在,如果存在再进行删除操作
		const articleExist = await Articles.findOne(where)
		// 如果存在,则删除文章
		if (articleExist) {
			// 删除文章
			await Articles.destroy({
				where,
			}).then((res) => {
				// 删除状态
				return status
					.destroy({
						// 删除status唯一性
						where: {
							targetId: articlesId,
							targetType: 0,
						},
					})
					.then((response) => {
						ctx.body = {
							status: 200,
							msg: '删除文章成功',
						}
					})
			})
		} else {
			// 文章不存在
			ctx.body = {
				status: 500,
				msg: '文章不存在或者没有权限',
			}
		}
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------删除文章接口结束------ */

module.exports = router
