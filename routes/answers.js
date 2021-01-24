// 引入路由
const router = require('koa-router')()
//引入answer
const Answers = require('../models/Answers')
//引入状态表
const Statuses = require('../models/Statuses')
//引入loadsh
const _ = require('lodash')
//获取answerAttribute变量
const { answerAttributes } = require('../config/default')
const utils = require('../libs/utils')

/* ------创建回答方法接口开始------ */
router.post('/answer/create', async (ctx, next) => {
	// 引入作者id,问题id，回答内容和回答简介参数
	const { creatorId, targetId, content, excerpt } = ctx.request.body
	try {
		await Answers.create({
			//作者id
			creatorId,
			//问题id
			question_id: targetId,
			//回答内容
			content,
			//回答简介
			excerpt,
			//当前元素类型
			type: 2,
		}).then((res) => {
			//创建statuses
			return Statuses.create({
				//支出数量
				voteup: '[]',
				//反对数量
				Votedown: '[]',
				//收藏数量
				favorite: '[]',
				//感谢数量
				thanks: '[]',
				//回答id
				targetId: res.dataValues.id,
				//目标元素类型
				targetType: 2,
			}).then((res) => {
				ctx.body = {
					status: 200,
					msg: '创建回答成功',
				}
			})
		})
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------创建回答方法接口结束------ */

/* ------删除回答接口开始------ */
router.post('/answer/delete', async (ctx, next) => {
	// 获取回答id和用户id参数
	const { answerId, userId } = ctx.request.body
	const where = {
		//回答id
		id: answerId,
		//作者id
		creatorId: userId,
	}
	try {
		//首先查询是否存在
		const answerExist = await Answers.findOne({
			where,
		})
		if (answerExist) {
			await Answers.destroy({
				where,
			}).then((res) => {
				//删除状态
				return Statuses.destroy({
					where: {
						targetId: answerId,
						targetType: 2,
					},
				}).then((res) => {
					ctx.body = {
						status: 200,
						msg: '回答删除成功',
					}
				})
			})
		} else {
			ctx.body = {
				status: 500,
				msg: '答案不存在或者没有权限',
			}
		}
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------删除回答接口结束------ */

/* ------更新回答接口开始------ */
router.post('/answer/updata', async (ctx, next) => {
	//获取作者id,回答id,回答内容和回答简介参数
	const { creatorId, answerId, content, excerpt } = ctx.request.body
	//创建更新条件
	const where = {
		creatorId,
		id: answerId,
	}
	try {
		//首先查询是否存在
		const answerExist = await Answers.findOne({ where })
		if (answerExist) {
			await Answers.update(
				{
					content,
					excerpt,
				},
				//更新条件
				{
					where,
				}
			).then((res) => {
				ctx.body = {
					status: 200,
					msg: '答案修改成功',
				}
			})
		} else {
			ctx.body = {
				status: 500,
				msg: '答案不存在或者没有权限',
			}
		}
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------更新回答接口结束------ */

module.exports = router
