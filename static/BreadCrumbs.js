BreadCrumbs = Class.inherit({

	onCreate: function() {
		this.path = [];
	},

	place: function(selector) {
		if(selector) this.selector = selector;
		var html = this.render();
		document.querySelector(this.selector).innerHTML = html;
	},
	

	render: function() {

		var html = '';

		html += '<div>';

/*
			html += '<a href="#servers" class="fl rm5">[ servers ]</a>';
			html += '<a href="#templates/list" class="fl rm5">[ templates ]</a>';
*/

			for(var i = 0, c = this.path, l = c.length, li = l - 1; i < l; i++ ) {
				html += '<a href="#'+c[i].href+'" class="fl rm5">'+c[i].title+'</a>';
				if(i != li) html += '<div class="fl rm5">-></div>';
			}

			html += '<div class="fl w5">&nbsp;</div>';
			html += '<div class="cb"></div>';

		html += '</div><br>';

		return html;
	},

	setup: function(path) {
		this.path = path;
		this.place();
	}

});