// 引入路由
const router = require('koa-router')()
// 引入questions模型
const Questions = require('../models/Question')
// 引入utils
const utils = require('../libs/utils')
// 引入lodash
const _ = require('lodash')
// 获取attribute变量
const { userAttributes, questionAttributes } = require('../config/default')

/* ------创建问题接口开始------ */
router.post('/questions/create', async (ctx, netx) => {
	const { discription, excerpt, title, userId } = ctx.request.body
	try {
		//创建一条数据
		await Questions.create({
			//问题描述
			discription,
			//问题简介
			excerpt,
			//问题标题
			title,
			//作者id
			creatorId: userId,
			//类型
			type: 1,
		}).then((res) => {
			ctx.body = {
				status: 200,
				msg: '创建问题成功',
				data: res.dataValues.id,
			}
		})
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------创建问题接口结束------ */

/* ------更新问题接口开始------ */
router.post('/questions/update', async (ctx, next) => {
	//获取修改后问题修改
	const { questionId, content, excerpt, title, userId } = ctx.request.body
	//确定待修改问题的唯一性
	const where = {
		// 问题id
		id: questionId,
		// 作者id
		creatorId: userId,
	}
	try {
		// 先判断待修改问题是否存在
		const questionExist = await Questions.findOne({ where })
		// 问题不存在
		if (!questionExist) {
			ctx.body = {
				status: 201,
				msg: '问题不存在或者没有权限',
			}
		} else {
			//更新问题
			await Questions.update(
				{
					// 问题描述
					discription: content,
					// 问题简介
					excerpt,
					// 问题标题
					title,
				},
				{
					// 查询参数
					where,
				}
			).then((res) => {
				ctx.body = {
					status: 200,
					msg: '问题修改成功',
				}
			})
		}
	} catch (err) {
		utils.catchError(err)
	}
})
/* ------更新问题接口结束 */

/* ------问题查询单个接口开始------ */
router.post('/questions/get', async (ctx, next) => {
	const { questionsId } = ctx.request.body
	const where = {
		id: questionsId,
	}
	try {
		await Questions.findOne({
			where,
			attributes: questionAttributes,
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
/* ------问题查询单个接口结束------ */

/* ------问题查询表接口开始------ */
router.post('/questions/getList', async (ctx, next) => {
	try {
		// 定义查询顺序，以id倒序查询
		// * asc正向排序 desc逆向排序 nat自然排序
		const order = [['id', 'DESC']]
		// 限制查询个数为10个
		const limit = 10
		// 调用findAll方法查询
		await Questions.findAll({
			// 查询顺序
			order,
			// 查询个数
			limit,
			// 包含参数
			// include: articleInclude,
			// 查询参数
			attributes: questionAttributes,
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
/* ------问题查询表接口结束------ */

module.exports = router
