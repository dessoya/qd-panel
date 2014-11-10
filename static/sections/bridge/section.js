
Sections.Bridge = Class.inherit({
	pattern: 'bridge',

	onCreate: function() {
	},

	start: function() {
	},

	activate: function(params) {

		breadCrumbs.setup([ { href: 'bridge', title: 'bridge' } ]);

		var html = '';

		html += '<div><a href="#bridge/bb_rules">bb_rules</a></div>';
		html += '<div><a href="#bridge/cls_rules">cls_rules</a></div>';

		cont_main.innerHTML = html;
	},

	deactivate: function() {
	}
})

sections.addSection(Sections.Bridge.create())
