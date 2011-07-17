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
(function(){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.innerHTML='(function(){var b=$("#reply_content"),a=b.parents("form"),c=a.find(":submit"),d=c.val();a.length>1&&(a=$(a[0]));a.submit(function(){var a=$.trim(b.val());if(!a)return $("#e").html("Reply content cannot be empty!"),!1;c.val("Sending...").add(b).attr("disabled","disabled");$.ajax({type:"POST",url:this.action,dataType:"html",data:{content:a},complete:function(){b.val("").focus();c.val(d).add(b).removeAttr("disabled")},success:function(a){a?(a=$(a.replace(/<script.*?<\\/script>/ig,"")).find("#replies").html())&&$("#replies").html(a):alert("ajax return empty")},error:function(){alert("ajax faild")}});return!1});b.keydown(function(c){!b.attr("disabled")&&c.ctrlKey&&c.keyCode==13&&a.submit()})})();';document.getElementsByTagName("body")[0].appendChild(a);console.log('v2ex-ajax-submit-enabled')})();
