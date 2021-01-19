const router = require('koa-router')()
// 引入User
let User = require('../models/User')

router.get('/users/list', async (ctx) => {
	try {
		const list = await User.findAll()
		ctx.body = {
			code: 200,
			msg: 'success',
			data: list,
		}
	} catch (err) {
		console.log(err)
	}
})

module.exports = router
