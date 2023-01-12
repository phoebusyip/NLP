// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVKUAWB-OKmEuPnHEoteXroHWUuRVcidg",
  authDomain: "nlp--374018.firebaseapp.com",
  projectId: "nlp-youtube-374018",
  storageBucket: "nlp-youtube-374018.appspot.com",
  messagingSenderId: "882787498731",
  appId: "1:882787498731:web:b6a583b7622487c3e0dcae",
  measurementId: "G-Z91Q690TFW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore();
