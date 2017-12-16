; (root => {
    root._gaq.push(['_trackPageview'])

    function collectAnswers(homePageHtml) {
        let fragment = new DocumentFragment()
        let html = document.createElement('html')

        fragment.appendChild(html)
        fragment.firstChild.innerHTML = homePageHtml

        Array.from(fragment.firstChild.querySelectorAll('.type_course')).forEach(e => {
            let a = e.firstChild.firstChild
            let link = a.href
            let splitName = a.title.split(' ')
            let name = splitName[0] + splitName[1]

            let gradesLink = link.replace('course/view', 'grade/report/user/index')
            if (gradesLink) {
                axios.get(gradesLink).then(page => {
                    let fragment = new DocumentFragment()
                    let html = document.createElement('html')
                    fragment.appendChild(html)
                    fragment.firstChild.innerHTML = page.data
                    Array.from(fragment.firstChild.querySelectorAll('a.gradeitemheader'))
                        .filter(grade => grade.href)
                        .forEach(grade => {
                            if (grade.innerHTML.match(root.COLLECTABLE_BUZZWORDS) != null) {
                                axios.get(grade.href).then(revisionPage => {
                                    fragment.firstChild.innerHTML = revisionPage.data
                                    if (fragment.firstChild.querySelector('a') == undefined) {
                                        console.log('Teste não feito:', grade.href)
                                    } else {
                                        Array.from(fragment.firstChild.querySelectorAll('a'))
                                            .filter(e => e.innerHTML === 'Revisão')
                                            .filter(e => e.href)
                                            .forEach(e => {
                                                let testeLink = e.href
                                                axios.get(testeLink)
                                                    .then(testePage => {
                                                        fragment.firstChild.innerHTML = testePage.data
                                                        if (fragment.firstChild.querySelectorAll('.form-control').length === 0) {
                                                            Array.from(fragment.firstChild.querySelectorAll('.questioncorrectnessicon'))
                                                                .filter(e => e.src.indexOf('incorrect') === -1)
                                                                .map(e => {
                                                                    try {
                                                                        let answer = root.extract.answer(e)
                                                                        answer = answer.replace(root.REGEX_ANSWER_OPTION, '')
                                                                        let question = root.extract.node.question(e)
                                                                        let questionText = root.extract.question(e)
                                                                        let questionTextClean = root.filterLinks(question)
                                                                        let questionHash = root.hashCode(questionTextClean)
                                                                        let answerHash = root.hashCode(answer)

                                                                        let updates = {}
                                                                        updates[`${name}/${questionHash}/correct/${answerHash}/answer`] = answer
                                                                        updates[`${name}/${questionHash}/question`] = questionText
                                                                        root.database.database().ref().update(updates)

                                                                        root._gaq.push(['_trackEvent', 'collecting', name + '-correct'])
                                                                    } catch (er) {
                                                                        console.log(testeLink)
                                                                        console.log(e)
                                                                        console.log(e.parentNode)
                                                                    }
                                                                })

                                                            Array.from(fragment.firstChild.querySelectorAll('.questioncorrectnessicon'))
                                                                .filter(e => e.src.indexOf('incorrect') !== -1)
                                                                .map(e => {
                                                                    try {
                                                                        let answer = root.extract.answer(e)
                                                                        answer = answer.replace(root.REGEX_ANSWER_OPTION, '')
                                                                        let question = root.extract.question(e)
                                                                        let questionClean = root.filterLinks(question)
                                                                        let questionHash = root.hashCode(questionClean)
                                                                        let answerHash = root.hashCode(answer)

                                                                        let updates = {}
                                                                        updates[`${name}/${questionHash}/incorrect/${answerHash}/answer`] = answer
                                                                        updates[`${name}/${questionHash}/question`] = question
                                                                        root.database.database().ref().update(updates)

                                                                        root._gaq.push(['_trackEvent', 'scan', name + '-incorrect'])
                                                                    } catch (er) {
                                                                        console.log(testeLink, er, e)
                                                                    }
                                                                })
                                                        } else {
                                                            Array.from(fragment.firstChild.querySelectorAll('.questioncorrectnessicon'))
                                                                .filter(e => e.src.indexOf('incorrect') === -1)
                                                                .map(e => {
                                                                    let answer = root.extract.answer(e)
                                                                    answer = answer.replace(root.REGEX_ANSWER_OPTION, '')
                                                                    let question = root.extract.question(e)
                                                                    let questionClean = root.filterLinks(question)
                                                                    let questionHash = root.hashCode(questionClean)

                                                                    let updates = {}
                                                                    updates[`${name}/dissertativa/${questionHash}/answer`] = answer
                                                                    updates[`${name}/dissertativa/${questionHash}/question`] = question
                                                                    root.database.database().ref().update(updates)

                                                                    root._gaq.push(['_trackEvent', 'scan', name + '-dissertativa-correct'])
                                                                })
                                                        }
                                                    })
                                            })
                                    }
                                })
                            }
                        })
                })
            }

        })
    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        collectAnswers(request.page)

        if (request.greeting == 'hello') {
            sendResponse({ farewell: 'goodbye' })
        }
    })
})(this)
