'use strict'

var coroutine = require('coroutine')

eventProcessor.events.rule_classic_del_symbol = coroutine(function*(event, login_id, object_type_id, object_id, data, g) {

	var rule = yield mysqlpool.query('select * from rules where id = ' + object_id, g.resume)
	rule = rule[0]

	var li = JSON.parse(rule.link_information)
	var bridge_ids = li.bridge_ids
	var symbol_map = li.symbol_map

	
	var line_id = symbol_map[data.symbol]
	delete symbol_map[data.symbol]
	bridge_ids.splice(bridge_ids.indexOf(line_id), 1)

	yield bridge_mysqlpool.query('delete from cls_rule where id = ' + line_id, g.resume)

	var li = { symbol_map: symbol_map, bridge_ids: bridge_ids }

	var result = yield mysqlpool.query('update rules set link_information = ? where id = ' + object_id,
		[ JSON.stringify(li) ], g.resume)

})


