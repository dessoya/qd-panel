'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , coroutine		= require('coroutine')

module.exports = APIRequest.inherit({

    route: '/symbol_templates/symbol/get',

	gen_process: coroutine(function*(data, request, g) {

        var allow = false

	    if(request.rights.all) {
        	allow = true
    	}
	    // login group
        else if (request.rights.get_template_lg) {

			rows = yield mysqlpool.query('select \
				s.id, \
				s.name, \
				l.login_group_id \
			from \
				symbol_templates as s \
				left join logins as l on l.id = s.creator_login_id \
			where s.id = ' + data.symbol_template_id, g.resume)
			rows = rows[0]

			if(rows.login_group_id === request.login.login_group_id) {
				allow = true
			}

		}
		else {

			rows = yield mysqlpool.query('select s.id, s.name from symbol_templates as s where s.id = ' + data.symbol_template_id + ' and s.creator_login_id = ' + request.login.id, g.resume)

			if(rows.length > 0) {
				allow = true
			}
		}

		if (allow) {
			var rows = yield mysqlpool.query('select * from symbol_template_composition where symbol_template_id = ' + data.symbol_template_id + ' order by symbol', g.resume)
			return { symbols: rows }
		}

		return { access_denied: true }
	}),

}) 