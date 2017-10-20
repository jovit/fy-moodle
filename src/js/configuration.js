import * as firebase from 'firebase';

const config = {
    firebase: {
        apiKey: 'AIzaSyAXRiEgsWNrmRfPQ8KbXY-0PnZjsAm4INI',
        authDomain: 'fy-moodle.firebaseapp.com',
        databaseURL: 'https://fy-moodle.firebaseio.com',
        projectId: 'fy-moodle',
        storageBucket: 'fy-moodle.appspot.com',
        messagingSenderId: '944849265962'
    }
}
var database = firebase.initializeApp(config.firebase)
export default database
