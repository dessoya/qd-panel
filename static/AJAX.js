
AJAX = Class.inherit({
	onCreate: function(prop) {

	    this.prop		= prop;

		this.ctx		= prop.ctx;
		this.type		= prop.type;
		this.onSuccess	= prop.success;
		this.req		= new XMLHttpRequest();
		this.req.onreadystatechange = this.onRequest.bind(this);

		var url = prop.url, list = [];
		for(var name in prop.params)
			list.push(name+'='+encodeURIComponent(prop.params[name]));
		if(list.length) url+='?'+list.join('&');

		if(prop.post) {
			this.method = "POST";
			var p = JSON.parse(prop.post);
			p.session_hash = session_hash;
			this.request = JSON.stringify(p);
		}
		else {
			// this.method = "GET";
			this.method = "POST";
			this.request = JSON.stringify({ session_hash: session_hash });
		}
		this.url = url;
		this.req.open(this.method, url, true);
    	this.req.send(this.request);
	},

	onRequest: function() {

		// console.log(this.url+' '+this.req.readyState+' '+this.req.status);
        if (this.req.readyState == 4 && this.req.status == 0) {
            this.onSuccess(null, this.ctx);
		}

        if (this.req.readyState == 4)
			if(this.req.status == 200) {
			var answer = this.req.responseText;
			if('json' == this.type) {
				var json;
		        try {
					json = JSON.parse(answer);
		        } catch (e) {
					try {
						json = eval('('+answer+')');
			        } catch (e) {
						json = null;
					}
				}
				answer = json;
				if(answer.status === 'error' && answer.error === 'not logged') {
					var prop = this.prop;
				    auth.show(function() {
				    	AJAX.create(prop);
				    });
					return;
				}
			}
            this.onSuccess(answer, this.ctx);
		}
		else {
            this.onSuccess(null, this.ctx);
		}
    }
});
