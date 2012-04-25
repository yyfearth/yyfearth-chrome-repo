// ==UserScript==
// @name Ajax Send in V2EX
// @description using ajax to submit in v2ex.
// @version 0.1.3
// @auther yyfearth@gmail.com
// @include *://*.v2ex.com/t/*
// @match *://*.v2ex.com/t/*
// ==/UserScript==
(function(){var js='(function(a){var c=a("#reply_content"),d=c.parents("form"),e=d.find(":submit"),h=e.val(),g=/\\u611f\\u8c22\\u56de\\u590d\\u8005|\\u76ee\\u524d\\u5c1a\\u65e0\\u56de\\u590d|\\d+\\s*\\u56de\\u590d\\s*\\|\\s*\\u76f4\\u5230/;1<d.length&&(d=a(d[0]));d.submit(function(){var i=a.trim(c.val()),j=d.attr("action"),k=d.serialize(),f=a("#Main>.box:nth(1)");if(i){if(!f.length||!g.test(f.text()))return!0;e.val("Sending...").add(c).attr("disabled","disabled");a.ajax({type:"POST",url:j,dataType:"html",data:k,timeout:5E3,success:function(b){b?(b=a(b.replace(/<script.*?<\\/script>/ig,"")))?(b=a("#Main>.box:nth(1)",b),g.test(b.text())?f.replaceWith(b):(alert("err: failed to parse responce!"),location.reload())):alert("err: no replies in return html"):(alert("err: ajax return empty"),location.reload())},error:function(b){alert("err: ajax faild "+b.status+" - "+b.responseText)},complete:function(){c.val("").focus();e.val(h).add(c).removeAttr("disabled")}});return!1}a("#e").html("Reply content cannot be empty!");return!1});c.keydown(function(a){if((a.ctrlKey||a.metaKey)&&13==a.which)return a.stopPropagation(),d.submit(),!1}).blur(function(){c.val(a.trim(c.val()))});e.after(\'<span class="fade"> ctrl+enter </span>\')})(jQuery);',a=document.createElement("script");a.setAttribute("type","text/javascript");a.innerHTML=js;document.getElementsByTagName("body")[0].appendChild(a)})();
