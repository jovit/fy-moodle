export const REGEX_ANSWER_OPTION = /^[a-z]\. /
export const REGEX_ACTION_LINK = /action_link(.*)"/g
const FORMULATION_NODE_NAMES = ['DIV']
const ANSWER_NODE_NAMES = ['LABEL', 'SPAN']

export const filterRelevantNodes = {
    questions: node => {
        return FORMULATION_NODE_NAMES.includes(node.nodeName)
    },
    answers: node => {
        return ANSWER_NODE_NAMES.includes(node.nodeName)
    }
}

export const color = {
    correct: 'rgba(200, 229, 189, .9)',
    incorrect: 'rgba(233, 185, 185, .9)'
}

export const hashCode = word => {
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

const extractAnswerNode = (e) => {
    let answer = Array.from(e.parentNode.childNodes)
        .filter(filterRelevantNodes.answers)[0]
    return answer
}

const extractAnswer = (e) => {
    let answer = extractAnswerNode(e)
    if (answer.nodeName === 'INPUT') {
        answer = answer.value
    } else {
        answer = answer.innerHTML
    }

    if (answer instanceof Node) {
        answer = new XMLSerializer().serializeToString(answer)
    }
    return answer || ""
}

const extractQuestionNode = (e) => {
    let parent = e.parentNode
    while (!parent.classList.contains('formulation')) {
        parent = parent.parentNode
    }

    let question = Array.from(parent.childNodes)
        .filter(filterRelevantNodes.questions)
        .filter(div => div.classList.contains('qtext'))[0]

    return question
}

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

export const extract = {
    answer: (e) => extractAnswer(e),
    question: (e) => extractQuestion(e),
    node: {
        answer: (e) => extractAnswerNode(e),
        question: (e) => extractQuestionNode(e)
    },
    name: () => getPageName()
}
