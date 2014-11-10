'use strict'

var Class		= require('class')
  , coroutine	= require('coroutine')

var EventProcessor = Class.inherit({

	positionConfigKeyName: "change_events_position",

	onCreate: function() {
		this.events = {}
		coroutine(function*(eventProcessor, g) {
			var rows = yield mysqlpool.query('select value from config where name = ?', [ eventProcessor.positionConfigKeyName ], g.resume)
			var position
			if(rows.length == 0) {
				position = 0
				yield mysqlpool.query('insert into config (name, value) values (?, "0")', [ eventProcessor.positionConfigKeyName ], g.resume)
			}
			else {
				position = parseInt(rows[0].value)
			}
			eventProcessor.init(position)
		})(this, function(err, result){
			if(err) console.showError(err)
		})
	},

	init: function(position) {
		this.position = position
		this.intervalInProgress = false
		this.interval = setInterval(this.onInterval.bind(this), 500)
	},

	onInterval: function() {
		if(this.intervalInProgress) return
		this.intervalInProgress = true

		this.gen_readEvent(this, function(err, result) {
			this.intervalInProgress = false
			if(err) console.showError(err)
			else {
				if(result) this.onInterval()
			}
		}.bind(this))
	},

	gen_readEvent: coroutine(function*(eventProcessor, g) {
		
		var rows = yield mysqlpool.query('select * from change_events where id > ' + eventProcessor.position + ' order by id limit 1', g.resume)
		if(rows.length < 1) return false

		// console.log('read event')

		var row = rows[0], id = row.id

		if(row.state != 'new') return false
		console.log('treat event '+id+' state '+row.state)

		//
		mysqlpool.query('update change_events set state = "in_progress", in_progress_dt = now() where id = ' + id, g.none)
		// console.log('read 1')

		var event = row.event, data = 'string' === typeof row.event_data ? JSON.parse(row.event_data) : row.event_data

		var treator = event, execution_report = null, state = 'unknown'

		var etime_ms = 0
		if(treator in eventProcessor.events) {
			var etime = process.hrtime()
			var r = yield eventProcessor.events[treator](event, row.login_id, row.object_type_id, row.object_id, data, g.resumeWithError)
			if(r[0]) {
				console.showError(r[0])
				execution_report = JSON.stringify({error: r[0]})
				state = 'error'
			}
			else {
				state = 'done'
			}

			var diff = process.hrtime(etime)
			etime_ms = ((diff[0] * 1e9 + diff[1]) / 1e6).toFixed(0)
			// console.log('ms ' + etime_ms + ' ' + ((diff[0] * 1e9 + diff[1]) / 1e9).toFixed(6))
		}
		else {
			execution_report = JSON.stringify({treatorAbsent: true})
			state = 'done'
		}
		
		// console.log('read 2')
		//
		yield mysqlpool.query('update change_events set state = ?, execution_report = ?, execution_ms_time = ?, done_dt = now() where id = ' + id, [ state, execution_report, etime_ms ], g.resume)
		// console.log('read 3')


		if('done' === state) {
	        eventProcessor.position = id
			mysqlpool.query('update config set value = ? where name = ?', [ '' + eventProcessor.position, eventProcessor.positionConfigKeyName ], g.none)
		}

		// console.log('event done')

		return 'done' === state ? true : false
	}),

})

var gen_addChange = coroutine(function*(event, login_id, object_type_id, object_id, data, g) {
	
	var row = yield mysqlpool.query('insert into change_events (event,object_type_id,object_id,event_data, login_id) values (?,?,?,?,?)', [ event, object_type_id, object_id, JSON.stringify(data), login_id ], g.resume)

	return row.insertId

})

EventProcessor.addChange = function(event, login_id, object_type_id, object_id, data, callback) {
	gen_addChange(event, login_id, object_type_id, object_id, data, function(err, result) {
		if(err) {
			console.showError(err)
			callback(err)
		}
		else {
			eventProcessor.onInterval()
			callback(null, result)
		}
	})
}


/*

-- Function "wait_for_event" DDL

-- CREATE DEFINER=`zh`@`%` FUNCTION `wait_for_event`(event_id int) RETURNS varchar(1024) CHARSET utf8
CREATE FUNCTION `wait_for_event`(event_id int) RETURNS varchar(1024) CHARSET utf8
BEGIN
	DECLARE s float(5,3) DEFAULT 0.001;
	DECLARE i int DEFAULT 0;
	DECLARE t float(5,3);
	DECLARE sr int;
	DECLARE r VARCHAR(1024) default '-1';

	DECLARE s1_s VARCHAR(32);
	DECLARE s1_e text;

	WHILE s < 1 DO

		if i < 6 then
			set t = 0.01;
		else
			set t = 0.05;
		end if;

		select sleep(t) into sr;

		set s = s + t;

		select state,execution_report into s1_s, s1_e from change_events where id = event_id;

		if s1_s = 'done' then
			set s = 2;
			set r = s1_e;
		end if;

	END WHILE;

	RETURN r;

END;

*/

var try_timeouts = [ 5, 10, 10, 50 ]
// var try_timeouts = [ 25, 25, 25, 50 ]
var gen_waitForEventCompleted = coroutine(function*(event_id, g) {
	
	/*
	var i = 0, sum = 0, result = [ false, null ]
	while(sum < 1000) {
		var timeout = i < try_timeouts.length ? try_timeouts[i] : 100
		i++; sum += timeout
		// console.log('timeout '+timeout)
		yield setTimeout(g.resume, timeout)
		var row = yield mysqlpool.query('select state, execution_report from change_events where id = ' + event_id, g.resume)
		if(row[0].state == 'done') {
			result = [ true, 'string' === typeof row[0].execution_report ? JSON.parse(row[0].execution_report) : row[0].execution_report ]
			break
		}
	}

	return result
	*/

	var row = yield mysqlpool.query('select wait_for_event(?) as a', [ event_id ], g.resume), answer = row[0].a
	if(answer == '-1') return [ false, null ]
	return [ true, 'string' === typeof answer ? JSON.parse(answer) : answer ]

})

EventProcessor.waitForEventCompleted = function(event_id, callback) {
	gen_waitForEventCompleted(event_id, function(err, result) {
		if(err) {
			console.showError(err)
			callback(err)
		}
		else {
			callback(null, result)
		}
	})
}

module.exports = EventProcessor
