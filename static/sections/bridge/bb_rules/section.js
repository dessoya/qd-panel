
var sheet = (function() {
	// Create the <style> tag
	var style = document.createElement("style");

	// Add a media (and/or media query) here if you'd like!
	// style.setAttribute("media", "screen")
	// style.setAttribute("media", "only screen and (max-width : 1024px)")

	// WebKit hack :(
	style.appendChild(document.createTextNode(""));

	// Add the <style> element to the page
	document.head.appendChild(style);

	return style.sheet;
})();

function addCSSRule(sheet, selector, rules, index) {
	if("insertRule" in sheet) {
		sheet.insertRule(selector + "{" + rules + "}", index);
	}
	else if("addRule" in sheet) {
		sheet.addRule(selector, rules, index);
	}
}

// Use it!
// addCSSRule(document.styleSheets[0], "header", "float: left");

Sections.Bridge.BBRUles = Class.inherit({

	re_login: /^\d+$/,

	pattern: 'bridge/bb_rules',

	onCreate: function() {

		this.binded_onRulesHintLoaded = this.onRulesHintLoaded.bind(this);
		this.binded_onRulesLoaded = this.onRulesLoaded.bind(this);
		this.binded_onRuleAdded = this.onRuleAdded.bind(this);
		this.binded_onRuleDeleted = this.onRuleDeleted.bind(this);

		// image 1

		this.canvas1 = document.createElement('canvas');
		this.canvas1.width = 24;
		this.canvas1.height = 18;
		this.ctx1 = this.canvas1.getContext('2d');

		this.imd = this.ctx1.createImageData(1, 1);
		this.imd.data[0] = 0;
		this.imd.data[1] = 0;
		this.imd.data[2] = 0;
		this.imd.data[3] = 255;

		this.ctx1.fillStyle = "rgba(255,255,255,0)";
		this.ctx1.fillRect(0, 0, 24, 18);

		for(var i = 0; i < 9; i++)
			this.ctx1.putImageData(this.imd, 12, i);
		for(var i = 12; i < 24; i++)
			this.ctx1.putImageData(this.imd, i, 9);

		addCSSRule(sheet, ".img1", "background-image: url(" + this.canvas1.toDataURL("image/x-icon")+"); background-repeat: no-repeat", 0);

		// image 2
		this.canvas2 = document.createElement('canvas');
		this.canvas2.width = 24;
		this.canvas2.height = 18;
		this.ctx2 = this.canvas2.getContext('2d');

		this.ctx2.fillStyle = "rgba(255,255,255,0)";
		this.ctx2.fillRect(0, 0, 24, 18);

		for(var i = 0; i < 18; i++)
			this.ctx2.putImageData(this.imd, 12, i);
		for(var i = 12; i < 24; i++)
			this.ctx2.putImageData(this.imd, i, 9);

		addCSSRule(sheet, ".img2", "background-image: url(" + this.canvas2.toDataURL("image/x-icon")+"); background-repeat: no-repeat", 1);


		// image 3
		this.canvas3 = document.createElement('canvas');
		this.canvas3.width = 24;
		this.canvas3.height = 18;
		this.ctx3 = this.canvas3.getContext('2d');

		this.ctx3.fillStyle = "rgba(255,255,255,0)";
		this.ctx3.fillRect(0, 0, 24, 18);

		for(var i = 0; i < 18; i++)
			this.ctx3.putImageData(this.imd, 12, i);

		addCSSRule(sheet, ".img3", "background-image: url(" + this.canvas3.toDataURL("image/x-icon")+"); background-repeat: no-repeat", 2);

/*
		this.img = document.createElement('img');
		this.img.src = this.canvas.toDataURL("image/x-icon");
*/
/*
		cont_body.appendChild(this.img);
		asd.appendChild(this.img);

		this.ctx.putImageData(this.imd, 6, 6);

		this.img.src = this.canvas.toDataURL("image/x-icon");
*/
	},

	start: function() {
	},

	activate: function(params) {

		breadCrumbs.setup([ { href: 'bridge', title: 'bridge' }, { href: 'bridge/bb_rules', title: 'bb_rules' } ]);

		var html = '';

		html += '<div id="cont_rules_tree"></div><br>';

		html += '<div id="cont_common_add"></div>';

		cont_main.innerHTML = html;

		AJAX.create({
			type: 'json',
			url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/rules/hint',
			success: this.binded_onRulesHintLoaded
		})
	},

	deactivate: function() {
	},

	onRulesLoaded: function(answer) {

		var rules = answer.result.rules;

		var tree = [], tree_map = {};

		for(var i = 0, l = rules.length; i < l; i++) {
			var rule = rules[i];
			var source_id = rule.source_id;

			var source;
			if(!(source_id in tree_map)) {
				source = { source_id: source_id, logins: [], logins_map: {} };
				tree_map[source_id] = source;
				tree.push(source);
			}
			else {
				source = tree_map[source_id];
			}

			var login = rule.login ? rule.login : rule.group;
			if(!(login in source.logins_map)) {
				source.logins_map[login] = { login: login, rules: [] };
				login = source.logins_map[login];
				source.logins.push(login);
			}
			else {
				login = source.logins_map[login];
			}

			var line = {
				operation_event_id: rule.operation_event_id,
				symbol_template_id: rule.symbol_template_id,
				id: rule.id
			};
			if(rule.feedor_id) line.feedor_id = rule.feedor_id;
			login.rules.push(line);
		}

		// console.log(tree);
		var html = '';
		
		for(var i = 0, l = tree.length; i < l; i++) {
			html += this.renderSourceLevel(tree[i]);
		}

		cont_rules_tree.innerHTML = html;
	},

	getSourceName: function(source_id) {
		if(!('sources' in this.resources)) {
			var sources = {};
			for(var i = 0, c = this.hints.sources, l = c.length; i < l; i++) {
				var source = c[i];
				sources[source.id] = source;
			}
			this.resources.sources = sources;
		}
		return this.resources.sources[source_id].name;
	},

	getOperation: function(operation_id) {
		if(!('operations' in this.resources)) {
			var operations = {};
			for(var i = 0, c = this.hints.operations, l = c.length; i < l; i++) {
				var operation = c[i];
				operations[operation.id] = operation;
			}
			this.resources.operations = operations;
		}
		return operation_id in this.resources.operations ? this.resources.operations[operation_id] : {id:0,name:''};
	},

	getTemplate: function(template_id) {
		if(!('templates' in this.resources)) {
			var templates = {};
			for(var i = 0, c = this.hints.templates, l = c.length; i < l; i++) {
				var template = c[i];
				templates[template.id] = template;
			}
			this.resources.templates = templates;
		}
		return template_id in this.resources.templates ? this.resources.templates[template_id] : { id: 0, name: '' };
	},

	getFeedor: function(feedor_id) {
		if(!('feedors' in this.resources)) {
			var feedors = {};
			for(var i = 0, c = this.hints.feedors, l = c.length; i < l; i++) {
				var template = c[i];
				feedors[template.id] = template;
			}
			this.resources.feedors = feedors;
		}
		return feedor_id in this.resources.feedors ? this.resources.feedors[feedor_id] : { id: 0, name: '' };
	},


	renderSourceLevel: function(source) {
		var html = '';

		html += '<div>';
			html += '<div class="fl h18 w200">source: <b>'+this.getSourceName(source.source_id)+'</b></div>';
			html += '<div class="cb"></div>';
		html += '</div>';

		for(var i = 0, c = source.logins, l = c.length, li = l - 1; i < l; i++) {
			html += this.renderLoginLevel(c[i], i == li);
		}
		html += '<br>';

		return html;
	},

	renderLoginLevel: function(login, last) {

		var html = '';

		html += '<div>';
			html += '<div class="fl h18 w24 '+(last ? 'img1' : 'img2')+'">&nbsp;</div>';
			html += '<div class="fl h18 w200">'+(this.re_login.exec(login.login) ? 'login':'group')+': <b>' + login.login + '</b> <a href="#bridge/bb_rules/raw/'+login.login+'">raw data</a></div>';
			html += '<div class="cb"></div>';
		html += '</div>';

		for(var i = 0, c = login.rules, l = c.length, li = l - 1; i < l; i++) {
			html += this.renderRuleLevel(c[i], last, i == li);
		}

		return html;
	},

	renderRuleLevel: function(rule, l1_last, l2_last) {

		var html = '';

		html += '<div>';
			html += '<div class="fl h18 w24 '+(l1_last ? '' : 'img3')+'">&nbsp;</div>';
			html += '<div class="fl h18 w24 '+(l2_last ? 'img1' : 'img2')+'">&nbsp;</div>';
			html += '<div class="fl h18 w100">' + this.getOperation(rule.operation_event_id).name + '</div>';
			html += '<div class="fl h18 w100">' + this.getTemplate(rule.symbol_template_id).name + '</div>';
			html += '<div class="fl h18 w100">-> ' + this.getFeedor(rule.feedor_id).name + '</div>';
			html += '<div class="fl h18 w100">';
				html += '<a href="javascript:section.delRule(' + rule.id + ')">del</a>';
			html += '</div>';
			html += '<div class="cb"></div>';
		html += '</div>';
/*
		for(var i = 0, c = login.rules, l = c.length; i < l; i++) {
			html += this.renderRuleLevel(c[i]);
		}
*/
		return html;
	},

	onRulesHintLoaded: function(answer) {

		this.hints = answer.result;
		this.resources = {};

		var html = '';

		html += '<div>';

			html += '<div class="fl w150 rm5">&nbsp;source</div>';
			html += '<div class="fl w150 rm5">&nbsp;</div>';
			html += '<div class="fl w150 rm5">&nbsp;operation</div>';
			html += '<div class="fl w150 rm5">&nbsp;template</div>';
			html += '<div class="fl w150 rm5">&nbsp;feeder</div>';
			
			html += '<div class="cb"></div>';
		html += '</div>';

		html += '<div>';

			html += '<select onchange="section.commonAddChanger()" class="fl w150 rm5" id="input_source">';
				html += '<option value="0" selected="selected">*required*</option>';
				for(var i = 0, c = answer.result.sources, l = c.length; i < l; i++) {
				var source = c[i];
				html += '<option value="'+source.id+'">'+source.name+'</option>';
				}
			html += '</select>';

			html += '<input onkeyup="section.commonAddChanger()" class="fl w150 rm5" type="text" placeholder="login or group" id="input_login" />';

			html += '<select class="fl w150 rm5" id="input_operation_event">';
				for(var i = 0, c = answer.result.operations, l = c.length; i < l; i++) {
				var operation= c[i];
				html += '<option '+(i==0?'selected="selected" ':'')+'value="'+operation.id+'">'+operation.name+'</option>';
				}
			html += '</select>';

			html += '<select onchange="section.commonAddChanger()" class="fl w150 rm5" id="input_template">';
				html += '<option value="0" selected="selected">*required*</option>';
				for(var i = 0, c = answer.result.templates, l = c.length; i < l; i++) {
				var template = c[i];
				html += '<option value="'+template.id+'">'+template.name+'</option>';
				}
			html += '</select>';

			html += '<select class="fl w150 rm5" id="input_feedor">';
				html += '<option value="0" selected="selected">absent</option>';
				for(var i = 0, c = answer.result.feedors, l = c.length; i < l; i++) {
				var feedor = c[i];
				html += '<option value="'+feedor.id+'">'+feedor.name+'</option>';
				}
			html += '</select>';

			html += '<button disabled="disabled" class="fl w5" id="control_common_add" onclick="section.addCommonTemplate()">add</button>';

			html += '<div class="cb"></div>';
		html += '</div>';

		cont_common_add.innerHTML = html;

		this.loadRules();
	},

	loadRules: function() {
		AJAX.create({
			type: 'json',
			post: JSON.stringify({ rule_type: 'bb' }),
			url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/rules/get',
			success: this.binded_onRulesLoaded
		})
	},

	commonAddChanger: function() {
		var flag = ( input_source.value != '0' && input_login.value.length > 0 && input_template.value != '0') ? true : false;
		if(flag) {
			control_common_add.removeAttribute('disabled');
		}
		else {
			control_common_add.setAttribute('disabled', 'disabled');
		}
	},

	addCommonTemplate: function() {
		
		var params = {
			sync: true,
			rule_type: 'bb',
			source_id: input_source.value,			
			operation_event_id: input_operation_event.value,			
			symbol_template_id: input_template.value
		};

		if(input_feedor.value != '0') {
			params.feedor_id = input_feedor.value;
		}

		if(this.re_login.exec(input_login.value)) {
			params.login = input_login.value;
		}
		else {
			params.group = input_login.value;
		}

		input_source.value = '0';
		input_login.value = '';
		input_operation_event.value = '0';
		input_template.value = '0';
		input_feedor.value = '0';

		control_common_add.setAttribute('disabled', 'disabled');

		AJAX.create({
			type: 'json',
			post: JSON.stringify(params),
			url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/rules/add',
			success: this.binded_onRuleAdded
		})

	},

	onRuleAdded: function(answer) {
		this.loadRules();
	},

	delRule: function(rule_id) {

		AJAX.create({
			type: 'json',
			post: JSON.stringify({ rule_id: rule_id, sync: true }),
			url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/rules/del',
			success: this.binded_onRuleDeleted
		})

	},

	onRuleDeleted: function(answer) {
		this.loadRules();
	}

})

sections.addSection(Sections.Bridge.BBRUles.create())
