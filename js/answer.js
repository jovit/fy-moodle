;(root => {
    root._gaq.push(['_trackPageview'])

    const name = root.extract.name()
    let right = 0
    let wrong = 0

    Array.prototype.slice
        .call(document.querySelectorAll('.qtext'))
        .forEach(e => {
            let question = root.extract.node.question(e)
            let questionTextOldFilter = root.extract.question(e).replace(root.REGEX_ACTION_LINK, '')
            let questionHashOldFilter = root.hashCode(questionTextOldFilter)
            let questionText = root.filterLinksFromNode(question)
            let questionHash = root.hashCode(questionText)

            // if there's an answer in the old format, put it in the new format and delete it
            let db = root.database.database().ref(`${name}/${questionHashOldFilter}/`)
            db.once('value', function(snapshot) {
                if (snapshot.val()) {
                    let updates = {}
                    updates[`${name}/${questionHash}/`] = snapshot.val()
                    updates[`${name}/${questionHashOldFilter}/`] = null
                    root.database.database().ref().update(updates)
                    root._gaq.push(['_trackEvent', 'answer', name + '-porting-answer'])
                }
            })

            db = root.database.database().ref(`${name}/${questionHash}/`)
            db.on('value', function(snapshot) {
                if (snapshot.val()) {
                    let expectedAnswers = snapshot.val().correct
                    let incorrectAnswers = snapshot.val().incorrect

                    if (!expectedAnswers) {
                        expectedAnswers = []
                    } else {
                        expectedAnswers = Object.keys(expectedAnswers).map(key => expectedAnswers[key].answer)
                    }

                    if (!incorrectAnswers) {
                        incorrectAnswers = []
                    } else {
                        incorrectAnswers = Object.keys(incorrectAnswers).map(key => incorrectAnswers[key].answer)
                    }

                    Array.from(question.parentNode.childNodes)
                        .filter(e => e.classList.contains('ablock'))
                        .forEach(e => Array.from(e.childNodes)
                            .filter(e => e.classList.contains('answer'))
                            .forEach(e =>
                                Array.from(e.childNodes)
                                .filter(e => e.childElementCount > 0)
                                .forEach(e => {
                                    let answer = root.extract.node.answer(e.firstElementChild)
                                    let answerText = root.extract.answer(e.firstElementChild)
                                    answerText = answerText.replace(root.REGEX_ANSWER_OPTION, '')

                                    let input = Array.from(answer.parentNode.childNodes)
                                        .filter(e => e.nodeName === 'INPUT')[0]

                                    if (expectedAnswers.includes(answerText)) {
                                        let button = question.parentNode.querySelector('.show-right')
                                        if (!button) {
                                            button = document.createElement('input')
                                            button.className = 'show-right'
                                            button.type = 'button'
                                            button.value = chrome.i18n.getMessage("button_right_answers")
                                            question.parentNode.appendChild(button)
                                        }

                                        button.addEventListener('click', () => {
                                            answer.setAttribute('style', `background: ${root.colours.correct}`)
                                        })
                                        root._gaq.push(['_trackEvent', 'attempt', 'rightAnswer'])
                                        right++
                                    } else if (incorrectAnswers.includes(answerText)) {
                                        let button = question.parentNode.querySelector('.show-wrong')
                                        if (!button) {
                                            button = document.createElement('input')
                                            button.className = 'show-wrong'
                                            button.type = 'button'
                                            button.setAttribute('style', `background: ${root.colours.incorrect}`)
                                            button.value = chrome.i18n.getMessage("button_wrong_answers")
                                            question.parentNode.appendChild(button)
                                        }

                                        button.addEventListener('click', () => {
                                            answer.setAttribute('style', `background-color: ${root.colours.incorrect}`)
                                        })
                                        root._gaq.push(['_trackEvent', 'attempt', 'wrongAnswer'])
                                        wrong++
                                    } else if (input && input.type === 'text') {
                                        // dissertativa
                                        let dtb = root.database.database().ref(`${name}/dissertativa/${questionHash}/`)
                                        dtb.on('value', snpst => {
                                            if (snpst.val()) {
                                                let xpctdnswr = snapshot.val().answer
                                                let button = document.createElement('input')
                                                button.type = 'button'
                                                button.value = chrome.i18n.getMessage("button_right_answers")
                                                button.addEventListener('click', () => {
                                                    let span = document.createElement('span')
                                                    span.innerHTML = xpctdnswr
                                                    span.setAttribute('style', `background: ${root.colours.correct}`)
                                                    input.parentElement.appendChild(span)
                                                })
                                                question.parentNode.appendChild(button)
                                                root._gaq.push(['_trackEvent', 'attempt', 'rightAnswer'])
                                                right++
                                            }
                                        })
                                    }
                                })))
                }
            })
        })
    root._gaq.push(['_trackEvent', 'attempt', 'wrongCompleted:'+wrong])
    root._gaq.push(['_trackEvent', 'attempt', 'rightCompleted:'+right])
})(this)
