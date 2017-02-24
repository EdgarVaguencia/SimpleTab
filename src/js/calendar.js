ZenTabCal = (function(){

  var _urls = {
    api: 'https://www.googleapis.com/calendar/v3/users/me/settings',
    list: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
    events: 'https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events?'
  }

  const days = 1;

  function _getFeed() {
    ZenTabBack.log('_getFeed');

    chrome.identity.getAuthToken({interactive: false}, function(token) {
      if (chrome.runtime.lastError) {
        ZenTabBack.tracking({info: 'authTokenCalendar', type: 'error'});
      }
      ZenTabBack.tracking({info: 'GetCalendarEvents', type: 'feed'});

      var xhr = new XMLHttpRequest();
      xhr.open('GET', _urls['list']);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          _successFeed(JSON.parse(this.responseText));
        }
      }
      xhr.send();
    });
  }

  function _successFeed(obj) {
    ZenTabBack.log('_successFeed');
    chrome.storage.local.get('zenCalendar', function(calendarios) {
      if (chrome.runtime.lastError) {
        ZenTabBack.tracking({info: chrome.runtime.lastError.message, type: 'error'});
        return;
      }

      var storageEventos = calendarios || {};

      for (var i = 0; i < obj.items.length; i++) {
        var calendar = obj.items[i];
        var serverCalendars = {
          id: calendar.id,
          title: calendar.summary,
          description:calendar.description || '',
          foregroundColor: calendar.foregroundColor,
          backgroundColor: calendar.backgroundColor,
          visible: calendar.selected
        }
        storageEventos[calendar.id] = serverCalendars;
      }

      chrome.storage.local.set({'zenCalendar': storageEventos}, function() {
        if (chrome.runtime.lastError) {
          ZenTabBack.tracking({info: chrome.runtime.lastError.message, type: 'error'});
          return;
        }
        _getEvents();
      });
    });
  }

  function _getEvents() {
    ZenTabBack.log('_getEvents');
    if (localStorage.getItem('zenEmail') == undefined) {
      ZenTabBack.getUser();
    }

    chrome.storage.local.get('zenEmail', function(emailUser) {
      if (chrome.runtime.lastError) {
        ZenTabBack.tracking({info: chrome.runtime.lastError.message, type: 'error'});
        return;
      }

      var user = emailUser.zenEmail || '';

      _fetchCalendarEvents(user, function(eventos) {
        chrome.runtime.sendMessage({action: 'updated.feed', data: eventos.items});
      });
    })
  }

  function _fetchCalendarEvents(calendarId, callback) {
    ZenTabBack.log('_fetchCalendarEvents');
    chrome.identity.getAuthToken({interactive:false}, function(token) {
      if (chrome.runtime.lastError) {
        ZenTabBack.tracking({info: chrome.runtime.lastError.message, type: 'error'});
        return;
      }
      ZenTabBack.tracking({info: 'GetEvents', type: 'feed'});

      var today = new Date();

      var minDate = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getDate(), 0, 0, 0);
      var maxDate = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getDate() + 1, 0, 0, 0);

      var urlFeed = _urls['events'].replace('{calendarId}', encodeURIComponent(calendarId)) + ([
        'timeMin=' + encodeURIComponent(minDate.toISOString()),
        'timeMax=' + encodeURIComponent(maxDate.toISOString()),
        'maxResults=500',
        'orderBy=startTime',
        'singleEvents=true'
      ].join('&'))

      var xhr = new XMLHttpRequest();
      xhr.open('GET', urlFeed);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          'function' == typeof callback ? callback(JSON.parse(this.responseText)) : void 0;
        }
      }
      xhr.send();
    });
  }

  return {
    getFeed: _getFeed,
    urls: _urls
  }
})();
