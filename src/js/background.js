var _gaq = _gaq || [];
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
ZenTabBack = (function() {

  manifest = chrome.runtime.getManifest();

  chrome.runtime.onInstalled.addListener(function(detail) {
    detail.reason == 'install' ? (_track({info: manifest.version, type: 'install'}), _showLoginInteractiveAutenticated()) : detail.reason == 'update' && (_track({info:manifest.version, type: 'update'}), _showLoginAutenticated());
  });

  function _track(obj) {
    _gaq.push(['_setAccount', 'UA-76663200-4']);
    _gaq.push(['_trackEvent', obj.info, obj.type]);
    _log('_track ' + obj.type);
  }

  function _trackPage() {
    _gaq.push(['_setAccount', 'UA-76663200-4']);
    _gaq.push(['_trackPageView']);
    _log('_trackPage');
  }

  function _showLoginInteractiveAutenticated() {
    chrome.identity && chrome.identity.getAuthToken({interactive: true}, function(token) {
      if (chrome.runtime.lastError || !token) {
        _log('authInteractiveToken'), _track({info: 'authToken', type: 'error'});
      }
    });
    _userProfile();
  }

  function _showLoginAutenticated() {
    chrome.identity && chrome.identity.getAuthToken({interactive: false}, function(token) {
      if (chrome.runtime.lastError || !token) {
        chrome.identity.removeCachedAuthToken({ 'token': token }, function (tokens) { _log(tokens);});
        _log('authToken'), _track({info: 'authToken', type: 'error'});
      }
    });
    _userProfile();
  }

  function _userProfile() {
    chrome.identity && chrome.identity.getProfileUserInfo(function(obj) {
      if (chrome.runtime.lastError) {
        _track({info: chrome.runtime.lastError.message, type: 'error'});
        return;
      }
      chrome.storage.local.set({'zenEmail': obj.email}, function() {
        if (chrome.runtime.lastError) {
          _log(chrome.runtime.lastError.message);
          return;
        }
      })
    });
  }

  function _log(msg) {
    msg = new Date().toLocaleTimeString() + ' - ' + msg;
    window.console.log(msg);
  }

  return {
    tracking: _track,
    trackPage: _trackPage,
    log: _log,
    getUser: _userProfile
  }

})();

ZenTabBack.trackPage();
