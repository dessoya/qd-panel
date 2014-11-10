'use strict'

var assert				= require('assert')
  , util				= require('util')
  , coroutine			= require('coroutine')

  , phoenix_test		= require('phoenix_test')
  , mysql_test			= require('mysql_test')

  , APIRequest			= require('./../APIRequest.js')

describe('APIRequest', function() {

	it('case 1 unauth', function(done) {

	    global.mysqlpool = mysql_test.create({
	    	'SELECT * FROM auth_sessions where session_hash = ""': []
	    })
	    
	    var R = APIRequest.inherit({

		    gen_process: coroutine(function*(data, request, g) {

		    })
	    
	    })

		var req = phoenix_test.HTTPRequest.create(
			'/test',
			{ },
			{ }
		)

		var res = phoenix_test.HTTPResponse.create(function() {
		    // console.log(util.inspect(res,{depth:null}))

			assert.strictEqual(res.headers['Content-Type'], 'application/json; charset=utf-8', 'check 1')
			assert.strictEqual(res.headers['Content-Length'], 39, 'check 2')
			assert.strictEqual(res.status, 200, 'check 3')

			var content = '{"status":"error","error":"not logged"}'
			assert.strictEqual(res.content, content, 'check 4')

			done()
		})

	    R.create(req, res, req.info, { hideRequestMessage: true }).onRequest()
	    
	})

	it('case 2 error', function(done) {

	    global.mysqlpool = mysql_test.create({
	    	// 'SELECT * FROM auth_sessions where session_hash = ""': []
	    })
	    
	    var R = APIRequest.inherit({

		    gen_process: coroutine(function*(data, request, g) {
				// a = b
		    })
	    
	    })

		var req = phoenix_test.HTTPRequest.create(
			'/test',
			{ },
			{ }
		)

		var res = phoenix_test.HTTPResponse.create(function() {
		    // console.log(util.inspect(res,{depth:null}))

			assert.strictEqual(res.headers['Content-Type'], 'application/json; charset=utf-8', 'check 1')
			assert.strictEqual(res.headers['Content-Length'], 55, 'check 2')
			assert.strictEqual(res.status, 200, 'check 3')

			var content = '{"status":"error","error":"error while execute script"}'
			assert.strictEqual(res.content, content, 'check 4')

			console.showError = old
			done()
		})

		var old = console.showError
		console.showError = function() {}
	    R.create(req, res, req.info, { hideRequestMessage: true }).onRequest()
	})

	it('case 3 logged', function(done) {

	    global.mysqlpool = mysql_test.create({
	    	'SELECT * FROM auth_sessions where session_hash = "1234"': [
	    		{ state: "auth", login_id: 1 }
	    	],

	    	'SELECT * FROM logins where id = 1': [
	    		{ id: 1, login_group_id: 1 }
	    	],

	    	'SELECT \
					operation \
				FROM \
					login_roles as r \
					left join role_operations as o on o.role_id = r.role_id \
					left join operations as op on op.id = o.operation_id \
				where \
					login_id = 1': [
					{ operation: 'all' }
			]
	    })
	    
	    var R = APIRequest.inherit({

		    gen_process: coroutine(function*(data, request, g) {
				// a = b
				return true
		    })
	    
	    })

		var req = phoenix_test.HTTPRequest.create(
			'/test',
			{ },
			{ session_hash: "1234" }
		)
		var r

		var res = phoenix_test.HTTPResponse.create(function() {
		    //console.log(util.inspect(res,{depth:null}))
		    //console.log(util.inspect(r,{depth:null}))

			assert.strictEqual(res.headers['Content-Type'], 'application/json; charset=utf-8', 'check 1')
			assert.strictEqual(res.headers['Content-Length'], 29, 'check 2')
			assert.strictEqual(res.status, 200, 'check 3')

			var content = '{"status":"ok","result":true}'
			assert.strictEqual(res.content, content, 'check 4')

			assert.deepEqual(r.rights, { all: true }, 'check 5')

			done()
		})

		var old = console.showError
		// console.showError = function() {}
	    r = R.create(req, res, req.info, { hideRequestMessage: true })
	    r.onRequest()
	})
})