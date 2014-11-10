'use strict'

var coroutine = require('coroutine')

eventProcessor.events.rule_classic_add_symbol = coroutine(function*(event, login_id, object_type_id, object_id, data, g) {

	var rule = yield mysqlpool.query('select * from rules where id = ' + object_id, g.resume)
	rule = rule[0]

	var li = JSON.parse(rule.link_information)
	var bridge_ids = li.bridge_ids
	var symbol_map = li.symbol_map

	// console.log(rule)

	var record = {
		source_id: rule.source_id,
		symbol: data.symbol,
		echo_symbol: data.echo_symbol,
		login_or_group: rule.login ? rule.login : rule.group,
		type: rule.operation_event_id,
		feeder_id: rule.feedor_id ? rule.feedor_id : 0,
		target_id: rule.target_id,
		timeout: data.timeout ? data.timeout : 0,
		bid_markup: data.bid_markup ? data.bid_markup : 0,
		ask_markup: data.ask_markup ? data.ask_markup : 0,
	}
	var names = [], v = [], values = []
	for(var key in record) {
		names.push(key)
		v.push('?')
		values.push(record[key])
	}
	
	var row = yield bridge_mysqlpool.query('insert into cls_rule (' + names.join(',') + ') values (' + v.join(',') + ')', values, g.resume)

	bridge_ids.push(row.insertId)
	symbol_map[data.symbol] = row.insertId

	var li = { symbol_map: symbol_map, bridge_ids: bridge_ids }

	var result = yield mysqlpool.query('update rules set link_information = ? where id = ' + object_id,
		[ JSON.stringify(li) ], g.resume)

})
