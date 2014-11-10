'use strict'

var APIRequest		= require(require('cerber').daemonPath + '/APIRequest.js')
  , coroutine		= require('coroutine')

module.exports = APIRequest.inherit({

    route: '/symbol_templates/get',

	gen_process: coroutine(function*(data, request, g) {

        var answer = null, rows

		if(data && data.id) {

    	    if(request.rights.all) {
	        	console.log('/symbol_templates/get all')
				rows = yield mysqlpool.query('select s.id, s.name from symbol_templates as s where s.id = ' + data.id, g.resume)
				rows = rows[0]
				answer = { symbol_template: { id: rows.id, name: rows.name } }
        	}
    	    // login group
	        else if (request.rights.get_template_lg) {
    	    	console.log('/symbol_templates/get lg')
				rows = yield mysqlpool.query('select \
					s.id, \
					s.name, \
					l.login_group_id \
				from \
					symbol_templates as s \
					left join logins as l on l.id = s.creator_login_id \
				where s.id = ' + data.id, g.resume)
				rows = rows[0]

				if(rows.login_group_id === request.login.login_group_id) {
					answer = { symbol_template: { id: rows.id, name: rows.name } }
				}
			}
			else {
        		console.log('/symbol_templates/get l')
				rows = yield mysqlpool.query('select s.id, s.name from symbol_templates as s where s.id = ' + data.id + ' and s.creator_login_id = ' + request.login.id, g.resume)

				if(rows.length > 0) {
					rows = rows[0]
					answer = { symbol_template: { id: rows.id, name: rows.name } }
				}
			}

		}

		else {

        	// all
	        if(request.rights.all) {
    	    	console.log('/symbol_templates/get all')
				rows = yield mysqlpool.query('select s.*, rc.rules_count from symbol_templates as s left join (select symbol_template_id, count(*) as rules_count from rules group by symbol_template_id) rc on rc.symbol_template_id = s.id order by id', g.resume)
	        }
    	    // login group
        	else if (request.rights.get_template_lg) {
	        	console.log('/symbol_templates/get lg')
				rows = yield mysqlpool.query('select \
				s.*, \
				rc.rules_count, \
				l.login_group_id \
        	from \
        		symbol_templates as s \
	        	left join (select symbol_template_id, count(*) as rules_count from rules group by symbol_template_id) rc on rc.symbol_template_id = s.id \
    	    	left join logins as l on l.id = s.creator_login_id \
	        where \
    	    	l.login_group_id = ? \
        	order by \
	        	id', [ request.login.login_group_id ], g.resume)
			}
			else {
        		console.log('/symbol_templates/get l')
				rows = yield mysqlpool.query('select s.*, rc.rules_count from symbol_templates as s left join (select symbol_template_id, count(*) as rules_count from rules group by symbol_template_id) rc on rc.symbol_template_id = s.id where s.creator_login_id = ? order by id', [ request.login.id ], g.resume)
			}

			answer = { list: rows }
		}

		if(null === answer) {
			answer = { access_denied: true }
		}

		return answer		
	}),

}) 