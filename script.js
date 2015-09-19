(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var el, fetching, getNextURL, main, renderNext;

renderNext = function(next, done) {
  return $.get(next, function(err, res) {
    var e, error, i, item, len, nextItems, tmp;
    if (err) {
      return console.log("Infinite scroll couldn't fetch next page from " + next + ":", err);
    }
    tmp = document.createElement('html');
    tmp.innerHTML = res.text;
    try {
      nextItems = tmp.querySelector(INSTALL_OPTIONS.container).childNodes;
    } catch (error) {
      e = error;
      nextItems = [];
    }
    for (i = 0, len = nextItems.length; i < len; i++) {
      item = nextItems[i];
      if (item && item.nodeName !== '#text') {
        el.appendChild(item);
      }
    }
    document.querySelector(INSTALL_OPTIONS.next).href = getNextURL(tmp);
    return done();
  });
};

getNextURL = function(baseElement) {
  var e, error, url;
  try {
    url = baseElement.querySelector(INSTALL_OPTIONS.next).href;
    if (url === location.href) {
      return '-- blank --';
    }
    return url;
  } catch (error) {
    e = error;
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
  noScrollBar = $("body").height() <= $(window).height();
  scrolledDown = $(window).scrollTop() === $(document).height() - $(window).height();
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



},{}]},{},[1]);
