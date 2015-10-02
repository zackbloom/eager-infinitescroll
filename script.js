(function() {
  var el, fetching, getNextURL, main, renderNext;

  renderNext = function(next, done) {
    var req;
    req = new XMLHttpRequest;
    req.open('GET', next, true);
    req.onload = function() {
      var e, item, nextItems, tmp, _i, _len;
      tmp = document.createElement('html');
      tmp.innerHTML = req.responseText;
      try {
        nextItems = tmp.querySelector(INSTALL_OPTIONS.container).childNodes;
      } catch (_error) {
        e = _error;
        nextItems = [];
      }
      for (_i = 0, _len = nextItems.length; _i < _len; _i++) {
        item = nextItems[_i];
        if (item && item.nodeName !== '#text') {
          el.appendChild(item);
        }
      }
      document.querySelector(INSTALL_OPTIONS.next).href = getNextURL(tmp);
      return done();
    };
    return req.send();
  };

  getNextURL = function(baseElement) {
    var e, url;
    try {
      url = baseElement.querySelector(INSTALL_OPTIONS.next).href;
      if (url === location.href) {
        return '-- blank --';
      }
      return url;
    } catch (_error) {
      e = _error;
      console.log("The 'next page' link couldn't be found (" + INSTALL_OPTIONS.next + ").");
      return '-- blank --';
    }
  };

  el = document.querySelector(INSTALL_OPTIONS.container);

  fetching = false;

  main = function(e) {
    var noScrollBar, scrolledDown;
    if (fetching) {
      return;
    }
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    noScrollBar = scrollHeight <= innerHeight;
    scrolledDown = scrollTop === scrollHeight - innerHeight;
    if (scrolledDown || noScrollBar) {
      fetching = true;
      return renderNext(getNextURL(document), function() {
        fetching = false;
        return main();
      });
    }
  };

  main();

  window.addEventListener('scroll', main);

}).call(this);
