// ==UserScript==
// @name Ajax Send in V2EX
// @description using ajax to submit in v2ex.
// @version 0.1.3
// @auther yyfearth@gmail.com
// @include *://*.v2ex.com/t/*
// @match *://*.v2ex.com/t/*
// ==/UserScript==
// ! this src file is only for dev, it will not have any effect yet!
(function($) {
	var txt = $('#reply_content'),
	frm = txt.parents('form'),
	sub = frm.find(':submit'),
	subtxt = sub.val(),
	query = '#Main>.box:nth(1)',
	regex = /感谢回复者|目前尚无回复|\d+\s*回复\s*\|\s*直到/;
	if (frm.length > 1) frm = $(frm[0]);
	frm.submit(function() {
		//alert('sb');
		var content = $.trim(txt.val()),
		url = frm.attr('action'),
		data = frm.serialize(),
		replies = $(query);
		if (!content) {
			$('#e').html('Reply content cannot be empty!');
			return false;
		} else if (!(replies.length && regex.test(replies.text()))) {
			return true; // no reply yet, no ajax
		} else {
			sub.val('Sending...').add(txt).attr('disabled', 'disabled');
			$.ajax({
				type: 'POST',
				url: url,
				dataType: 'html',
				data: data,
				timeout: 5000,
				success: function(html) {
					if (html) {
						//alert(html);
						html = $(html.replace(/<script.*?<\/script>/ig, ''));
						if (!html) { // no reps return
							alert('err: no replies in return html');
						} else { // ok
							var reps = $(query, html);
							if (regex.test(reps.text())) {
								replies.replaceWith(reps);
							} else {
								alert('err: failed to parse responce!');
								location.reload();
							}
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
		if ((e.ctrlKey || e.metaKey) && e.which == 13) {
			e.stopPropagation();
			frm.submit();
			return false;
		}
	}).blur(function() { // auto trim
		txt.val($.trim(txt.val()));
	});
	sub.after('<span class="fade"> ctrl+enter </span>');
})(jQuery);

//'(function(a){var c=a("#reply_content"),d=c.parents("form"),e=d.find(":submit"),h=e.val(),g=/\\u611f\\u8c22\\u56de\\u590d\\u8005|\\u76ee\\u524d\\u5c1a\\u65e0\\u56de\\u590d|\\d+\\s*\\u56de\\u590d\\s*\\|\\s*\\u76f4\\u5230/;1<d.length&&(d=a(d[0]));d.submit(function(){var i=a.trim(c.val()),j=d.attr("action"),k=d.serialize(),f=a("#Main>.box:nth(1)");if(i){if(!f.length||!g.test(f.text()))return!0;e.val("Sending...").add(c).attr("disabled","disabled");a.ajax({type:"POST",url:j,dataType:"html",data:k,timeout:5E3,success:function(b){b?(b=a(b.replace(/<script.*?<\\/script>/ig,"")))?(b=a("#Main>.box:nth(1)",b),g.test(b.text())?f.replaceWith(b):(alert("err: failed to parse responce!"),location.reload())):alert("err: no replies in return html"):(alert("err: ajax return empty"),location.reload())},error:function(b){alert("err: ajax faild "+b.status+" - "+b.responseText)},complete:function(){c.val("").focus();e.val(h).add(c).removeAttr("disabled")}});return!1}a("#e").html("Reply content cannot be empty!");return!1});c.keydown(function(a){if((a.ctrlKey||a.metaKey)&&13==a.which)return a.stopPropagation(),d.submit(),!1}).blur(function(){c.val(a.trim(c.val()))});e.after(\'<span class="fade"> ctrl+enter </span>\')})(jQuery);'
