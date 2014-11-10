'use strict'

var coroutine = require('coroutine')

eventProcessor.events.create_classic_rule = coroutine(function*(event, login_id, object_type_id, object_id, data, g) {

	var rule = data
	var template = yield mysqlpool.query('select * from symbol_template_composition where symbol_template_id = ' + data.symbol_template_id, g.resume)

	var bridge_ids = [], symbol_map = {}
	for(var i = 0, l = template.length; i < l; i ++) {
		var tline = template[i]

		var record = {
			source_id: rule.source_id,
			symbol: tline.symbol,
			echo_symbol: tline.echo_symbol,
			login_or_group: rule.login ? rule.login : rule.group,
			type: rule.operation_event_id,
			feeder_id: rule.feedor_id ? rule.feedor_id : 0,
			target_id: rule.target_id,
			timeout: tline.timeout ? tline.timeout : 0,
			bid_markup: tline.bid_markup ? tline.bid_markup : 0,
			ask_markup: tline.ask_markup ? tline.ask_markup : 0,
		}
		var names = [], v = [], values = []
		for(var key in record) {
			names.push(key)
			v.push('?')
			values.push(record[key])
		}
		
		var row = yield bridge_mysqlpool.query('insert into cls_rule (' + names.join(',') + ') values (' + v.join(',') + ')', values, g.resume)

		bridge_ids.push(row.insertId)
		symbol_map[tline.symbol] = row.insertId
	}
	var li = { symbol_map: symbol_map, bridge_ids: bridge_ids }

	var result = yield mysqlpool.query('update rules set rule_type = ?,source_id = ?,login = ?,`group` = ?,operation_event_id = ?,target_id = ?,feedor_id = ?,symbol_template_id = ?, link_information = ? where id = ' + object_id,
		[ 'classic', data.source_id, data.login, data.group, data.operation_event_id, data.target_id, data.feedor_id, data.symbol_template_id, JSON.stringify(li) ], g.resume)

})
