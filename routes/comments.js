// 引入路由
const router = require('koa-router')()
const Comments = require('../models/comments')
const Statuses = require('../models/Statuses')
//引入loadsh
const _ = require('lodash')
const { userAttributes, commentAttributes } = require('../config/default')
const utils = require('../libs/utils')

/* ------新建评论接口开始------ */
router.post('/comment/create', async (ctx, next) => {
	const { targetId, targetType, creatorId, content } = ctx.request.body
	try {
		await Comments.create({
			creatorId,
			targetType,
			targetId,
			content,
		}).then((res) => {
			//创建对应状态
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
				targetType: 3,
			}).then((res) => {
				ctx.body = {
					status: 200,
					msg: '创建成功',
				}
			})
		})
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------新建评论接口结束------ */

/* ------查询评论接口开始------ */
router.get('/comment/get', async (ctx, next) => {
	const { targetId, targetType } = ctx.request.query
	const where = {
		targetId,
		targetType,
	}

	try {
		await Comments.findAll({
			where,
			attributes: commentAttributes,
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
/* ------查询评论接口结束------ */

/* ------删除评论接口开始------ */
router.post('/comment/delete', async (ctx, next) => {
	const { id, creatorId } = ctx.request.body
	try {
		await Comments.destroy({
			where: {
				id,
				creatorId,
			},
		}).then((res) => {
			return Statuses.destroy({
				where: {
					targetId: id,
					targetType: 3,
				},
			}).then((res) => {
				ctx.body = {
					status: 200,
					msg: '删除成功',
				}
			})
		})
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------删除评论接口结束------ */
module.exports = router
