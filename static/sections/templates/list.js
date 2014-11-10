
Sections.TemplatesList = Class.inherit({
	pattern: 'templates/list',

	onCreate: function() {
		this.binded_onLoadTemplates = this.onLoadTemplates.bind(this);
		this.binded_onTemplateAdded = this.onTemplateAdded.bind(this);
		this.binded_onTemplateDeleted = this.onTemplateDeleted.bind(this);
	},

	start: function() {
	},                                                          

	activate: function(params) {

		breadCrumbs.setup([ { href: 'templates/list', title: 'templates' }, { href: 'templates/list', title: 'list' } ]);

		var html = '';

		html += '<div class="row">';

			html += '<div class="fl w50 header cell">id</div>';
			html += '<div class="fl w100 header cell">name</div>';
			html += '<div class="fl w50 header lastcell">rules</div>';

			html += '<div class="cb"></div>';
	
		html += '</div>';

		html += '<div id="cont_templates"></div>';

		html += '<br>';
		html += '<div>';
		html += 	'<input class="fl w150" id="input_st_name" type="text"/>';
		html += 	'<div class="fl w10">&nbsp;</div>';
		html += 	'<button class="fl w5" onclick="section.addTemplate()">add</button>';
		html += 	'<div class="cb"></div>';
		html += '</div>';

		cont_main.innerHTML = html;

		this.loadList();
	},

	deactivate: function() {
	},

	loadList: function() {

		AJAX.create({
			type: 'json',
			url: 'http://'+config.qd.host+':'+config.qd.port+'/symbol_templates/get',
			success: this.binded_onLoadTemplates
		});
	},

	onLoadTemplates: function(answer) {

		this.templates = answer.result.list;
		this.renderList();
	},

	renderList: function() {
	
		var html = '';

		for(var i = 0, l = this.templates.length, li = l - 1; i < l; i++) {
			var row = this.templates[i];
			html += '<div class="'+( i == li ? 'last' : '')+'row">';

				html += '<div class="fl w50 cell">'+row.id+'</div>';
				html += '<div class="fl w100 cell">'+row.name+'</div>';
				html += '<div class="fl w50 cell">'+(row.rules_count ? row.rules_count : 0)+'</div>';
				html += '<div class="fl w50 lastcell">';
					html += '<a href="javascript:section.delTemplate('+row.id+')">del</a>';
					html += '<a href="#templates/'+row.id+'">edit</a>';
				html += '</div>';

				html += '<div class="cb"></div>';
	
			html += '</div>';
		}

		cont_templates.innerHTML = html;
	},

	addTemplate: function() {

		var params = { name: input_st_name.value, sync: true };
		input_st_name.value = '';
		AJAX.create({
			type: 'json',
			post: JSON.stringify(params),
			url: 'http://'+config.qd.host+':'+config.qd.port+'/symbol_templates/add',
			success: this.binded_onTemplateAdded
		})
	},

	onTemplateAdded: function(answer) {
		
		if(answer.result.access_denied) {
			alert('access denied');
			return;
		}

		this.loadList();
	},

	delTemplate: function(id) {

		var params = { id: id };
		AJAX.create({

			type: 'json',
			post: JSON.stringify(params),
			url: 'http://'+config.qd.host+':'+config.qd.port+'/symbol_templates/del',
			success: this.binded_onTemplateDeleted
		})

	},

	onTemplateDeleted: function(answer) {
		this.loadList();
	}

});

sections.addSection(Sections.TemplatesList.create())