'use strict'

var Phoenix			= require('phoenix')
  , coroutine		= require('coroutine')

module.exports = Phoenix.Request.inherit({

	need_auth: true,

	onRequest: function() {
		
		//console.log('asd')
		this.rights = {}

		/* istanbul ignore else */
		if('POST' === this.req.method) {
			this.readPost();
		}
		else {
			this.process(this.info.query)
		}
	},

	onPostReaded: function(data) {
		this.process(data)
	},

	process: function(data) {
		this.gen_auth_process(data, this, function(err, result) {
			if(err) {
				console.showError(err)

				var answer = { status: "error", error: "error while execute script" }

				var message = JSON.stringify(answer)
				this.writeHead(200, {'Content-Type': 'application/json; charset=utf-8','Content-Length': Buffer.byteLength(message, 'utf8')})
				this.end(message)
			}
		}.bind(this))
	},

	gen_auth_process: coroutine(function*(data, request, g) {
	    
	    var answer = null

		/* istanbul ignore else */
		if(request.need_auth) {

	    	var rows = yield mysqlpool.query('SELECT * FROM auth_sessions where session_hash = ?', [ data.session_hash ? data.session_hash : '' ], g.resume)

	        if(rows.length > 0 && rows[0].state === 'auth') {

	            var login_id = rows[0].login_id
			    rows = yield mysqlpool.query('SELECT * FROM logins where id = ' + login_id, g.resume)

		    	request.login = rows[0]
				rows = yield mysqlpool.query('SELECT \
					operation \
				FROM \
					login_roles as r \
					left join role_operations as o on o.role_id = r.role_id \
					left join operations as op on op.id = o.operation_id \
				where \
					login_id = ' + login_id, g.resume)

		    	for(var i = 0, l = rows.length; i < l; i++) {
		    		request.rights[rows[i].operation] = true
		    	}
		    	// console.dir(request.rights)
			}
			else {
				answer = { status: "error", error: "not logged" }
			}
		}

		//console.log('request.rights')
    	//console.dir(request.rights)

		if(null === answer) {
			var result = yield request.gen_process(data, request, g.resume)
			answer = { status: "ok", result: result }
		}	

		var message = JSON.stringify(answer)
		request.writeHead(200, {'Content-Type': 'application/json; charset=utf-8','Content-Length': Buffer.byteLength(message, 'utf8')})
		request.end(message)
	}),

}, require('./middlewares/AccessControlAllowOrigin.js'))
