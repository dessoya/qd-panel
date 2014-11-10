
Auth = Class.inherit({

	onCreate: function() {
	},

	init: function(element) {
		
		var html = '';

		html += '<div id="cont_auth" style="opacity: 0.8; background: #444; position:absolute; top:0px; left:0px; right:0px; bottom:0px; display:none">';
			html += '<div style="box-shadow: 0px 0px 10px #fff; margin:50px auto; width:220px; background: #fff; border: 1px solid black; border-radius: 4px 4px 4px 4px; padding: 6px 10px">';
				html += '<div style="margin-bottom: 3px">';
					html += '<div class="fl w70" style="line-height:24px; height: 24px">login</div>';
					html += '<input id="input_login_" class="fl w150" type="text" />';
					html += '<div class="cb"></div>';
				html += '</div>';
				html += '<div style="margin-bottom: 8px">';
					html += '<div class="fl w70" style="line-height:24px; height: 24px">password</div>';
					html += '<input onkeydown="auth.onkeydown(event)" id="input_password" class="fl w150" type="password" />';
					html += '<div class="cb"></div>';
				html += '</div>';
				html += '<button id="button_login" style="width: 100%" onclick="auth.login()">login</button>';
			html += '</div>';
		html += '</div>';
		
		element.innerHTML += html;
	},

	show: function(callback) {
		if(callback) this.callback = callback;
		cont_auth.style.display = 'block';
		button_login.removeAttribute('disabled');
		input_login_.value = '';
		input_password.value = '';
	},

	hide: function() {
		cont_auth.style.display = 'none';
	},

	login: function() {
		
		var params = {
			login: input_login_.value,
			password_hash: md5(input_password.value)
		};

		button_login.setAttribute('disabled', 'disabled');

		AJAX.create({
			type: 'json',
			post: JSON.stringify(params),
			url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/auth/login',
			success: function(answer) {
				// console.log(answer);
				if(answer.status === 'ok') {
					if(answer.result.auth) {
						auth.hide();
						session_hash = answer.result.session_hash;
						cookie(config.auth.cookie, session_hash, { expires: 2, path: '/' });
						if(this.callback) {
							var c = this.callback;
							delete this.callback;
							c();
						}
						else {
							sections.start(true);
						}
					}
					else {
						alert('wrong login or password !');
						button_login.removeAttribute('disabled');

						input_login_.value = '';
						input_password.value = '';

						input_login_.focus();
					}
				}
				else {
					console.log('error');
				}
			}.bind(this)
		})

	},

	onkeydown: function(event) {
		// console.log(event);
		if(13 === event.which) {
			this.login();
		}
	},

	logout: function() {

		AJAX.create({
			type: 'json',
			url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/auth/logout',
			success: function(answer) {
				auth.show();
			}
		});
	}

});

auth = Auth.create();