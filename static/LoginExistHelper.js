
LoginExistHelper = Class.inherit({

	onCreate: function() {
		this.binded_onKeyTimer = this.onKeyTimer.bind(this);
	},

	destroy: function() {
	},

	onKeyup: function(element) {
		this.element = element;
		if(this.keyTimer) clearTimeout(this.keyTimer);
		this.keyTimer = setTimeout(this.binded_onKeyTimer, 300);		
	},

	onKeyTimer: function() {
		delete this.keyTimer;
		// console.log(this.element.value);
		var server_id = input_source.value;
		if(server_id !== '0') {
			AJAX.create({
				type: 'json',
				post: JSON.stringify({login: this.element.value, server_id: input_source.value}),
				url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/login/has',
				success: function(answer) {
					// console.log(answer);
					if(answer.result) {
						login_error.innerHTML = '&nbsp;';
					}
					else {
						login_error.innerHTML = '<span style="color:red">login or group absent</span>';
					}
				}
			});
		}
	}
})
