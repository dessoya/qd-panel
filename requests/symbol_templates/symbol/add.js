'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , EventProcessor	= require(require('cerber').daemonPath + '/EventProcessor.js')
  , coroutine		= require('coroutine')

module.exports = APIRequest.inherit({

    route: config.apiserver.prefix+'/symbol_templates/symbol/add',

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
			var result = yield mysqlpool.query('insert into symbol_template_composition (symbol_template_id,symbol,echo_symbol,bid_markup,ask_markup,min_spread,max_spread,depth,priority,timeout,price_left,price_right,factor) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
				[ data.symbol_template_id, data.symbol, data.echo_symbol, data.bid_markup, data.ask_markup, data.min_spread, data.max_spread, data.depth, data.priority, data.timeout, data.price_left, data.price_right, data.factor ], g.resume)

			var event_id = yield EventProcessor.addChange('symbol_template_add_symbol', request.login.id, config.object_types_map.symbol_template, data.symbol_template_id, data, g.resume)

			return { ok: true }
		}

		return { access_denied: true }
	}),

})