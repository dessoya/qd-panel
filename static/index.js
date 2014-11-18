function onLoad() {

	session_hash = cookie(config.auth.cookie);

	/*
	AJAX.create({
		type: 'json',
		post: JSON.stringify({login: 1}),
		url: 'http://'+config.qd.host+':'+config.qd.port+config.qd.prefix+'/login/has',
		success: function(answer) {
			console.log(answer);
		}
	});
	*/

	topMenu = TopMenu.create();
	topMenu.place(top_menu);

	breadCrumbs = BreadCrumbs.create();
	breadCrumbs.place('#cont_bread_crumbs');

	auth.init(cont_body);

	if(!session_hash) {
		auth.show();
	}
	else {
		sections.start();
	}
}