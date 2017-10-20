import * as constants from './constants.js'
import firebase from './configuration.js'

console.log('ping')
const moodles = Array.from(document.querySelectorAll('.questioncorrectnessicon'))
const name = constants.extract.name()

moodles.filter(e => e.src.indexOf('incorrect') === -1)
    .forEach(e => {
        let answer = constants.extract.answer(e)
        answer = answer.replace(constants.REGEX_ANSWER_OPTION, '')
        let question = constants.extract.question(e)
        let questionHash = constants.hashCode(question)
        console.log(`MA: ${answer}`)
        console.log(`MA: ${questionHash}`)
        let db = firebase.database().ref(`${name}/`)
        db.child(questionHash).set({ answer })
    })


moodles.filter(e => e.src.indexOf('incorrect') !== -1)
    .forEach(e => {
        let answer = constants.extract.answer(e)
        answer = answer.replace(constants.REGEX_ANSWER_OPTION, '')
        let question = constants.extract.question(e)
        question = question.replace(constants.REGEX_ACTION_LINK, '')
        let questionHash = constants.hashCode(question)
        let answerHash = constants.hashCode(answer)
        console.log(`MA: ${answer}`)
        console.log(`MAH: ${answerHash}`)
        console.log(`MA: ${questionHash}`)
        let db = firebase.database().ref(`${name}/${questionHash}/incorrect`)
        db.child(constants.hashCode(answer)).set({ answer })
    })
