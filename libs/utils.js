//引入lodash
const _ = require('lodash')
//写入cookie方法
exports.setCookies = (ctx, info) => {
	//判断参数类型是否为object
	if (!_.isObject(info)) {
		//不是object直接返回
		return false
	}
	//循环info参数
	_.forIn(info, (value, key) => {
		//koa自带的设置cookies方法
		ctx.cookies.set(key, encodeURIComponent(value), {
			// 写cookies所在的域名
			domain: 'localhost',
			//写cookies所在的路径
			path: '/',
			//cookies有效时长
			maxAge: 3 * 60 * 60 * 1000,
			//是否只用于http请求中获取
			httpOnly: false,
			//是否允许重写
			overwrite: false,
		})
	})
}

// 删除cookies的方法
exports.destoryCookies = (ctx, info) => {
	//判断参数类型是否为object
	if (!_.isObject(info)) {
		//不是object直接返回
		return false
	}
	//循环info参数
	_.forIn(info, (value, key) => {
		//koa自带的设置cookies方法
		ctx.cookies.set(key, value, {
			//有效时长设置负数则删掉Cookies
			maxAge: -1,
		})
	})
}

//捕获错误方法
exports.catchError = (ctx, err) => {
	//返回错误信息
	ctx.resError = err
}
