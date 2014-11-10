'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , EventProcessor	= require(require('cerber').daemonPath + '/EventProcessor.js')
  , coroutine		= require('coroutine')

module.exports = APIRequest.inherit({

    route: '/rules/del',

	gen_process: coroutine(function*(data, request, g) {

		var answer = { ok: true }
		var event_id = yield EventProcessor.addChange('delete_rule', request.login.id, config.object_types_map.rule, data.rule_id, {}, g.resume)
		if(data.sync) {
			var waitingResult = yield EventProcessor.waitForEventCompleted(event_id, g.resume)
			answer.waitingResult = waitingResult
		}

		return answer
	}),

})