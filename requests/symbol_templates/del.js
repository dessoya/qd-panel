'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , EventProcessor	= require(require('cerber').daemonPath + '/EventProcessor.js')
  , coroutine		= require('coroutine')

module.exports = APIRequest.inherit({

    route: '/symbol_templates/del',

	gen_process: coroutine(function*(data, request, g) {

/*
	{
		id: number
	}
*/		
		var result = {}, allow = false

		if(request.rights.all) {
			allow = true
		}

		else if (request.rights.del_template_lg) {
			var rows = yield mysqlpool.query('select l.login_group_id from symbol_templates as s left join logins as l on l.id = s.creator_login_id where s.id = ' + data.id, g.resume)
			if(rows[0].login_group_id == request.login.login_group_id) {
				allow = true
			}			
		}

		else if (request.rights.del_template) {
			var rows = yield mysqlpool.query('select s.creator_login_id from symbol_templates as s where s.id = ' + data.id, g.resume)
			if(rows[0].creator_login_id == request.login.id) {
				allow = true
			}			
		}

		if(allow) {

			var rows = yield mysqlpool.query('delete from symbol_templates where id = ' + data.id, g.resume)		
			rows = yield mysqlpool.query('delete from symbol_template_composition where symbol_template_id = ' + data.id, g.resume)		

			var event_id = yield EventProcessor.addChange('symbol_template_del', request.login.id, config.object_types_map.symbol_template, data.id, {}, g.resume)
		}
		else {
			result = { access_denied: true }
		}

		return result
	}),

})