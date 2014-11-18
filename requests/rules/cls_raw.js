'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , coroutine		= require('coroutine')

module.exports = APIRequest.inherit({

    route: '/rules/cls/raw',
	
	gen_process: coroutine(function*(data, request, g) {

        var answer = { }

		answer.raw = yield bridge_mysqlpool.query('SELECT * FROM cls_rule where login_or_group = ? order by id', [ '' + data.login ], g.resume)

		var rows = yield bridge_mysqlpool.query('SELECT * FROM service', g.resume)
		var services = answer.services = { }
		for(var i = 0, l = rows.length; i < l; i++) {
		    var row = rows[i]
			services[row.id] = row
		}

		rows = yield mysqlpool.query('SELECT * FROM operation_events', g.resume)
		var operations = answer.operations = { }
		for(var i = 0, l = rows.length; i < l; i++) {
		    var row = rows[i]
			operations[row.id] = row
		}

		return answer
	}),

})