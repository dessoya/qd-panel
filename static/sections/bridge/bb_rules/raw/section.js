
Sections.Bridge.BBRUles.RAW = Class.inherit({

	pattern: 'bridge/bb_rules/raw/*',

	onCreate: function() {
		this.binded_onRulesRAWLoaded = this.onRulesRAWLoaded.bind(this);
	},

	start: function() {
	},

	activate: function(params) {

	    this.login = params[0];
		breadCrumbs.setup([
			{ href: 'bridge', title: 'bridge' },
			{ href: 'bridge/bb_rules', title: 'bb_rules' },
			{ href: 'bridge/bb_rules/raw/' + this.login, title: 'raw#' + this.login }
		]);

		var html = '<div id="cont_raw"></div>';

		cont_main.innerHTML = html;

		AJAX.create({
			type: 'json',
			post: JSON.stringify({ login: this.login }),
			url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/rules/bb/raw',
			success: this.binded_onRulesRAWLoaded
		})
	},

	deactivate: function() {
	},

	onRulesRAWLoaded: function(answer) {
		
		var html = '';

		var line = answer.result.raw[0];
		var keys = [];
		for(var key in line) {
			if(key === 'login_or_group' || key === 'id') continue;
			keys.push(key);
		}
		var kl = keys.length, li = kl - 1;

		// make header
		html += '<div class="row">';

			for(var i = 0; i < kl; i++) {				
				html += '<div class="fl w100 header '+(i === li ? 'last' : '')+'cell">'+keys[i]+'</div>';
			}
						
			html += '<div class="cb"></div>';
	
		html += '</div>';

		var services = answer.result.services;
		var operations = answer.result.operations;
		for(var i = 0, c = answer.result.raw, l = c.length, cli = l - 1; i < l; i++) {
			var row = c[i];
			html += '<div class="'+( i == cli ? 'last' : '')+'row">';

				for(var j = 0; j < kl; j++) {				
					var key = keys[j]
					var d = '' + row[key]
					switch(key) {
					case 'source_id':
					case 'feeder_id':
						if(row[key] in services)
							d += ' ' + services[row[key]].name
					break
					case 'type':
						if(row[key] in operations)
							d += ' ' + operations[row[key]].name
					break
					}
					d = d.length > 0 ? d : '&nbsp;';
					html += '<div class="fl w100 '+(j === li ? 'last' : '')+'cell">' + d + '</div>';
				}

				html += '<div class="cb"></div>';
	
			html += '</div>';
		}


		
		cont_raw.innerHTML = html;
	}

})

sections.addSection(Sections.Bridge.BBRUles.RAW.create())
