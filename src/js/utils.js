ZenTabUtil = (function() {

  function _read(msg, sender, callback) {
    switch (msg.action) {
      case 'get.feed':
        chrome.extension.getBackgroundPage().ZenTabCal.getFeed();
        break;
      case 'updated.feed':
        ZenTabApp.updateCalendar();
        break;
      case 'log':
        chrome.extension.getBackgroundPage().ZenTabBack.log(msg.data);
        break;
      case 'page':
        chrome.extension.getBackgroundPage().ZenTabBack.trackPage();
        break;
    }
    'function' == typeof callback ? callback(200) : void 0;
  }

  return {
    read: _read
  }
})()

chrome.runtime && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(ZenTabUtil.read.bind());
