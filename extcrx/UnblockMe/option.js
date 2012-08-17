var urls_el = document.getElementById('urls'),
	ip_el = document.getElementById('ip'),
	regex = /^(?:https?|\*):\/\/[^\/]+\/?/;
urls_el.result = document.getElementById('urls_result');
ip_el.result = document.getElementById('ip_result');
urls_el.onchange = function() {
	var urls = this.value.trim();
	if (!urls) {
		urls_el.result.innerText = 'Empty URLs, this plugin is disabled.'
	} else {
		try {
			var us = [];
			urls = urls.split(/\n/).forEach(function (u) {
				u = u.trim();
				if (!u) {
					return;
				} else if (regex.test(u)) {
					us.push(u.trim());
				} else {
					alert('URL: ' + u + ' is not valid!');
					throw 'url not valid'
				}
			});
			localStorage.urls = this.value = us.join('\n');
			crx_reload();
			urls_el.result.innerText = 'Saved.';
		} catch (e) {
			urls_el.result.innerText = 'Failed! Error occer!';
		}
	}
};
ip_el.onchange = function() {
	var ip = this.value.trim();
	if (!ip) ip = '114.114.114.114';
	if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(ip)) {
		localStorage.ip = this.value = ip;
		crx_reload();
		ip_el.result.innerText = 'Saved.';
	} else {
		alert('IP: ' + ip + ' is not a valid ip.\n IP is looks like xxx.xxx.xxx.xxx (xxx is 0-255)');
		ip_el.result.innerText = 'Failed! Error occer!';
	}
};

function crx_reload() {
	chrome.extension.getBackgroundPage().reload();
}

urls_el.value = (localStorage.urls != null) ? localStorage.urls : 'http://*.youku.com/*\nhttp://*.tudou.com/*\nhttp://*.xunlei.com/*';
ip_el.value = localStorage.ip.trim() || '114.114.114.114';
