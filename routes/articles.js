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
		as: 'statuses',
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
		const articleExist = await Articles.findOne({
			where,
			// attributes参数
			attributes: articleAttributes,
		})
		// 如果存在,则删除文章
		if (articleExist) {
			// 删除文章
			await Articles.destroy({
				where,
				// attributes参数
				attributes: articleAttributes,
			}).then((res) => {
				// 删除状态
				return Statuses.destroy({
					// 删除status唯一性
					where: {
						targetId: articlesId,
						targetType: 0,
					},
				}).then((response) => {
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

/* ------查询单个文章接口开始------ */
router.get('/articles/get', async (ctx, next) => {
	const { artcileId } = ctx.request.query
	// 定义where查询参数
	const where = {
		id: artcileId,
	}
	try {
		await Articles.findOne({
			// where参数
			where,
			// include参数
			// include: articleInclude,
			// attributes参数
			attributes: articleAttributes,
		}).then((res) => {
			ctx.body = {
				status: 200,
				data: res,
			}
		})
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------查询单个文章接口结束------ */

/* ------查询文章列表接口开始------ */
router.get('/articles/getlist', async (ctx, next) => {
	try {
		// 定义查询顺序，以id倒序查询
		// * asc正向排序 desc逆向排序 nat自然排序
		const order = [['id', 'DESC']]
		// 限制查询个数为10个
		const limit = 10
		// 调用findAll方法查询
		await Articles.findAll({
			// 查询顺序
			order,
			// 查询个数
			limit,
			// 包含参数
			// include: articleInclude,
			// 查询参数
			attributes: articleAttributes,
		}).then((res) => {
			ctx.body = {
				status: 200,
				data: res,
			}
		})
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------查询文章列表接口结束------ */

/* ------修改文章接口开始------ */
router.post('/articles/update', async (ctx, next) => {
	// 获取各类参数
	const {
		// 修改文章id
		artcilesId,
		// 修改后内容
		content,
		// 修改后简介
		excerpt,
		// 修改后标题
		title,
		// 修改后封面
		imgUrl,
		// 修改用户id
		userId,
	} = ctx.request.body
	// 定义查询参数
	const where = {
		id: artcilesId,
		creatorId: userId,
	}
	try {
		// 先根据作者id和文章id判断文章是否存在
		const articleExist = await Articles.findOne({
			where,
		})
		// 若文章不存在
		if (!articleExist) {
			ctx.body = {
				status: 500,
				msg: '文章不存在或者没有权限',
			}
		} else {
			await Articles.update(
				{
					// 内容
					content,
					// 简介
					excerpt,
					// 标题
					title,
					// 封面
					cover: imgUrl,
				},
				{
					// 修改哪篇文章
					where,
				}
			).then((res) => {
				ctx.body = {
					status: 200,
					msg: '文章修改更新成功',
				}
			})
		}
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------修改文章接口结束------ */

module.exports = router
