'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , coroutine		= require('coroutine')

module.exports = APIRequest.inherit({

    route: config.apiserver.prefix+'/rules/get',
	
	gen_process: coroutine(function*(data, request, g) {

        var answer = null

		var rules = []

		if(data.rule_type) {

    	    if(request.rights.all) {
				answer = { rules: yield mysqlpool.query('SELECT * from rules where rule_type = ? order by source_id, `group`, login, operation_event_id, symbol_template_id, target_id, feedor_id', [ data.rule_type ], g.resume) }
        	}

    	    // login group
	        else if (request.rights.get_template_lg) {
	            var rules = yield mysqlpool.query('SELECT \
					r.* \
				from \
					rules as r \
					left join logins as l on l.id = r.creator_login_id \
				where \
					r.rule_type = ? and l.login_group_id = ? \
				order by \
					r.source_id, r.`group`, r.login, r.operation_event_id, r.symbol_template_id, r.target_id, r.feedor_id', [ data.rule_type, request.login.login_group_id ], g.resume)

				answer = { rules: rules }
			}

			else {
				answer = { rules: yield mysqlpool.query('SELECT * from rules where rule_type = ? and creator_login_id = ? order by source_id, `group`, login, operation_event_id, symbol_template_id, target_id, feedor_id', [ data.rule_type, request.login.id ], g.resume) }
			}

		}
		else {
		}

		if(null === answer) {
			answer = { access_denied: true }
		}

		return answer
	}),

})