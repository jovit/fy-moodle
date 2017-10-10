var _AnalyticsCode = 'UA-107698779-1';

var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);

_gaq.push(['_trackEvent', 'homePage', 'entered'])

let hashCode = function(word) {
  var hash = 0,
    i,
    chr
  if (word.length === 0) return hash
  for (i = 0; i < word.length; i++) {
    chr = word.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

var config = {
  apiKey: 'AIzaSyAXRiEgsWNrmRfPQ8KbXY-0PnZjsAm4INI',
  authDomain: 'fy-moodle.firebaseapp.com',
  databaseURL: 'https://fy-moodle.firebaseio.com',
  projectId: 'fy-moodle',
  storageBucket: 'fy-moodle.appspot.com',
  messagingSenderId: '944849265962'
}
firebase.initializeApp(config)

let splitName = document
  .getElementsByClassName('page-header-headings')[0]
  .childNodes[0].innerHTML.split(' ')
let name = splitName[0] + splitName[1]

Array.prototype.slice
  .call(document.getElementsByClassName('questioncorrectnessicon'))
  .filter(e => {
    return e.src.indexOf('incorrect') === -1
  })
  .map(e => {
    let answer = Array.prototype.slice
      .call(e.parentNode.childNodes)
      .filter(e => {
        return e.nodeName === 'LABEL' || e.nodeName === 'SPAN'
      })
      .map(e => {
        if (e.nodeName === 'INPUT') {
          return e.value
        } else {
          return e.innerHTML
        }
      })[0]

    if (!typeof answer === 'string') {
      answer = new XMLSerializer().serializeToString(answer)
    }

    let parent = e.parentNode

    while (parent.className.indexOf('formulation') === -1) {
      parent = parent.parentNode
    }

    let question = Array.prototype.slice
      .call(parent.childNodes)
      .filter(e => {
        return e.nodeName === 'DIV'
      })
      .filter(div => {
        return div.className === 'qtext'
      })[0]

    let db = firebase.database().ref(`${name}/`)
    answer = answer.replace('a. ', '')
    answer = answer.replace('b. ', '')
    answer = answer.replace('c. ', '')
    answer = answer.replace('d. ', '')
    answer = answer.replace('e. ', '')
    answer = answer.replace('f. ', '')

    const latexReg = /action_link(.*)"/

    while (question.search(latexReg) !== -1) {
      question = question.replace(latexReg, '')
    }

    let questionHash = hashCode(question)

    db.child(questionHash).set({answer: answer})

  })

Array.prototype.slice
  .call(document.getElementsByClassName('questioncorrectnessicon'))
  .filter(e => {
    return e.src.indexOf('incorrect') !== -1
  })
  .map(e => {
    let answer = Array.prototype.slice
      .call(e.parentNode.childNodes)
      .filter(e => {
        return e.nodeName === 'LABEL' || e.nodeName === 'SPAN'
      })
      .map(e => {
        if (e.nodeName === 'INPUT') {
          return e.value
        } else {
          return e.innerHTML
        }
      })[0]

    if (!typeof answer === 'string') {
      answer = new XMLSerializer().serializeToString(answer)
    }

    let parent = e.parentNode

    while (parent.className.indexOf('formulation') === -1) {
      parent = parent.parentNode
    }

    let question = Array.prototype.slice
      .call(parent.childNodes)
      .filter(e => {
        return e.nodeName === 'DIV'
      })
      .filter(div => {
        return div.className === 'qtext'
      })[0]

    let questionText = new XMLSerializer().serializeToString(question)

    const latexReg = /action_link(.*)"/

    while (questionText.search(latexReg) !== -1) {
      questionText = questionText.replace(latexReg, '')
    }

    let questionHash = hashCode(questionText)
    answer = answer.replace('a. ', '')
    answer = answer.replace('b. ', '')
    answer = answer.replace('c. ', '')
    answer = answer.replace('d. ', '')
    answer = answer.replace('e. ', '')
    answer = answer.replace('f. ', '')

    let db = firebase.database().ref(`${name}/${questionHash}/incorrect`)
    db.child(hashCode(answer)).set({
      answer: answer
    })
  })
