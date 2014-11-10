function onLoad() {

	topMenu = TopMenu.create();
	topMenu.place(top_menu);

	breadCrumbs = BreadCrumbs.create();
	breadCrumbs.place('#cont_bread_crumbs');

	auth.init(cont_body);

	session_hash = cookie(config.auth.cookie);

	if(!session_hash) {
		auth.show();
	}
	else {
		sections.start();
	}
}