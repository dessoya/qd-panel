
Sections.QServers = Class.inherit({
	pattern: 'main',

	onCreate: function() {
	},

	start: function() {
	},

	activate: function(params) {

		breadCrumbs.setup([ { href: 'qservers', title: 'quote servers' } ]);

		var html = '';

		cont_main.innerHTML = html;
	},

	deactivate: function() {
	}
})

sections.addSection(Sections.QServers.create())
