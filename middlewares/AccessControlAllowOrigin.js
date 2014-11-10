'use strict'

var Class = require('class'), util = require('util')

var AccessControlAllowOrigin = module.exports = Class.inherit({

	middleware: function() {
/*	    
	    console.log(util.inspect(this,{depth:null,showHidden:true}))
	    console.log(util.inspect(this.prototype,{depth:null,showHidden:true}))
	    console.log(this.route)
*/
		this.setHeader('Access-Control-Allow-Origin', '*')
	}

})

