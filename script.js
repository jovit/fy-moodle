
const hashCode = function(word) {
  var hash = 0, i, chr;
  if (word.length === 0) return hash;
  for (i = 0; i < word.length; i++) {
    chr   = word.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
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

var db = firebase.database().ref(`${name}/`)

Array.prototype.slice.call(document.getElementsByClassName("questioncorrectnessicon"))
.filter(e => {
  return e.src.indexOf("incorrect") === -1
})
.map(e => {
  const answer =
  Array.prototype.slice.call(e.parentNode.childNodes).filter(e => {
    console.log(e.nodeName)
    return e.nodeName === "LABEL" || e.nodeName === "SPAN" || e.nodeName === "INPUT"
  }).map(e => {
    console.log(e)
    if (e.nodeName === "INPUT") {
      return e.value
    } else {
      return e.innerHTML
    }
  })[0]

  if (!typeof answer === "string") {
    answer = new XMLSerializer().serializeToString(answer)
  }

  let parent = e.parentNode;

  while (parent.className.indexOf("formulation") === -1) {
    parent = parent.parentNode

  }

  const question = Array.prototype.slice.call(parent.childNodes).filter(e => {
    return e.nodeName === "DIV"
  }).filter(div => {
    return div.className === "qtext"
  })[0]

  console.log(answer, question)

  db.child(hashCode(new XMLSerializer().serializeToString(question))).set(
    {answer: answer, question: new XMLSerializer().serializeToString(question)}
  );
})
