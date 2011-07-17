// ==UserScript==
// @name ajax submit in V2EX
// @description using ajax to submit in v2ex.
// @version 0.1.2.0
// @auther yyfearth@gmail.com
// @match http://*.v2ex.com/t/*
// @match https://*.v2ex.com/t/*
// @match http://v2ex.appspot.com/t/*
// @match https://v2ex.appspot.com/t/*
// ==/UserScript==
(function(){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.innerHTML='(function(){var a=$("#reply_content"),b=a.parents("form"),d=b.find(":submit"),e=d.val();b.length>1&&(b=$(b[0]));b.submit(function(){var f=$.trim(a.val()),g=b.attr("action"),h=b.serialize();if(!f)return $("#e").html("Reply content cannot be empty!"),!1;d.val("Sending...").add(a).attr("disabled","disabled");$.ajax({type:"POST",url:g,dataType:"html",data:h,success:function(c){if(c){var a=$("#replies"),c=$(c.replace(/<script.*?<\\/script>/ig,"")).find("#Content");(c=c.find("#replies").html())?a.length?a.html(c):location.reload():alert("err: no replies in return html")}else alert("err: ajax return empty"),location.reload()},error:function(a){alert("err: ajax faild "+a.status+" - "+a.responseText)},complete:function(){a.val("").focus();d.val(e).add(a).removeAttr("disabled")}});return!1});a.keydown(function(a){if(a.ctrlKey&&a.which==13)return a.stopPropagation(),b.submit(),!1}).blur(function(){a.val($.trim(a.val()))});d.after(\'<span class="fade"> ctrl+enter </span>\');console.log("v2ex-ajax-submit-enabled")})()';document.getElementsByTagName("body")[0].appendChild(a)})();
