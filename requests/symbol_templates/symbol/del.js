'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , EventProcessor	= require(require('cerber').daemonPath + '/EventProcessor.js')
  , coroutine		= require('coroutine')

module.exports = APIRequest.inherit({

    route: '/symbol_templates/symbol/del',

	gen_process: coroutine(function*(data, request, g) {

        var allow = false

	    if(request.rights.all) {
        	allow = true
    	}

        else if (request.rights.edit_template_lg) {
        	var rows = yield mysqlpool.query('select * from symbol_templates as s where id = ?', [ data.symbol_template_id ], g.resume)
        	rows = yield mysqlpool.query('select * from logins where id = ?', [ rows[0].creator_login_id ], g.resume)
        	if(rows[0].login_group_id == request.login.login_group_id) {
        		allow = true
        	}
		}

		else {
        	var rows = yield mysqlpool.query('select * from symbol_templates as s where id = ?', [ data.symbol_template_id ], g.resume)
        	if(rows[0].creator_login_id == request.login.id) {
        		allow = true
        	}
		}

		if (allow) {
			var result = yield mysqlpool.query('delete from symbol_template_composition where symbol_template_id = ? and symbol = ?',
				[ data.symbol_template_id, data.symbol ], g.resume)

			var event_id = yield EventProcessor.addChange('symbol_template_del_symbol', request.login.id, config.object_types_map.symbol_template, data.symbol_template_id, data, g.resume)

			return { ok: true }
		}

		return { access_denied: true }
	}),

})