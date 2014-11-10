'use strict'

var Request			= require('phoenix').Request
  , crypto			= require('crypto')

var re_spliter = /\s*\;\s*/, re_args_spliter = /\s*=\s*/

module.exports = {

	'?middleware': function(req,res,info) {
		var cookie = req._cookie = {}
		console.dir(req.headers)
		if(req.headers.cookie) {
			var pairs = req.headers.cookie.split(re_spliter)
			var i = pairs.length; while(i--) {
				var p = pairs[i].split(re_args_spliter)
				cookie[p[0]] = p[1]
			}
		}

		console.dir(cookie)
		var name = config.auth.cookie
		if(!(name in cookie)) {
		    
		    var sessionId = crypto.createHash('md5')
			sessionId.update('' + Math.random() + '#' + Date.now())
			sessionId = sessionId.digest('hex')

			console.log(name+'='+sessionId+'; expires=' + (new Date(Date.now()+60*1000*60*24*60)).toUTCString()+'; path=/')
			res.setHeader('Set-Cookie', name+'='+sessionId+'; expires=' + (new Date(Date.now()+60*1000*60*24*60)).toUTCString()+'; path=/')
		}

	}

}