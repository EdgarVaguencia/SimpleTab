ZenTabApp = (function() {
  var timeToDay = new Date();
  var divImage = document.getElementById('img');
  var spanClock = document.getElementById('clock');
  var imgElement = document.createElement('img');
  var divAllEvents = document.getElementById('events');
  var tagTitle = document.getElementsByTagName('title')[0];

  var extName = chrome.i18n.getMessage('extName')
  tagTitle.innerText = 'New Tab | ' + extName;

  var widthHours = divAllEvents.clientWidth / 24;

  imgElement.src = 'https://source.unsplash.com/category/nature/1600x900/daily/';
  divImage.appendChild(imgElement);

  function gTime(cb) {
    var time = timeToDay.toLocaleTimeString();
    dTime(time.substr(0, time.length - 3));
  }

  function dTime(t) {
    spanClock.textContent = t;
  }

  var cronTab = setInterval(gTime, 30000);

  gTime();

  function _updateCalendar(obj) {
    for (var eCal in obj) {
      var evento = obj[eCal];
      var eventDateStart = new Date(evento.start.dateTime);
      var eventHourStart = eventDateStart.getHours();
      var eventDateEnd = new Date(evento.end.dateTime);
      var eventHourEnd = eventDateEnd.getHours();

      var divEvent = document.createElement('div');
      var marginLeft = eventHourStart * widthHours;
      var tiempoEvent = 0 < (eventDateEnd.getDate() - eventDateStart.getDate()) ? (((eventDateEnd.getDate() - eventDateStart.getDate()) * 24) + eventHourEnd) - eventHourStart : (eventHourEnd - eventHourStart);

      var widthEvent = tiempoEvent * widthHours;

      divEvent.classList.add('hour');
      divEvent.style = 'left: ' + marginLeft + 'px; width: ' + widthEvent + 'px;';

      divEvent.addEventListener('click', function(e) {
        chrome.tabs && chrome.tabs.create({url: '' + evento.htmlLink});
      });

      divEvent.innerText = evento.summary;

      divAllEvents.appendChild(divEvent);
    }
    _updateActual();
  }

  function _updateActual() {
    var divCurrent = document.getElementById('current');
    var hourCurrent = timeToDay.getHours();
    var widthCurrent = hourCurrent * widthHours;

    divCurrent.style = 'width: ' + widthCurrent + 'px;'
  }

  return {
    updateCalendar: _updateCalendar
  }

})();

chrome.runtime && chrome.runtime.sendMessage && chrome.runtime.sendMessage({action: 'get.feed'}, function(obj){ ZenTabApp.updateCalendar.bind() });
