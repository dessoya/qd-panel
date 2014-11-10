'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , coroutine		= require('coroutine')
  , crypto			= require('crypto')

module.exports = APIRequest.inherit({

    route: '/auth/logout',

	need_auth: false,

	gen_process: coroutine(function*(data, request, g) {

	/*
		console.dir(data)
		var rows = yield mysqlpool.query('select * from servers order by id', g.resume)		

		return rows
	*/

	/*
		data.login
		data.password_hash
	*/
		var rows = yield mysqlpool.query('update auth_sessions set state = "guest", login_id = 0 where session_hash = ?', [ data.session_hash ? data.session_hash : '' ], g.resume)
		return { ok: true }
	}),

})