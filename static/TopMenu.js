
TopMenu = Class.inherit({

	onCreate: function() {
	},

	place: function(element) {
		var html = this.render();
		element.innerHTML = html;
	},

	render: function() {

		var html = '';

		html += '<div>';

			html += '<a href="#qservers" class="fl rm5">[ quote servers ]</a>';
			html += '<a href="#bridge" class="fl rm5">[ bridge ]</a>';
			html += '<a href="#templates/list" class="fl rm5">[ templates ]</a>';
			html += '<a href="javascript:auth.logout()" class="fl rm5">[ logout]</a>';

			html += '<div class="cb"></div>';

		html += '</div>';

		return html;
	}
})