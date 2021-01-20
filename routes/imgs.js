// 引入路由
const router = require('koa-router')()
// 引入fs读取
const fs = require('fs')
// 引入当前路径
const path = require('path')
// 引入crypto-js插件
const CryptoJS = require('crypto-js')
// 引入moment插件
const moment = require('moment')

/* ------新建保存文章接口开始------ */
router.post('/imgs/upload', async (ctx, next) => {
	//获取上传文件
	const file = ctx.request.files.file
	//利用时间和文件获取唯一的hash值
	var hash = (hash = CryptoJS.MD5(`${file.path}_${moment()}`))
	// 创建可读流
	const reader = fs.createReadStream(file.path)
	// 创建文件路径
	let filePath =
		path.join(__dirname, '../public/images') +
		`/${hash}.${file.name.split('.').pop()}`
	// 创建可写流
	const upStream = fs.createWriteStream(filePath)
	// 可读流通过管道写入可写流
	reader.pipe(upStream)
	// 图片写入成功后返回值
	ctx.body = {
		status: 200,
		fileName: `${hash}.${file.name.split('.').pop()}`,
		filePath: filePath,
	}
})
/* ------新建保存文章接口结束------ */

module.exports = router
