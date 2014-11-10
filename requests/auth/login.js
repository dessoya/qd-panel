'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , coroutine		= require('coroutine')
  , crypto			= require('crypto')

module.exports = APIRequest.inherit({

    route: '/auth/login',

	need_auth: false,

	gen_process: coroutine(function*(data, request, g) {

	/*
		data.login
		data.password_hash
	*/
	    // console.log('l 1')
		var rows = yield mysqlpool.query('select * from logins where login = ? and password_hash = ?', [ data.login ? data.login : '', data.password_hash ? data.password_hash : '' ], g.resume)
		if(rows.length > 0) {

		    // console.log('l 2')
			var login_id = rows[0].id

		    var session_hash = null
		    if(data.session_hash && 'string' === typeof data.session_hash) {
				var result = yield mysqlpool.query('select * from auth_sessions where session_hash = ?', [ data.session_hash ], g.resume)
				if(result.length > 0) {
					session_hash = data.session_hash
					yield mysqlpool.query('update auth_sessions set login_id = ?, state = "auth" where session_hash = ?', [ login_id, data.session_hash ], g.resume)
				}
		    }


		    if(null === session_hash) {
			    session_hash = crypto.createHash('md5')
				session_hash.update('' + Math.random() + '#' + Date.now())
				session_hash = session_hash.digest('hex')

				var result = yield mysqlpool.query('insert into auth_sessions (session_hash, state, login_id, auth_ts) values (?,?,?,now())', [ session_hash, 'auth', login_id ], g.resume)
			}

			return { auth: true, session_hash: session_hash }
		}

		return { auth: false }
	}),

})