ZenTabCal = (function(){

  var _urls = {
    api: 'https://www.googleapis.com/calendar/v3/users/me/settings',
    list: 'https://www.googleapis.com/calendar/v3/users/me/calendarList'
  }

  const days = 1;

  function _getFeed() {
    ZenTabBack.log('_getFeed');
    chrome.storage.local.get('zenCalendar', function(eventos) {
      if (chrome.runtime.lastError) {
        ZenTabBack.tracking({info: 'localStorage', type: 'error'});
        return;
      }

      var storageEvents = eventos || {};
      chrome.identity.getAuthToken({interactive: false}, function(token) {
        if (chrome.runtime.lastError) {
          ZenTabBack.tracking({info: 'authTokenCalendar', type: 'error'});
        }
        ZenTabBack.tracking({info: 'GetCalendarEvents', type: 'feed'});

        var xhr = new XMLHttpRequest();
        xhr.open('GET', urls.api);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.onload = function() {
          if (this.status == 200) {
            ZenTabBack.log(this);
          }
        }
      })
    });
  }

  return {
    getFeed: _getFeed,
    urls: _urls
  }
})();
