(function() {
  var divImage = document.getElementById('img');
  var spanClock = document.getElementById('clock');
  var imgElement = document.createElement('img');

  imgElement.src = 'https://source.unsplash.com/category/nature/1600x900/daily/';
  divImage.appendChild(imgElement);

  function gTime(cb) {
    var time = new Date().toLocaleTimeString();
    dTime(time.substr(0, time.length - 3));
  }

  function dTime(t) {
    spanClock.textContent = t;
  }

  var cronTab = setInterval(gTime, 30000);

  gTime();

})();
