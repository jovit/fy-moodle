;(root => {
    const config = {
        firebase: {
            apiKey: 'AIzaSyAXRiEgsWNrmRfPQ8KbXY-0PnZjsAm4INI',
            authDomain: 'fy-moodle.firebaseapp.com',
            databaseURL: 'https://fy-moodle.firebaseio.com',
            projectId: 'fy-moodle',
            storageBucket: 'fy-moodle.appspot.com',
            messagingSenderId: '944849265962'
        },
        gaCode: 'UA-107698779-1'
    }

    root.database = firebase.initializeApp(config.firebase) || {}

    // Analytics
    let _AnalyticsCode = config.gaCode
    root._gaq = _gaq || []
    root._gaq.push(['_setAccount', _AnalyticsCode]);

    // Regex
    root.REGEX_ANSWER_OPTION = /^[a-z]\. /
    root.REGEX_ACTION_LINK = /action_link(.*)"/g
    root.COLLECTABLE_BUZZWORDS = /(teste|question(a|á)rio|pr(é|e)\-aula)/gi
    const FORMULATION_NODE_NAMES = ['DIV']
    const ANSWER_NODE_NAMES = ['LABEL', 'SPAN', '#text']
    const _TEST = ['INPUT']

    // node filtering
    root.filter = {
        questions: node => {
            return FORMULATION_NODE_NAMES.includes(node.nodeName)
        },
        answers: node => {
            return ANSWER_NODE_NAMES.includes(node.nodeName)
        }
    }

    // colouring
    root.colours = {
        correct: 'rgba(98, 252, 101, .9)',
        incorrect: 'rgba(255, 112, 102, .9)'
    }

    // hash
    root.hashCode = word => {
        let hash = 0
        let chr = 0
        if (word.length === 0) return hash
        for (var i = 0; i < word.length; i++) {
            chr = word.charCodeAt(i)
            hash = (hash << 5) - hash + chr
            hash |= 0 // Convert to 32bit integer
        }
        return hash
    }

    // extractors
    // e must be a first-level child of the answer node
    const extractAnswerNode = (e) => {
        let answer = e.parentNode.firstChild
        if (answer.nodeName === 'INPUT' && answer.type === 'radio') {
            answer = answer.nextSibling
        }
        return answer
    }

    // e must be a first-level child of the answer node
    const extractAnswer = (e) => {
        let answer = extractAnswerNode(e)
        if (answer.nodeName === 'INPUT') {
            answer = answer.value
        } else if (answer.nodeName === '#text') {
            // do nothing
        } else {
            answer = answer.innerHTML
        }

        if (answer instanceof Node) {
            answer = new XMLSerializer().serializeToString(answer)
        }
        return answer || ""
    }

    // e must be a child of a .formulation node
    const extractQuestionNode = (e) => {
        let parent = e.parentNode
        while (!parent.classList.contains('formulation')) {
            parent = parent.parentNode
        }

        let question = Array.from(parent.childNodes)
            .filter(root.filter.questions)
            .filter(div => div.classList.contains('qtext'))[0]

        return question
    }

    // e must be a child of a .formulation node
    const extractQuestion = (e) => {
        let question = extractQuestionNode(e)
        if (question instanceof Node) {
            question = new XMLSerializer().serializeToString(question)
        }
        return question || ""
    }

    const getPageName = () => {
        let splitName = document
            .querySelector('.page-header-headings')
            .firstElementChild.innerHTML.split(' ')
        let name = splitName[0] + splitName[1]
        return name
    }

    root.extract = {
        answer: (e) => extractAnswer(e),
        question: (e) => extractQuestion(e),
        node: {
            answer: (e) => extractAnswerNode(e),
            question: (e) => extractQuestionNode(e)
        },
        name: () => getPageName()
    }

})(this)
