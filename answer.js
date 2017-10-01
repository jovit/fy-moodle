const hashCode = function(word) {
    var hash = 0,
        i, chr;
    if (word.length === 0) return hash;
    for (i = 0; i < word.length; i++) {
        chr = word.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var config = {
    apiKey: "AIzaSyAXRiEgsWNrmRfPQ8KbXY-0PnZjsAm4INI",
    authDomain: "fy-moodle.firebaseapp.com",
    databaseURL: "https://fy-moodle.firebaseio.com",
    projectId: "fy-moodle",
    storageBucket: "fy-moodle.appspot.com",
    messagingSenderId: "944849265962"
};
firebase.initializeApp(config);



const splitName = document.getElementsByClassName("page-header-headings")[0].childNodes[0].innerHTML.split(" ")
const name = splitName[0] + splitName[1]


Array.prototype.slice.call(document.getElementsByClassName("formulation")).forEach(e => {
    let question = Array.prototype.slice.call(e.childNodes).filter(e => e.nodeName === "DIV").filter(div => {
    return div.className === "qtext"
})[0]

let questionHash = hashCode(new XMLSerializer().serializeToString(question))

let db = firebase.database().ref(`${name}/`)

db.child(questionHash).on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        Array.prototype.slice.call(question.parentNode.childNodes).filter(e => {
            return e.className === "ablock"
        })
    .forEach(e => Array.prototype.slice.call(e.childNodes)
            .filter(e => {
            return e.className === "answer"
        })
    .forEach(e => {
            Array.prototype.slice.call(e.childNodes).map(e => Array.prototype.slice.call(e.childNodes).filter(e => {
            return e.nodeName === "LABEL" || e.nodeName === "SPAN"
        }).filter(e => {
            let answer = e.innerHTML
            if (!typeof answer === "string") {
            answer = new XMLSerializer().serializeToString(answer)
        }

        if (answer === childSnapshot.val()) {
            const input = Array.prototype.slice.call(e.parentNode.childNodes).filter(e => {
                return e.nodeName === "INPUT"
            })[0]

            if (input.type === "radio") {
                input.checked = true
                e.style.background = "green"
            }

        }
    }))
    })
    )


    })
})

db = firebase.database().ref(`${name}/${questionHash}/incorrect`)

db.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        Array.prototype.slice.call(question.parentNode.childNodes).filter(e => {
            return e.className === "ablock"
        })
    .forEach(e => Array.prototype.slice.call(e.childNodes)
            .filter(e => {
            return e.className === "answer"
        })
    .forEach(e => {
            Array.prototype.slice.call(e.childNodes).map(e => Array.prototype.slice.call(e.childNodes).filter(e => {
            return e.nodeName === "LABEL" || e.nodeName === "SPAN"
        }).filter(e => {
            let answer = e.innerHTML
            if (!typeof answer === "string") {
            answer = new XMLSerializer().serializeToString(answer)
        }

        if (answer === childSnapshot.val().answer) {
            const input = Array.prototype.slice.call(e.parentNode.childNodes).filter(e => {
                return e.nodeName === "INPUT"
            })[0]

            if (input.type === "radio") {
                e.style.background = "red"
            }

        }
    }))
    })
    )


    })
})

})