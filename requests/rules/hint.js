'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , coroutine		= require('coroutine')

module.exports = APIRequest.inherit({

    route: config.apiserver.prefix+'/rules/hint',

	gen_process: coroutine(function*(data, request, g) {

		bridge_mysqlpool.query('SELECT id, name FROM service where type = 0 order by id', g.group(1,1))
		mysqlpool.query('SELECT id, name FROM operation_events order by id', g.group(1,2))

   	    if(request.rights.all) {
		
			mysqlpool.query('SELECT id, name FROM symbol_templates order by id', g.group(1,3))
		}

        else if (request.rights.get_template_lg) {

			mysqlpool.query('select \
				s.id, \
				s.name \
        	from \
        		symbol_templates as s \
	        	left join (select symbol_template_id, count(*) as rules_count from rules group by symbol_template_id) rc on rc.symbol_template_id = s.id \
    	    	left join logins as l on l.id = s.creator_login_id \
	        where \
    	    	l.login_group_id = ? \
        	order by \
	        	id', [ request.login.login_group_id ], g.group(1,3))
        }

		else {

			mysqlpool.query('SELECT id, name FROM symbol_templates where creator_login_id = ' + request.login.id + ' order by id', g.group(1,3))
		}

		bridge_mysqlpool.query('SELECT id, name FROM service where type = 3 order by id', g.group(1,4))
		bridge_mysqlpool.query('SELECT id, name FROM service where type = 2 order by id', g.group(1,5))

		var result = yield 0

		// console.log(result.times)

		return {
			sources: result[1][1].result,
			operations: result[1][2].result,
			templates: result[1][3].result,
			feedors: result[1][4].result,
			targets: result[1][5].result,
		}
	}),

})