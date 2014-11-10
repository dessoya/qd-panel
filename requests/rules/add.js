'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , EventProcessor	= require(require('cerber').daemonPath + '/EventProcessor.js')
  , coroutine		= require('coroutine')

module.exports = APIRequest.inherit({

    route: '/rules/add',

	gen_process: coroutine(function*(data, request, g) {

        var allow = false

		var right = 'add_' + data.rule_type + '_rule'

		if(request.rights[right] || request.rights.all) {
			allow = true
		}

		if (allow) {

			var result = yield mysqlpool.query('insert into rules (creator_login_id) values (?)', [ request.login.id ], g.resume)		

			var answer = { rule_id: result.insertId }

			var event_id = yield EventProcessor.addChange('create_' + data.rule_type + '_rule', request.login.id, config.object_types_map.rule, result.insertId, data, g.resume)
			if(data.sync) {
				var waitingResult = yield EventProcessor.waitForEventCompleted(event_id, g.resume)
				answer.waitingResult = waitingResult
			}

			return answer
		}

		return { access_denied: true }

	}),

})