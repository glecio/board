import firebase from 'firebase/app'
import { initializeApp } from "firebase/app";
import 'firebase/filestore'



// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAdje_IUVl6k1FCeJLqtVxK4eMsAtmmkw",
  authDomain: "board-app-a9af0.firebaseapp.com",
  projectId: "board-app-a9af0",
  storageBucket: "board-app-a9af0.appspot.com",
  messagingSenderId: "1098795360357",
  appId: "1:1098795360357:web:c0b9476d2098949fdc268c"
};

// Initialize Firebase
if(!firebase.getApps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase
