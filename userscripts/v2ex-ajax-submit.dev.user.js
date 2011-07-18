// ==UserScript==
// @name Ajax Send in V2EX
// @description using ajax to submit in v2ex.
// @version 0.1.2.1
// @auther yyfearth@gmail.com
// @include *://www.v2ex.com/t/*
// @include *://v2ex.appspot.com/t/*
// @match *://www.v2ex.com/t/*
// @match *://v2ex.appspot.com/t/*
// ==/UserScript==
(function() {
	var txt = $('#reply_content'),
	frm = txt.parents('form'),
	sub = frm.find(':submit'),
	subtxt = sub.val();
	if (frm.length > 1) frm = $(frm[0]);
	frm.submit(function() {
		//alert('sb');
		var content = $.trim(txt.val()),
		url = frm.attr('action'),
		data = frm.serialize();
		if (!content) {
			$('#e').html('Reply content cannot be empty!');
			return false;
		} else if (!$('#replies').length) {
			return true; // no reply yet, no ajax
		} else {
			sub.val('Sending...').add(txt).attr('disabled', 'disabled');
			$.ajax({
				type: 'POST',
				url: url,
				dataType: 'html',
				data: data,
				success: function(html) {
					if (html) {
						//alert(html);
						var rep = $('#replies'),
						rep_html = $(html.replace(/<script.*?<\/script>/ig, '')).find('#replies').html();
						if (!rep_html) { // no reps return
							alert('err: no replies in return html');
						} else { // ok
							rep.html(rep_html);
						}
					} else {
						alert('err: ajax return empty');
						location.reload();
					}
				},
				error: function(xhr) {
					alert('err: ajax faild ' + xhr.status + ' - ' + xhr.responseText);
				},
				complete: function() { // after success or error
					txt.val('').focus();
					sub.val(subtxt).add(txt).removeAttr('disabled');
				}
			});
			return false;
		}
	});
	txt.keydown(function(e) { // ctrl+enter to send
		if (e.ctrlKey && e.which == 13) {
			e.stopPropagation();
			frm.submit();
			return false;
		}
	}).blur(function() { // auto trim
		txt.val($.trim(txt.val()));
	});
	sub.after('<span class="fade"> ctrl+enter </span>');
})();

//(function(){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.innerHTML='';document.getElementsByTagName("body")[0].appendChild(a)})();
