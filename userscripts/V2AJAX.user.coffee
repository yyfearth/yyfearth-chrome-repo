###
// ==UserScript==
// @name V2AJAX (Ajax Submit in V2EX)
// @description using ajax to submit in v2ex.
// @version 0.2.3
// @auther yyfearth#gmail.com
// @include *://*.v2ex.com/t/*
// ==/UserScript==
###

### utils ###
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

### for topics ###

# get replies box
get_replies = (el = document) ->
  replies_box = ($queryAll '#Main>.box', el)[1]
  # validate box
  if replies_box and /感谢回复者|目前尚无回复|\d+\s*回复\s*\|\s*直到/.test replies_box.innerText or replies_box.textContent
    replies_box
  else
    null

# get personal info in sidebar
get_info = (el = document) ->
  info = $query '#Rightbar>.box', el
  if ($query '#money', info) or $query '[href="/notifications"]', info
    info
  else
    null

### init ###
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
return failed 'stop', 'cannot find replies box' unless replies_box
info_box = get_info null
failed 'continue', 'cannot find info box' unless info_box

### autosave ###
store_key = reply_form.action + '#content'
store_data = localStorage[store_key] or ''

# restore
if not reply_content.value and store_data
  reply_content.value = store_data
  console.log 'load from store', store_key, store_data

# save
autosave = ->
  val = reply_content.value
  store_data = localStorage[store_key]
  return unless store_data or val
  localStorage[store_key] = val.trim()
  console.log 'save to store', store_key, val
  return

$bind window, 'unload', autosave

### submit ###

lockbtn = (lock) ->
  reply_submit.classList[if lock then 'remove' else 'add'] 'normal'
  reply_submit.disabled = !!lock

lockform = (lock) ->
  if disabled = !!lock
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
update = (html) ->
  # console.log 'onsuccess', html
  unless (html = html.trim())
    alert 'ajax return empty result'
    failed 'reload', 'empty return html'
  html = html.replace /<script.*?<\/script>/ig, '' # clean js
  # get new replies content
  doc = document.implementation.createHTMLDocument()
  doc.documentElement.innerHTML = html # fill html
  # change title
  if doc.title and document.title isnt doc.title
    document.title = doc.title
  # get new replies
  new_replies = get_replies doc
  failed 'reload', 'cannot locate new replies' unless new_replies
  # apply new replies
  replies_box.className = new_replies.className
  replies_box.innerHTML = new_replies.innerHTML
  # reply_content.scrollIntoViewIfNeeded()
  reply_content.value = '' # clear
  reply_content.focus()
  # update info
  if info_box
    new_info_box = get_info doc
    unless new_info_box
      failed 'continue', 'cannot locate new info box'
    else
      info_box.innerHTML = new_info_box.innerHTML
  return

do_submit = ->
  console.log 'ajax submit'
  unless (content = reply_content.value.trim())
    lockbtn on
  else 
    data = 'content=' + encodeURIComponent content.replace /\n/g, '\r\n'
    # todo: foreach field if need
    lockform on
    $ajax # do ajax submit
      url: reply_form.action
      method: reply_form.method
      data: data
      timeout: 5000
      success: update
      error: (s, t) -> failed 'submit', 'ajax failed', s, t
      complete: -> lockform off
  return

post_form = ->
  reply_form.submit() if reply_content.value.trim()

### bind ###

reply_submit.type = 'button' # prevent submit
reply_submit.onclick = (e) ->
  if e.altKey
    post_form()
  else
    do_submit()

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

$bind reply_content, 'change', ->
  reply_content.value = reply_content.value.trim()
  test_empty()
  autosave()
  return

### done ###
# set a sign
subnmit_key = if /Mac OS/i.test navigator.userAgent then '^/⌘ + ↵' else 'ctrl+enter'
reply_submit.insertAdjacentHTML 'afterend', "<span class=\"fade\"> #{subnmit_key} </span>"
