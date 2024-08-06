// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTmM8VkaUFO6qDRE2fe-AgUNd46elwdnk",
  authDomain: "pantry-tracker-6ac8d.firebaseapp.com",
  projectId: "pantry-tracker-6ac8d",
  storageBucket: "pantry-tracker-6ac8d.appspot.com",
  messagingSenderId: "324968601596",
  appId: "1:324968601596:web:4ee17a86dd8f5083530479",
  measurementId: "G-GDKSQ6PLVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };

