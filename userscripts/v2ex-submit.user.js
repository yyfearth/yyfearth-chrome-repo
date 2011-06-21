// ==UserScript==
// @name Ctrl+Enter to submit in V2EX
// @description Use ctrl+enter shotcut to submit in v2ex.
// @version 0.1.0.0
// @auther yyfearth@gmail.com
// @match http://*.v2ex.com/*
// @match https://*.v2ex.com/*
// @match http://v2ex.appspot.com/*
// @match https://v2ex.appspot.com/*
// ==/UserScript==
(function(){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.innerHTML='$("textarea").keydown(function(e){e.ctrlKey&&e.keyCode==13&&$.trim(this.value)&&$(this).parents("form")[0].submit()});';document.getElementsByTagName("body")[0].appendChild(a);console.log('v2ex-submit-shutcut-enabled')})();
