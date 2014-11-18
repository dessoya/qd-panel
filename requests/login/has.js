'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , EventProcessor	= require(require('cerber').daemonPath + '/EventProcessor.js')
  , coroutine		= require('coroutine')
  , commhelpers		= require('commhelpers')
  , util			= require('util')

var logn_re = /^\d+$/
var api_port_re = /api_port=(\d+)/

module.exports = APIRequest.inherit({

    route: '/login/has',

	need_auth: false,

	gen_process: coroutine(function*(data, request, g) {

	    var c = config.services.mt4

	    var login = data.login, result

		// console.log(util.inspect(data,{depth:null}))

		var rows = yield bridge_mysqlpool.query('SELECT * FROM service where id = ' + data.server_id, g.resume)
		var row = rows[0]
		// console.log('host ' + row.host)
		var port, a 
		if(a = api_port_re.exec(row.extras)) {
			port = a[1]
		}
		else {
			port = c.port
		}

	    if(logn_re.exec(login)) {
	        // console.log('account')
			result = yield commhelpers.request(row.host, port, '/account/has', { login: parseInt(login) }, g.resume, { raw: true, withStatus: true })
		}
		else {
	        // console.log('group')
			result = yield commhelpers.request(row.host, port, '/group/has', { group: login }, g.resume, { raw: true, withStatus: true })
		}

		// console.log(util.inspect(result,{depth:null}))

		return result[0] === 200 ? true : false

	}),

})