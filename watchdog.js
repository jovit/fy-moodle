var _AnalyticsCode = 'UA-107698779-1';

var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);

_gaq.push(['_trackEvent', 'homePage', 'entered'])

function shallCollect() {
  if (localStorage.hasOwnProperty("lastCollection")){
    if (Date.now() - parseInt(localStorage.lastCollection) > 600000000){
      localStorage.setItem('lastCollection', Date.now().toString())
      return true;
    }
    return false;
  } else {
    localStorage.setItem('lastCollection', Date.now().toString())
    return true;
  }
  return false;
}

if (shallCollect()){
  _gaq.push(['_trackEvent', 'homePage', 'collectingAnswers'])
  document.body.innerHTML += '<div id="loading-popup" style="text-align:center;display:fixed;position:fixed;bottom:0px; opacity: 0.7; width:100%;height:50px;background:yellow;z-index:90; padding-top:15px; color=#000;">Carregando os seus moodles antigos...</div>'

  chrome.runtime.sendMessage({greeting: "hello", page: document.documentElement.innerHTML}, function(response) {
    setTimeout(() => {
      console.log("time up")
      document.getElementById('loading-popup').style.display = 'none'
    }, 2500)
  });
}
