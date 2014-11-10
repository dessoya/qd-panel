'use strict'

var coroutine		= require('coroutine')
  , EventProcessor	= require(require('cerber').daemonPath + '/EventProcessor.js')

eventProcessor.events.symbol_template_del = coroutine(function*(event, login_id, object_type_id, object_id, data, g) {

	var rows = yield mysqlpool.query('select id, rule_type from rules where symbol_template_id = ' + object_id, g.resume)
	for(var i = 0, l = rows.length; i < l; i ++) {
		var row = rows[i]
		var event_id = yield EventProcessor.addChange('delete_rule', login_id, config.object_types_map.rule, row.id, data, g.resume)		
	}

})
