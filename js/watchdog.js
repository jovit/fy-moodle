;(root => {
    root._gaq.push(['_trackPageview'])
    root._gaq.push(['_trackEvent', 'homePage', 'entered'])

    function shallCollect() {
        if (localStorage.hasOwnProperty('lastCollection')) {
            if (
                Date.now() - parseInt(localStorage.lastCollection) >
                600000000
            ) {
                localStorage.setItem('lastCollection', Date.now().toString())
                return true
            }
            return false
        } else {
            localStorage.setItem('lastCollection', Date.now().toString())
            return true
        }
        return false
    }

    if (shallCollect()) {
        root._gaq.push(['_trackEvent', 'homePage', 'collectingAnswers'])
        let popup = document.createElement('div')
        popup.id = "loading-popup"
        popup.style = "text-align:center;display:fixed;position:fixed;bottom:0px; opacity: 0.7; width:100%;height:50px;background:yellow;z-index:90; padding-top:15px; color=#000;"
        popup.innerText = "Carregando os seus moodles antigos..."
        document.body.appendChild(popup)

        chrome.runtime.sendMessage({ greeting: 'hello', page: document.documentElement.innerHTML },
            function(response) {
                setTimeout(() => {
                    console.log('time up')
                    document.getElementById('loading-popup').style.display = 'none'
                }, 2500)
            }
        )
    }
})(this)
