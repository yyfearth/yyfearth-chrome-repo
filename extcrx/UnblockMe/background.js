(function() {
	var urls, ip;

	(window.reload = function() {
		urls = localStorage.urls;
		if (!urls) return;
		if (urls == '*') urls = [ "*://*/*" ]
		urls = urls.split(/\n/).map(function(u){ return u.trim() });
		ip = localStorage.ip ? localStorage.ip.trim() : '114.114.114.114';
		console.log(ip, urls);
	})();

	chrome.webRequest.onBeforeSendHeaders.addListener(
	// callback function
	function (details) {
		details.requestHeaders.push({
			name: "X-Forwarded-For", 
			value: ip
		});
		return {requestHeaders: details.requestHeaders};
	},

	// url filters
	{ urls: urls },

	// extraInfoSpec
	// the request is blocked until the callback function returns
	["requestHeaders", "blocking"]);
})();
