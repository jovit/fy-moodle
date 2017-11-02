;(root => {
    root._gaq.push(['_trackPageview'])

    const name = root.extract.name()
    let right = 0
    let wrong = 0

    Array.prototype.slice
        .call(document.querySelectorAll('.qtext'))
        .forEach(e => {
            let question = root.extract.node.question(e)
            let questionText = root.extract.question(e).replace(root.REGEX_ACTION_LINK, '')
            let questionHash = root.hashCode(questionText)

            let db = root.database.database().ref(`${name}/${questionHash}/`)
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

                                    let input = Array.from(answer.parentNode.childNodes)
                                        .filter(e => e.nodeName === 'INPUT')[0]

                                    if (expectedAnswers.includes(answerText)) {
                                        let button = document.createElement('input')
                                        button.type = 'button'
                                        button.value = 'Clique para mostrar a resposta certa'
                                        button.addEventListener('click', () => {
                                            answer.setAttribute('style', `background: ${root.colours.correct}`)
                                        })
                                        question.parentNode.appendChild(button)
                                        root._gaq.push(['_trackEvent', 'attempt', 'rightAnswer'])
                                        right++
                                    } else if (incorrectAnswers.includes(answerText)) {
                                        let button = question.parentNode.querySelector('.show-wrong')
                                        if (!button) {
                                            button = document.createElement('input')
                                            button.className = 'show-wrong'
                                            button.type = 'button'
                                            button.setAttribute('style', `background: ${root.colours.incorrect}`)
                                            button.value = 'Clique para mostrar as respostas erradas'
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
                                                button.value = 'Clique para mostrar a resposta certa'
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
