'use strict'

var coroutine = require('coroutine')

eventProcessor.events.delete_rule = coroutine(function*(event, login_id, object_type_id, object_id, data, g) {

	var rows = yield mysqlpool.query('select * from rules where id = ' + object_id, g.resume), row = rows[0]
	var li = JSON.parse(row.link_information)

	yield mysqlpool.query('delete from rules where id = ' + object_id, g.resume)

	if(row.rule_type == 'bb') {
		if(li.bridge_ids.length) {
			yield bridge_mysqlpool.query('delete from bb_rule where id in (' + li.bridge_ids.join(',') + ')', g.resume)
		}
	}

	else if(row.rule_type == 'classic') {
		if(li.bridge_ids.length) {
			yield bridge_mysqlpool.query('delete from cls_rule where id in (' + li.bridge_ids.join(',') + ')', g.resume)
		}
	}

})
