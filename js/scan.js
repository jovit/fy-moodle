;(root => {
    console.log('ping')
    root._gaq.push(['_trackPageview'])
    root._gaq.push(['_trackEvent', 'review', 'entered'])

    const moodles = Array.from(
        document.querySelectorAll('.questioncorrectnessicon')
    )
    const name = root.extract.name()

    // Multiple choice question
    if (document.querySelectorAll('.form-control').length === 0) {
        moodles.filter(e => e.src.indexOf('incorrect') === -1).forEach(e => {
            let answer = root.extract.answer(e)
            answer = answer.replace(root.REGEX_ANSWER_OPTION, '')
            let question = root.extract.question(e)
            question = question.replace(root.REGEX_ACTION_LINK, '')
            let questionHash = root.hashCode(question)
            let answerHash = root.hashCode(answer)

            let db = root.database.database().ref(`${name}/${questionHash}/correct`)
            db.child(answerHash).set({ answer })
            root._gaq.push(['_trackEvent', 'scan', name + '-correct'])
        })

        moodles.filter(e => e.src.indexOf('incorrect') !== -1).forEach(e => {
            let answer = root.extract.answer(e)
            answer = answer.replace(root.REGEX_ANSWER_OPTION, '')
            let question = root.extract.question(e)
            question = question.replace(root.REGEX_ACTION_LINK, '')
            let questionHash = root.hashCode(question)
            let answerHash = root.hashCode(answer)

            let db = root.database.database().ref(`${name}/${questionHash}/incorrect`)
            db.child(answerHash).set({answer})
            root._gaq.push(['_trackEvent', 'scan', name + '-incorrect'])
        })

    } else {
        moodles.filter(e => e.src.indexOf('incorrect') === -1)
            .forEach(e => {
                let answer = root.extract.answer(e)
                answer = answer.replace(root.REGEX_ANSWER_OPTION, '')
                let question = root.extract.question(e)
                question = question.replace(root.REGEX_ACTION_LINK, '')
                let questionHash = root.hashCode(question)

                let db = firebase.database().ref(`${name}/dissertativa/`)
                db.child(questionHash).set({ answer })
                root._gaq.push(['_trackEvent', 'scan', name + '-dissertativa-correct'])
            })
    }
})(this)
