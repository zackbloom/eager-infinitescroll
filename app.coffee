renderNext = (next, done) ->
  req = new XMLHttpRequest
  req.open 'GET', next, true

  req.onload = ->
    tmp = document.createElement 'html'
    tmp.innerHTML = req.responseText

    try
      nextItems = tmp.querySelector(INSTALL_OPTIONS.container).childNodes
    catch e
      nextItems = []

    for item in nextItems when item and item.nodeName != '#text'
      el.appendChild item

    document.querySelector(INSTALL_OPTIONS.next).href = getNextURL tmp
    done()

  req.send()

getNextURL = (baseElement) ->
  try
    url = baseElement.querySelector(INSTALL_OPTIONS.next).href
    if url == location.href
      return '-- blank --'
    return url
  catch e
    console.log "The 'next page' link couldn't be found (#{INSTALL_OPTIONS.next})."
    return '-- blank --'


el = document.querySelector INSTALL_OPTIONS.container
fetching = false

main = (e) ->
  return if fetching

  noScrollBar = document.body.scrollHeight <= innerHeight
  scrolledDown = document.body.scrollTop == document.body.scrollHeight - innerHeight

  if scrolledDown or noScrollBar
    fetching = true
    renderNext (getNextURL document), ->
      fetching = false
      main()

main()
window.addEventListener 'scroll', main
