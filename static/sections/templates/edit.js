

Sections.TemplatesEdit = Class.inherit({

	pattern: 'templates/*',

	onCreate: function() {
		this.binded_onLoadTemplaet = this.onLoadTemplaet.bind(this);
		this.binded_onTemplateSymbolsLoaded = this.onTemplateSymbolsLoaded.bind(this);
		this.binded_onSymbolAdded = this.onSymbolAdded.bind(this);
		this.binded_onSymbolDeleted = this.onSymbolDeleted.bind(this);
	},

	start: function() {
	},                                                          

	activate: function(params) {

		var id = params[0];

		this.id = id;
		breadCrumbs.setup([ { href: 'templates/list', title: 'templates' }, { href: 'templates/' + id, title: id } ]);

		var html = '';

		cont_main.innerHTML = html;

		// return;

		this.loadTemplate();
	},

	deactivate: function() {
	},

	addSymbol: function() {

		var params = {
			symbol_template_id: this.id,
			symbol: input_symbol.value,
			echo_symbol: input_echo_symbol.value,
			factor: input_factor.value,
			bid_markup: input_bid_markup.value,
			ask_markup: input_ask_markup.value,
			// min_spread: input_min_spread.value,
			// max_spread: input_max_spread.value,
			price_left: input_price_left.value,
			price_right: input_price_right.value,
			// depth: input_depth.value,
			// priority: input_priority.value,
			timeout: input_timeout.value
		};

		input_symbol.value = '';
		input_echo_symbol.value = '';
		input_factor.value = '';
		input_bid_markup.value = '';
		input_ask_markup.value = '';
		// input_min_spread.value = '';
		// input_max_spread.value = '';
		input_price_left.value = '';
		input_price_right.value = '';
		// input_depth.value = '';
		// input_priority.value = '';
		input_timeout.value = '';

		AJAX.create({
			type: 'json',
			post: JSON.stringify(params),
			url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/symbol_templates/symbol/add',
			success: this.binded_onSymbolAdded
		})
	},

	onSymbolAdded: function(answer) {
		this.loadTemplateSymbols();
	},

	loadTemplate: function() {

		var params = {id: this.id};
		AJAX.create({

			type: 'json',
			post: JSON.stringify(params),
			url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/symbol_templates/get',
			success: this.binded_onLoadTemplaet

		})

	},

	onLoadTemplaet: function(answer) {

	    if(answer.result.access_denied) {
	    	cont_main.innerHTML = '<b>access denied</b>';
	    }
		else {

			this.template = answer.result.symbol_template;

			this.renderTemplate();

			this.loadTemplateSymbols();
		}	

	},

	renderTemplate: function() {

		breadCrumbs.setup([ { href: 'templates/list', title: 'templates' }, { href: 'templates/' + this.id, title: 'template '+this.template.name + '#' + this.id } ]);

		var html = '';

		html += '<div>';
			html += '<div onclick="section.trigger(this)" id="trigger_field_bb" class="fl w70 rm5 trigger on">bb<div class="fr on">&#x02713;</div><div class="cb"></div></div>';
			html += '<div onclick="section.trigger(this)" id="trigger_field_classic"  class="fl w70 rm5 trigger on">classic<div class="fr on">&#x02713;</div><div class="cb"></div></div>';
			html += '<div class="cb"></div>';
		html += '</div><br>';

		html += '<div class="row">';

			html += '<div class="fl w80 header cell f_symbol">symbol</div>';
			html += '<div class="fl w80 header cell f_echo_symbol">echo symbol</div>';
			html += '<div class="fl w80 header cell f_factor">factor</div>';
			html += '<div class="fl w80 header cell f_bid_markup">bid markup</div>';
			html += '<div class="fl w80 header cell f_ask_markup">ask markup</div>';
			//html += '<div class="fl w80 header cell f_min_spread">min spread</div>';
			//html += '<div class="fl w80 header cell f_max_spread">max spread</div>';
			html += '<div class="fl w80 header cell f_price_left">price left</div>';
			html += '<div class="fl w80 header cell f_price_right">price right</div>';
			//html += '<div class="fl w80 header cell">depth</div>';
			//html += '<div class="fl w80 header cell">priority</div>';
			html += '<div class="fl w80 header lastcell f_timeout">timeout</div>';

			html += '<div class="cb"></div>';
	
		html += '</div>';

		html += '<div id="cont_symbols"></div>';

		html += '<br>';

		html += '<div>';

			html += '<div class="fl w89 f_symbol"><input class="fl w80" id="input_symbol" type="text"/></div>';
			html += '<div class="fl w89 f_echo_symbol"><input class="fl w80" id="input_echo_symbol" type="text"/></div>';
			html += '<div class="fl w89 f_factor"><input class="fl w80" id="input_factor" type="text"/></div>';
			html += '<div class="fl w89 f_bid_markup"><input class="fl w80" id="input_bid_markup" type="text"/></div>';
			html += '<div class="fl w89 f_ask_markup"><input class="fl w80" id="input_ask_markup" type="text"/></div>';
			//html += '<div class="fl w89 f_min_spread"><input class="fl w80" id="input_min_spread" type="text"/></div>';
			//html += '<div class="fl w89 f_max_spread"><input class="fl w80" id="input_max_spread" type="text"/></div>';
			html += '<div class="fl w89 f_price_left"><input class="fl w80" id="input_price_left" type="text"/></div>';
			html += '<div class="fl w89 f_price_right"><input class="fl w80" id="input_price_right" type="text"/></div>';
			//html += '<div class="fl w89"><input class="fl w80" id="input_depth" type="text"/></div>';
			//html += '<div class="fl w89"><input class="fl w80" id="input_priority" type="text"/></div>';
			html += '<div class="fl w89 f_timeout"><input class="fl w80" id="input_timeout" type="text"/></div>';

			html += '<button class="fl w5" onclick="section.addSymbol()">add</button>';
			html += '<div class="cb"></div>';
	
		html += '</div>';

		cont_main.innerHTML = html;
	},

	loadTemplateSymbols: function() {

		var params = { symbol_template_id: this.id };
		AJAX.create({

			type: 'json',
			post: JSON.stringify(params),
			url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/symbol_templates/symbol/get',
			success: this.binded_onTemplateSymbolsLoaded
		});
	},
	
	onTemplateSymbolsLoaded: function(answer) {

	    if(answer.result.access_denied) return;

		var lines = this.symbols = answer.result.symbols, html = '';

		for(var i = 0, l = lines.length, li = l - 1; i < l; i++) {
			var row = lines[i];
			html += '<div class="'+( i == li ? 'last' : '')+'row">';

				html += '<div class="fl w80 cell f_symbol">'+row.symbol+'</div>';
				html += '<div class="fl w80 cell f_echo_symbol">'+((row.echo_symbol && row.echo_symbol.length) ? row.echo_symbol : '&nbsp;' ) +'</div>';
				html += '<div class="fl w80 cell f_factor">'+(row.factor ? row.factor : '&nbsp;' ) +'</div>';
				html += '<div class="fl w80 cell f_bid_markup">'+(row.bid_markup ? row.bid_markup : '&nbsp;' ) +'</div>';
				html += '<div class="fl w80 cell f_ask_markup">'+(row.ask_markup ? row.ask_markup : '&nbsp;' ) +'</div>';
				//html += '<div class="fl w80 cell f_min_spread">'+(row.min_spread ? row.min_spread : '&nbsp;' ) +'</div>';
				//html += '<div class="fl w80 cell f_max_spread">'+(row.max_spread ? row.max_spread: '&nbsp;' ) +'</div>';
				html += '<div class="fl w80 cell f_price_left">'+(row.price_left ? row.price_left: '&nbsp;' ) +'</div>';
				html += '<div class="fl w80 cell f_price_right">'+(row.price_right ? row.price_right: '&nbsp;' ) +'</div>';
				// html += '<div class="fl w80 cell f_depth">'+(row.depth ? row.depth : '&nbsp;' ) +'</div>';
				// html += '<div class="fl w80 cell">'+(row.priority ? row.priority : '&nbsp;' ) +'</div>';
				html += '<div class="fl w80 cell f_timeout">'+(row.timeout ? row.timeout : '&nbsp;' ) +'</div>';

				html += '<div class="fl w50 lastcell">';
					html += '<a href="javascript:section.delSymbol(\''+row.symbol+'\')">del</a>';
				html += '</div>';

				html += '<div class="cb"></div>';
	
			html += '</div>';
		}

		cont_symbols.innerHTML = html;

	},

	delSymbol: function(symbol) {

		var params = {
			symbol_template_id: this.id,
			symbol: symbol
		};

		AJAX.create({
			type: 'json',
			post: JSON.stringify(params),
			url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/symbol_templates/symbol/del',
			success: this.binded_onSymbolDeleted
		})

	},

	onSymbolDeleted: function(answer) {
		this.loadTemplateSymbols();
	},

	fieldGroup: {
		bb: {
			//symbol: true,
			//echo_symbol: true,

			price_left: true,
			price_right: true,
			timeout: true,
			duration_limit: true
		},
		classic: {
			//symbol: true,
			//echo_symbol: true,

			factor: true,
			timeout: true,
			bid_markup: true,
			ask_markup: true
		},
		all: {
			symbol: true,
			echo_symbol: true,

			factor: false,
			timeout: false,
			bid_markup: false,
			ask_markup: false,
			price_left: false,
			price_right: false,
			duration_limit: false
		}
	},

	activeGroup: {
		bb: true,
		classic: true
	},

	trigger: function(element) {
		element.classList.toggle('on');
		var name = ('' + element.id).substr(14);
		if(element.classList.contains('on')) {
			this.activeGroup[name] = true;
		}
		else {
			delete this.activeGroup[name];
		}

		var activeFields = {}
		for(var key in this.fieldGroup.all) {
			activeFields[key] = this.fieldGroup.all[key];
		}

		for(var group in this.activeGroup) {
			for(var key in this.fieldGroup[group]) {
				activeFields[key] = true;
			}
		}
		// trigger_field_classic
		// console.log(element.id);
		for(var key in activeFields) {
			var state = activeFields[key] ? 'block' : 'none';
			var c = document.querySelectorAll('.f_' + key);
			for(var i = 0, l = c.length; i < l; i++) {
				var e = c[i];
				e.style.display = state;
			}
		}
	}


});

sections.addSection(Sections.TemplatesEdit.create())