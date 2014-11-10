'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , coroutine		= require('coroutine')

module.exports = APIRequest.inherit({

	gen_process: coroutine(function*(data, g) {

		console.dir(data)
		var rows = yield mysqlpool.query('select * from servers order by id', g.resume)		

		return rows
	}),

})