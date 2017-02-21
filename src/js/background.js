var _gaq = _gaq || [];
// _gaq.push(['_setAccount', 'UA-61174805-2']);
// _gaq.push(['_trackPageView']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
ZenTabBack = (function() {

  manifest = chrome.runtime.getManifest();

  chrome.runtime.onInstalled.addListener(function(detail) {
    detail.reason == 'install' ? (_track({info: manifest.version, type: 'install'}), _showLoginInteractiveAutenticated()) : detail.reason == 'update' && (_track({info:manifest.version, type: 'update'}), _removeToken());
  });

  function _track(obj) {
    // _gaq.push(['_setAccount', 'UA-61174805-2']);
    // _gaq.push(['_trackEvent', obj.info, obj.type]);
    _log('_track ' + obj.type);
  }

  function _trackPage() {
    // _gaq.push(['_setAccount', 'UA-61174805-2']);
    // _gaq.push(['_trackPageView']);
    _log('_trackPage');
  }

  function _showLoginInteractiveAutenticated() {
    chrome.identity && chrome.identity.getAuthToken({interactive: true}, function(token) {
      if (chrome.runtime.lastError || !token) {
        _log('authInteractiveToken'), _track({info: 'authToken', type: 'error'});
      }else{
        _log(token);
        ZenTabCal.getFeed();
      }
    });
  }

  function _showLoginAutenticated() {
    chrome.identity && chrome.identity.getAuthToken({interactive: false}, function(token) {
      if (chrome.runtime.lastError || !token) {
        chrome.identity.removeCachedAuthToken({ 'token': token }, function (tokens) { _log(tokens);});
        _log('authToken'), _track({info: 'authToken', type: 'error'});
      }else{
        _log(token);
        ZenTabCal.getFeed();
      }
    });
  }

  function _removeToken() {
    chrome.identity.getAuthToken({}, function(token) {
      if (chrome.runtime.lastError) {
        _log(chrome.runtime.lastError.message);
      }
      var xhr = new XMLHttpRequest();
      xhr.open('GET', ZenTabCal.urls['api']);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);

      xhr.onload = function () {
        if (this.status === 401) {
          // This status may indicate that the cached
          // access token was invalid. Retry once with
          // a fresh token.
          chrome.identity.removeCachedAuthToken({ 'token': token }, function(){});
          return;
        }
      }
    });
  }

  function _log(msg) {
    msg = new Date().toLocaleTimeString() + ' - ' + msg;
    window.console.log(msg);
  }

  return {
    tracking: _track,
    trackPage: _trackPage,
    log: _log
  }

})();

ZenTabBack.trackPage();
