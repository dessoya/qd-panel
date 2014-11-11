'use strict'

var cerber			= require('cerber')
  , http			= require('http')
  , errors			= require('errors')
  , fs				= require('fs')
  , mysql			= require('mysql')
  , coroutine		= require('coroutine')

http.globalAgent.maxSockets = 200
errors.activateCatcher()
cerber.initService()

var APIServer			= require('./APIServer.js')
  , EventProcessor		= require('./EventProcessor.js')


var gen_init = coroutine(function*(g) {

	global.config = JSON.parse(yield fs.readFile(cerber.daemonPath + '/qd-panel.config.json', g.resume))
	global.config = global.config[process.env.QD_BRANCH ? process.env.QD_BRANCH : 'trunk']
	console.dir(config)
	
	global.mysqlpool = mysql.createPool(config.mysql)

	mysqlpool.on('connection', function (connection) {
		console.log('mysqlpool connection')
	})

	global.bridge_mysqlpool = mysql.createPool(config.mysql_bridge)

	// make object types information
	config.object_types_map = { }
	var rows = yield mysqlpool.query('select * from object_types', g.resume)
	for(var i = 0, l = rows.length; i < l; i++) {
		var row = rows[i]
		config.object_types_map[row.type] = row.id
	}
	for(var i = 0, c = config.object_types, l = c.length; i < l; i++) {
		var type = c[i]
		if(!(type in config.object_types_map)) {
			var row = yield mysqlpool.query('insert into object_types (`type`) values (?)', [ type ], g.resume)
			config.object_types_map[type] = row.insertId
			
		}
	}

	global.apiServer = APIServer.create(config.apiserver)

	global.eventProcessor = EventProcessor.create()

	require('./events/rule/create_bb_rule.js')
	require('./events/rule/create_classic_rule.js')
	require('./events/rule/rule_classic_add_symbol.js')	
	require('./events/rule/rule_bb_add_symbol.js')	
	require('./events/rule/delete_rule.js')	
	require('./events/rule/rule_classic_del_symbol.js')	
	require('./events/rule/rule_bb_del_symbol.js')	

	require('./events/symbol_template/symbol_template_add_symbol.js')
	require('./events/symbol_template/symbol_template_del.js')	
	require('./events/symbol_template/symbol_template_del_symbol.js')	
})

gen_init(function(err, result) {
	if(err) {
		errors.showError(err)
		process.exit()
	}
})

