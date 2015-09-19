renderNext = (next, done) ->
  $.get next, (text) ->
    tmp = document.createElement 'html'
    tmp.innerHTML = text

    try
      nextItems = tmp.querySelector(INSTALL_OPTIONS.container).childNodes
    catch e
      nextItems = []

    for item in nextItems when item and item.nodeName != '#text'
      el.appendChild item

    document.querySelector(INSTALL_OPTIONS.next).href = getNextURL tmp
    done()

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

  noScrollBar = $("body").height() <= $(window).height()
  scrolledDown = $(window).scrollTop() == $(document).height() - $(window).height()

  if scrolledDown or noScrollBar
    fetching = true
    renderNext (getNextURL document), ->
      fetching = false
      main()

main()
window.addEventListener 'scroll', main
