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
(function(){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.innerHTML='(function(){var b=$("#reply_content"),a=b.parents("form"),d=a.find(":submit"),e=d.val();a.length>1&&(a=$(a[0]));a.submit(function(){var a=$.trim(b.val());if(!a)return $("#e").html("Reply content cannot be empty!"),!1;d.val("Sending...").add(b).attr("disabled","disabled");$.ajax({type:"POST",url:this.action,dataType:"html",data:{content:a},complete:function(){b.val("").focus();d.val(e).add(b).removeAttr("disabled")},success:function(a){if(a){var b=$("#replies"),a=$(a.replace(/<script.*?<\\/script>/ig,"")),c=a.find("#replies").html();c?b.length?c&&$("#replies").html(c):(c=a.find("#Content").html())&&$("#Content").html(c):alert("err: no replies in return html")}else alert("err: ajax return empty")},error:function(){alert("err: ajax faild")}});return!1});b.keydown(function(b){if(b.ctrlKey&&b.keyCode==13)return event.stopPropagation(),a.submit(),!1})})();';document.getElementsByTagName("body")[0].appendChild(a);console.log('v2ex-ajax-submit-enabled')})();
