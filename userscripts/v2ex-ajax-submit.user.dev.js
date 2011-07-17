// ==UserScript==
// @name ajax submit in V2EX
// @description using ajax to submit in v2ex.
// @version 0.1.1.0
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
					var rep = $('#replies'),
					html = $(html.replace(/<script.*?<\/script>/ig,'')),
					rep_html = html.find('#replies').html();
					if (!rep_html) { // no reps return
						alert('err: no replies in return html');
					} else if (!rep.length) { // no reply yet, use content instead
						rep_html = html.find('#Content').html();
						rep_html && $('#Content').html(rep_html);
					} else { // ok
						rep_html && $('#replies').html(rep_html);
					}
				} else {
					alert('err: ajax return empty');
				}
			},
			error: function() {
				alert('err: ajax faild');
			}
		});
		return false;
	});
	txt.keydown(function(e) {
		if (e.ctrlKey && e.keyCode == 13) {
			event.stopPropagation();
			frm.submit();
			return false;
		}
	});
})();

//(function(){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.innerHTML='';document.getElementsByTagName("body")[0].appendChild(a);console.log('v2ex-ajax-submit-enabled')})();
