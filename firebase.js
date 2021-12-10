// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAov8A8eU8QXknultJwR4D1KWUUDT37Itc",
  authDomain: "tinder-clone-ud.firebaseapp.com",
  projectId: "tinder-clone-ud",
  storageBucket: "tinder-clone-ud.appspot.com",
  messagingSenderId: "548672300919",
  appId: "1:548672300919:web:52ef27baf34ef414ac6372",
  measurementId: "G-TB01Z0L0CM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();


export { auth, db };
