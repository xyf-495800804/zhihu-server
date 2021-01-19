// Load the full build.
const _ = require('lodash')
// 引入路由
const router = require('koa-router')()
// 引入User
let User = require('../models/User')

/* ------注册接口开始------ */
router.post('/users/create', async (ctx, next) => {
	// 获取请求参数
	const { name, pwd, pwdtwo, email } = ctx.request.body
	try {
		//获取所有用户数据
		const infoList = await User.findAll({
			//只需要用户名和邮箱字段
			attributes: ['name', 'email'],
		})
		//获取所有的用户名
		const nameList = _.map(infoList, (item) => {
			item.dataValues.name
		})
		//用户名重复校验
		if (_.includes(nameList, name)) {
			// 返回状态和错误信息
			ctx.body = {
				status: 203,
				msg: '用户名重复,请更换用户名',
			}
			return
		}

		//获取所有邮箱
		const uniquedEmailList = _.map(infoList, (item) => {
			item.dataValues.email
		})
		//邮箱重复校验
		if (uniquedEmailList.includes(email)) {
			//返回状态和错误信息
			ctx.body = {
				status: 203,
				msg: '邮箱已存在,请更换邮箱或者直接登录',
			}
			return
		}
		//新增用户操作
		await User.create({
			name,
			pwd,
			pwdtwo,
			email,
		}).then((res) => {
			ctx.body = {
				status: 201,
				msg: '注册成功',
				data: res,
			}
		})
	} catch (err) {
		console.log(err)
	}
})
/* ------注册接口结束------ */

module.exports = router
