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
            let questionCleaned = question.replace(root.REGEX_ACTION_LINK, '')
            let questionHash = root.hashCode(questionCleaned)
            let answerHash = root.hashCode(answer)

            let updates = {}
            updates[`${name}/${questionHash}/correct/${answerHash}`] = answer
            updates[`${name}/${questionHash}/question`] = question
            root.database.database().ref().update(updates)
            root._gaq.push(['_trackEvent', 'scan', name + '-correct'])
        })

        moodles.filter(e => e.src.indexOf('incorrect') !== -1).forEach(e => {
            let answer = root.extract.answer(e)
            answer = answer.replace(root.REGEX_ANSWER_OPTION, '')
            let question = root.extract.question(e)
            let questionCleaned = question.replace(root.REGEX_ACTION_LINK, '')
            let questionHash = root.hashCode(questionCleaned)
            let answerHash = root.hashCode(answer)

            let updates = {}
            updates[`${name}/${questionHash}/incorrect/${answerHash}`] = answer
            updates[`${name}/${questionHash}/question`] = question
            root.database.database().ref().update(updates)
            root._gaq.push(['_trackEvent', 'scan', name + '-incorrect'])
        })

    } else {
        moodles.filter(e => e.src.indexOf('incorrect') === -1)
            .forEach(e => {
                let answer = root.extract.answer(e)
                answer = answer.replace(root.REGEX_ANSWER_OPTION, '')
                let question = root.extract.question(e)
                let questionCleaned = question.replace(root.REGEX_ACTION_LINK, '')
                let questionHash = root.hashCode(questionCleaned)

                let updates = {}
                updates[`${name}/dissertativa/${questionHash}/answer`] = answer
                updates[`${name}/dissertativa/${questionHash}/question`] = question
                root.database.database().ref().update(updates)
                root._gaq.push(['_trackEvent', 'scan', name + '-dissertativa-correct'])
            })
    }
})(this)
