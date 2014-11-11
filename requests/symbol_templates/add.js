'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , EventProcessor	= require(require('cerber').daemonPath + '/EventProcessor.js')
  , coroutine		= require('coroutine')

module.exports = APIRequest.inherit({

    route: config.apiserver.prefix+'/symbol_templates/add',

	gen_process: coroutine(function*(data, request, g) {

/*
	{
		data: "name"
	}
*/		
        if(request.rights.add_template || request.rights.all) {

			var result = yield mysqlpool.query('insert into symbol_templates (name, creator_login_id) values (?,?)', [ data.name, request.login.id ], g.resume)

			var answer = { symbol_template_id: result.insertId }

			var event_id = yield EventProcessor.addChange('symbol_template_add', request.login.id, config.object_types_map.symbol_template, result.insertId, { name: data.name }, g.resume)
			if(data.sync) {
				var waitingResult = yield EventProcessor.waitForEventCompleted(event_id, g.resume)
				answer.waitingResult = waitingResult
			}

			return answer
		}

		return { access_denied: true }
	}),

})