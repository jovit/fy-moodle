;((root) => {
    root._gaq.push(['_trackPageview'])

    const name = root.extract.name()
    Array.prototype.slice
        .call(document.querySelectorAll('.qtext'))
        .forEach(e => {
            let question = root.extract.node.question(e)
            let questionText = root.extract.question(e).replace(root.REGEX_ACTION_LINK, '')
            let questionHash = root.hashCode(questionText)

            let db = root.database.database().ref(`${name}/${questionHash}/`)
            db.on('value', function(snapshot) {
                if (snapshot.val()) {
                    console.log(snapshot.val())
                    let expectedAnswer = snapshot.val().answer
                    let incorrectAnswers = snapshot.val().incorrect

                    if (expectedAnswer) {
                        expectedAnswer = expectedAnswer.replace(root.REGEX_ANSWER_OPTION, '')
                    } else {
                        expectedAnswer = ""
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

                                    let input = Array.prototype.slice
                                        .call(answer.parentNode.childNodes)
                                        .filter(e => e.nodeName === 'INPUT')[0]

                                    if (answerText === expectedAnswer) {
                                        let button = document.createElement('input')
                                        button.type = 'button'
                                        button.value = 'Clique para mostrar a resposta certa'
                                        button.addEventListener('click', () => {
                                            answer.setAttribute('style', `background: ${root.colours.correct}`)
                                        })
                                        question.parentNode.appendChild(button)
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
                                    }
                                })))
                }
            })
        })
})(this)
