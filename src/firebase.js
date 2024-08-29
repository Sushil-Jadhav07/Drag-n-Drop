// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTRQV45mrMtUPk_x7SqcxSPVQUTteVNPA",
  authDomain: "g-drive-ccb08.firebaseapp.com",
  projectId: "g-drive-ccb08",
  storageBucket: "g-drive-ccb08.appspot.com",
  messagingSenderId: "547154353760",
  appId: "1:547154353760:web:2acf7657739e48171b6d05",
  measurementId: "G-DKWMQX6YSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export {storage};