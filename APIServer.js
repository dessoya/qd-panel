'use strict'

var Phoenix			= require('phoenix')
  , fs				= require('fs')
  , cerber			= require('cerber')

function create(config) {

	var httpserver =  Phoenix.create({ port: config.port
		//	,hideRequestMessage:true
/*
		, https: true
		, key: fs.readFileSync(cerber.daemonPath + '/ssl/key.pem')
		, cert: fs.readFileSync(cerber.daemonPath + '/ssl/key-cert.pem')
*/
	}

	, require('./requests/auth/login.js')
	, require('./requests/auth/logout.js')

	, require('./requests/symbol_templates/get.js')
	, require('./requests/symbol_templates/add.js')
	, require('./requests/symbol_templates/del.js')

	, require('./requests/symbol_templates/symbol/add.js')
	, require('./requests/symbol_templates/symbol/get.js')
	, require('./requests/symbol_templates/symbol/del.js')

	, require('./requests/rules/hint.js')
	, require('./requests/rules/add.js')
	, require('./requests/rules/get.js')
	, require('./requests/rules/del.js')

	/*
	{

		, '/rules/hint': require('./requests/rules/hint.js')
		, '/rules/add': require('./requests/rules/add.js')
		, '/rules/get': require('./requests/rules/get.js')
		, '/rules/del': require('./requests/rules/del.js')

		, '/auth/login': require('./requests/auth/login.js')
		, '/auth/logout': require('./requests/auth/logout.js')

	}
	*/
	)

	return httpserver
}


module.exports = {
	create: create
}