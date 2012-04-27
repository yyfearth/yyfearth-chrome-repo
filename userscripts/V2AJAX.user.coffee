###
// ==UserScript==
// @name V2AJAX (Ajax Submit in V2EX)
// @description using ajax to submit in v2ex.
// @version 0.2
// @auther yyfearth@gmail.com
// @include *://*.v2ex.com/t/*
// @match *://*.v2ex.com/t/*
// ==/UserScript==
###

$query = (q, el = document) -> el.querySelector q
$queryAll = (q, el = document) -> [].slice.call el.querySelectorAll q

$bind = (el, event, handler) ->
  el.addEventListener event, handler, false

$ajax = ({ xhr, method, url, data, async, timeout, complete, success, error } = {}) ->
  xhr ?= new XMLHttpRequest
  async ?= yes
  xhr.open method, url, async
  if /^post$/i.test method
    xhr.setRequestHeader 'Content-type', 'application/x-www-form-urlencoded'
  xhr.timeout = timeout if timeout
  xhr.onreadystatechange = -> if xhr.readyState is 4
    complete? xhr
    if xhr.status is 200
      # success
      success? xhr.responseText, xhr
    else
      error? xhr.status, xhr.responseText, xhr
  xhr.ontimeout = ->
    error? xhr.status, 'timeout', xhr
  # go submit
  xhr.send data
  xhr

failed = (act = on, err...) ->
  console.error err...
  if act is 'submit'
    reply_form.submit()
  else if act is 'reload'
    location.reload()
  else
    console.log 'failed', act
  return

# get replies box
get_replies = (el = document) ->
  replies_box_query = '#Main>.box'
  replies_box_seq = 1
  replies_box_regex = /感谢回复者|目前尚无回复|\d+\s*回复\s*\|\s*直到/
  replies_box = ($queryAll replies_box_query, el)[replies_box_seq]
  # validate box
  if replies_box and replies_box_regex.test replies_box.innerText or replies_box.textContent
    replies_box
  else
    null

# get text
reply_content = $query '#reply_content'
# find form
reply_form = reply_content.parentElement
# validate form
while reply_form.tagName isnt 'FORM'
  reply_form = reply_form.parentElement
  unless reply_form
    return failed 'stop', 'cannot find submit form'
# get submit btn
reply_submit = $query 'input[type="submit"]'
reply_submit.text = reply_submit.value # save orginal text
# get replies box
replies_box = get_replies null
return failed 'stop', 'cannot find replies box' unless get_replies

lockbtn = (lock) ->
  reply_submit.classList[if lock then 'remove' else 'add'] 'normal'
  reply_submit.disabled = !!lock

lockform = (lock) ->
  if (disabled = !!lock)
    text = '...'
    act = 'remove'
    disabled = yes
  else
    text = ''
    act = 'add'
    disabled = no

  reply_submit.value = reply_submit.text + text
  reply_submit.classList[act] 'normal'
  reply_submit.disabled = reply_content.disabled = disabled

# ajax success
onsuccess = (html) ->
  console.log 'onsuccess', html
  unless (html = html.trim())
    alert 'ajax return empty result'
    failed 'reload', 'empty return html'
  html = html.replace /<script.*?<\/script>/ig, '' # clean js
  # get new replies content
  doc = document.createElement 'doc'
  doc.innerHTML = html
  new_replies = get_replies doc
  failed 'reload', 'cannot locate new replies' unless new_replies
  # apply new replies
  replies_box.className = new_replies.className
  replies_box.innerHTML = new_replies.innerHTML
  # reply_content.scrollIntoViewIfNeeded()
  reply_content.value = '' # clear
  reply_content.focus()
  return

reply_submit.type = 'button' # prevent submit
reply_submit.onclick = do_submit = ->
  console.log 'ajax submit'
  unless (content = reply_content.value.trim())
    lockbtn on
  else 
    data = 'content=' + encodeURIComponent content
    # todo: foreach field if need
    lockform on
    $ajax # do ajax submit
      url: reply_form.action
      method: reply_form.method
      data: data
      timeout: 5000
      success: onsuccess
      error: (s, t) -> failed 'submit', 'ajax failed', s, t
      complete: -> lockform off
  return

# reply keydown to submit
$bind reply_content, 'keydown', (e) ->
  # ctrl/cmd+enter to submit
  if (e.ctrlKey or e.metaKey) and e.which is 13
    e.preventDefault()
    e.stopPropagation()
    do_submit()
    return false
  return

# reply blur to trim
$bind reply_content, 'blur', ->
  reply_content.value = reply_content.value.trim()
  return

do test_empty = ->
  _not_empty = !reply_content.value.trim()
  if reply_content._not_empty isnt _not_empty
    lockbtn _not_empty
  return

$bind reply_content, 'input', test_empty

# set a sign
subnmit_key = if /Mac OS/i.test navigator.userAgent then '^/⌘ + ↵' else 'ctrl+enter'
reply_submit.insertAdjacentHTML 'afterend', "<span class=\"fade\"> #{subnmit_key} </span>"
