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
(function(){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.innerHTML='(function(){var a=$("#reply_content"),b=a.parents("form"),c=b.find(":submit"),d=c.val();b.length>1&&(b=$(b[0]));b.submit(function(){var e=$.trim(a.val()),f=b.attr("action"),g=b.serialize();return e?$("#replies").length?(c.val("Sending...").add(a).attr("disabled","disabled"),$.ajax({type:"POST",url:f,dataType:"html",data:g,success:function(a){if(a){var b=$("#replies");(a=$(a.replace(/<script.*?<\\/script>/ig,"")).find("#replies").html())?b.html(a):alert("err: no replies in return html")}else alert("err: ajax return empty"),location.reload()},error:function(a){alert("err: ajax faild "+a.status+" - "+a.responseText)},complete:function(){a.val("").focus();c.val(d).add(a).removeAttr("disabled")}}),!1):!0:($("#e").html("Reply content cannot be empty!"),!1)});a.keydown(function(a){if(a.ctrlKey&&a.which==13)return a.stopPropagation(),b.submit(),!1}).blur(function(){a.val($.trim(a.val()))});c.after(\'<span class="fade"> ctrl+enter </span>\')})()';document.getElementsByTagName("body")[0].appendChild(a)})();
