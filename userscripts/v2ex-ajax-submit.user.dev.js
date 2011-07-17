// ==UserScript==
// @name ajax submit in V2EX
// @description using ajax to submit in v2ex.
// @version 0.1.0.0
// @auther yyfearth@gmail.com
// @match http://*.v2ex.com/t/*
// @match https://*.v2ex.com/t/*
// @match http://v2ex.appspot.com/t/*
// @match https://v2ex.appspot.com/t/*
// ==/UserScript==
(function() {
	var txt = $('#reply_content'),
	frm = txt.parents('form'),
	sub = frm.find(':submit'),
	subtxt = sub.val();
	if (frm.length > 1) frm = $(frm[0]);
	frm.submit(function() {
		var content = $.trim(txt.val());
		if (!content) {
			$('#e').html('Reply content cannot be empty!');
			return false;
		}
		sub.val('Sending...').add(txt).attr('disabled', 'disabled');
		$.ajax({
			type: 'POST',
			url: this.action,
			dataType: 'html',
			data: {
				'content': content
			},
			complete: function() {
				txt.val('').focus();
				sub.val(subtxt).add(txt).removeAttr('disabled');
			},
			success: function(html) {
				if (html) {
					var rep = $(html.replace(/<script.*?<\/script>/ig,'')).find('#replies').html()
					rep && $('#replies').html(rep);
				} else {
					alert('ajax return empty');
				}
			},
			error: function() {
				alert('ajax faild');
			}
		});
		return false;
	});
	txt.keydown(function(e) {
		!txt.attr('disabled') && e.ctrlKey && e.keyCode==13 && frm.submit();
	});
})();

//(function(){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.innerHTML='';document.getElementsByTagName("body")[0].appendChild(a);console.log('v2ex-ajax-submit-enabled')})();
