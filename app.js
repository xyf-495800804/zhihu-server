/* 入口文件 */
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaBody = require('koa-body')
const path = require('path')
const staticFiles = require('koa-static')

const create = require('./routes/create')
const login = require('./routes/login')
const checkLogin = require('./routes/checkLogin')
const logout = require('./routes/logout')
const save = require('./routes/save')
const imgs = require('./routes/imgs')
const articles = require('./routes/articles')
const questions = require('./routes/questions')
const answers = require('./routes/answers')
const comments = require('./routes/comments')

// error handler
onerror(app)

// middlewares
app.use(
	// 使用koabody获取请求体内容
	koaBody({
		// 多类型支持
		multipart: true,
		// 如果为true,则不解析get head,delete请求
		strict: false,
		formidable: {
			//设置上传文件大小最大限制,默认2MB,修改为20MB
			maxFileSize: 200 * 1024 * 1024,
		},
	})
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(
	views(__dirname + '/views', {
		extension: 'pug',
	})
)

app.use(staticFiles(path.join(__dirname + './public/')))

// logger
app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(create.routes(), create.allowedMethods())
app.use(login.routes(), login.allowedMethods())
app.use(checkLogin.routes(), checkLogin.allowedMethods())
app.use(logout.routes(), logout.allowedMethods())
app.use(save.routes(), save.allowedMethods())
app.use(imgs.routes(), imgs.allowedMethods())
app.use(articles.routes(), articles.allowedMethods())
app.use(questions.routes(), questions.allowedMethods())
app.use(answers.routes(), answers.allowedMethods())
app.use(comments.routes(), comments.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
})

module.exports = app
