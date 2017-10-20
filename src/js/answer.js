'use strict'
import * as constants from './constants.js'
import firebase from './configuration.js'

const name = constants.extract.name()
Array.prototype.slice
    .call(document.querySelectorAll('.qtext'))
    .forEach(e => {
        let question = constants.extract.node.question(e)
        let questionText = constants.extract.question(e).replace(constants.REGEX_ACTION_LINK, '')
        let questionHash = constants.hashCode(questionText)

        let db = firebase.database().ref(`${name}/${questionHash}/`)
        db.on('value', function(snapshot) {
            if (snapshot.val()) {
                let expectedAnswer = snapshot.val().answer
                expectedAnswer = expectedAnswer.replace(constants.REGEX_ANSWER_OPTION, '')
                Array.from(question.parentNode.childNodes)
                    .filter(e => e.classList.contains('ablock'))
                    .forEach(e => Array.from(e.childNodes)
                        .filter(e => e.classList.contains('answer'))
                        .forEach(e =>
                            Array.from(e.childNodes)
                            .filter(e => e.childElementCount > 0)
                            .forEach(e => {
                                let answer = constants.extract.node.answer(e.firstElementChild)
                                let answerText = constants.extract.answer(e.firstElementChild)

                                if (answerText === expectedAnswer) {
                                    let input = Array.prototype.slice
                                        .call(answer.parentNode.childNodes)
                                        .filter(e => e.nodeName === 'INPUT')[0]

                                    if (input.type === 'radio') {
                                        input.checked = true
                                        answer.setAttribute('style', `background-color: ${constants.color.correct}`)
                                    }
                                }
                            })))
            }
        })

        db = firebase.database().ref(`${name}/${questionHash}/incorrect`)

        db.on('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                if (childSnapshot.val()) {
                    let incorrectAnswer = childSnapshot.val().answer
                    incorrectAnswer = incorrectAnswer.replace(constants.REGEX_ANSWER_OPTION, '')

                    Array.from(question.parentNode.childNodes)
                        .filter(e => e.classList.contains('ablock'))
                        .forEach(e => Array.from(e.childNodes)
                            .filter(e => e.classList.contains('answer'))
                            .forEach(e =>
                                Array.from(e.childNodes)
                                .filter(e => e.childElementCount > 0)
                                .forEach(e => {
                                    let answer = constants.extract.node.answer(e.firstElementChild)
                                    let answerText = constants.extract.answer(e.firstElementChild)

                                    if (answerText === incorrectAnswer) {
                                        let input = Array.from(answer.parentNode.childNodes)
                                            .filter(e => e.nodeName === 'INPUT')[0]

                                        if (input.type === 'radio') {
                                            answer.setAttribute('style', `background-color: ${constants.color.incorrect}`)
                                        }
                                    }
                                })))
                }
            })
        })
    })
