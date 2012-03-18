(function() {
	var Env = function() {}, 
	libs = {
		'jq': 'jquery-1.6.1.min.js',
		'jquery': 'jquery-1.6.1.min.js',
		'default': 'jquery'
	};
	Env.prototype = {
		lib: function(name, callback) {
			if (!name) {
				name = libs['default'];
			}
			if (!libs[name]) {
				throw this.err('bad_param', name ? 'lib ' + name + ' is not exists': 'name is empty');
			}
			name = name.toLowerCase();
			if (!this.lib_path) {
				this.lib_path = document.getElementById('js_loader').src.replace(/[^\/]*$/, '');
			} else if (this.loaded) {
				alert('lib ' + this.loaded + ' have already been loaded!');
				return this;
			}
			var a = document.createElement('script');
			a.setAttribute('type','text/javascript');
			a.src = this.lib_path + libs[name];
			if (callback instanceof Function)
				a.onload = callback;
			document.getElementsByTagName('head')[0].appendChild(a);
			this.loaded = name;
			console.log(a.src + ' loaded');
			return this;
		},
		err: function(type, msg) {
			var err = new Error(msg);
			err.type = type;
			return err;
		},
		text: function(val) {
			var txt = document.getElementById('text');
			if (val == null) {
				return txt.value;
			} else {
				val = (val.toString() == '[object Object]' ? JSON.stringify(val) : val);
				txt.value = val;
				return this;
			}
		},
		html: function(val) {
			var html = document.getElementById('html');
			if (val == null) {
				return html.innerHTML;
			} else {
				val = (val.toString() == '[object Object]' ? JSON.stringify(val) : val);
				html.innerHTML = val;
				return this;
			}
		},
		store: function(name, val) {
			var env = this, store = {
				load: function(name) {
					name = name || 'text';
					val = localStorage[name];
					console.log('\'' + name + '\' loaded from store with value: ' + val);
					return val ? JSON.parse(val) : val;
				},
				save: function(name, val) {
					name = name || 'text';
					val = JSON.stringify(val === undefined ? env.text() : val);
					localStorage[name] = val;
					console.log('\'' + name + '\' saved to store with value: ' + val);
					return store;
				},
				clear: function() {
					localStorage.clear();
					console.log('store cleared');
					return store;
				},
				list: function() {
					var list = [];
					for (var i in localStorage) {
						if (localStorage.hasOwnProperty(i))
							list.push(i);
					}
					console.log('store listed');
					return list;
				},
				data: localStorage
			};
			if (name) { // stored value
				if (val) { // save
					store.save(name, val);
					return env;
				} else { // load
					return store.load(name);
				}
			} else { // store obj
				return store
			}
		}
	};
	window.lab = new Env();
})();
