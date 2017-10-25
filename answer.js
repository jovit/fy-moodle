var _AnalyticsCode = 'UA-107698779-1'

var _gaq = _gaq || []
_gaq.push(['_setAccount', _AnalyticsCode])
_gaq.push(['_trackPageview'])

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

_gaq.push(['_trackEvent', 'attempt', name])
let right = 0
let wrong = 0

Array.prototype.slice
  .call(document.getElementsByClassName('formulation'))
  .forEach(e => {
    let question = Array.prototype.slice
      .call(e.childNodes)
      .filter(e => e.nodeName === 'DIV')
      .filter(div => {
        return div.className === 'qtext'
      })[0]

    let questionText = new XMLSerializer().serializeToString(question)

    const latexReg = /action_link(.*)"/

    while (questionText.search(latexReg) !== -1) {
      questionText = questionText.replace(latexReg, '')
    }

    let questionHash = hashCode(questionText)

    let db = firebase.database().ref(`${name}/${questionHash}/`)

    db.on('value', function(snapshot) {
      if (snapshot.val()) {
        Array.prototype.slice
          .call(question.parentNode.childNodes)
          .filter(e => {
            return e.className === 'ablock'
          })
          .forEach(e =>
            Array.prototype.slice
              .call(e.childNodes)
              .filter(e => {
                return e.className === 'answer'
              })
              .forEach(e => {
                Array.prototype.slice.call(e.childNodes).map(e =>
                  Array.prototype.slice
                    .call(e.childNodes)
                    .filter(e => {
                      return e.nodeName === 'LABEL' || e.nodeName === 'SPAN'
                    })
                    .filter(e => {
                      let answer = e.innerHTML
                      if (!typeof answer === 'string') {
                        answer = new XMLSerializer().serializeToString(answer)
                      }

                      answer = answer.replace('a. ', '')
                      answer = answer.replace('b. ', '')
                      answer = answer.replace('c. ', '')
                      answer = answer.replace('d. ', '')
                      answer = answer.replace('e. ', '')
                      answer = answer.replace('f. ', '')

                      const latexReg = /action_link(.*)"/

                      while (answer.search(latexReg) !== -1) {
                        answer = answer.replace(latexReg, '')
                      }

                      let expectedAnswer = snapshot.val().answer
                      while (expectedAnswer.search(latexReg) !== -1) {
                        expectedAnswer = expectedAnswer.replace(latexReg, '')
                      }

                      if (answer === expectedAnswer) {
                        let input = Array.prototype.slice
                          .call(e.parentNode.childNodes)
                          .filter(e => {
                            return e.nodeName === 'INPUT'
                          })[0]

                        if (input.type === 'radio') {
                          // input.checked = true
                          e.style.background = '#62fc65' // light green
                          _gaq.push(['_trackEvent', 'attempt', 'rightAnswer'])
                          right++
                        }
                      }
                    })
                )
              })
          )
      }
    })

    db = firebase.database().ref(`${name}/${questionHash}/incorrect`)

    db.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if (childSnapshot.val()) {
          Array.prototype.slice
            .call(question.parentNode.childNodes)
            .filter(e => {
              return e.className === 'ablock'
            })
            .forEach(e =>
              Array.prototype.slice
                .call(e.childNodes)
                .filter(e => {
                  return e.className === 'answer'
                })
                .forEach(e => {
                  Array.prototype.slice.call(e.childNodes).map(e =>
                    Array.prototype.slice
                      .call(e.childNodes)
                      .filter(e => {
                        return e.nodeName === 'LABEL' || e.nodeName === 'SPAN'
                      })
                      .filter(e => {
                        let answer = e.innerHTML
                        if (!typeof answer === 'string') {
                          answer = new XMLSerializer().serializeToString(answer)
                        }

                        answer = answer.replace('a. ', '')
                        answer = answer.replace('b. ', '')
                        answer = answer.replace('c. ', '')
                        answer = answer.replace('d. ', '')
                        answer = answer.replace('e. ', '')
                        answer = answer.replace('f. ', '')

                        const latexReg = /action_link(.*)"/

                        while (answer.search(latexReg) !== -1) {
                          answer = answer.replace(latexReg, '')
                        }

                        let expectedAnswer = childSnapshot.val().answer
                        while (expectedAnswer.search(latexReg) !== -1) {
                          expectedAnswer = expectedAnswer.replace(latexReg, '')
                        }

                        if (answer === expectedAnswer) {
                          let input = Array.prototype.slice
                            .call(e.parentNode.childNodes)
                            .filter(e => {
                              return e.nodeName === 'INPUT'
                            })[0]

                          if (input.type === 'radio') {
                            e.style.background = '#ff7066' // light red
                            _gaq.push(['_trackEvent', 'attempt', 'wrongAnswer'])
                            wrong++
                          }
                        }
                      })
                  )
                })
            )
        }
      })
    })
  })

_gaq.push(['_trackEvent', 'attempt', 'wrongCompleted:' + wrong])
_gaq.push(['_trackEvent', 'attempt', 'rightCompleted:' + right])
