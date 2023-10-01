import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCJdror1hAPfsLdZ-AL62qBfBr9A0JrMCQ",
    authDomain: "clothsstorage-a61b8.firebaseapp.com",
    databaseURL: "https://clothsstorage-a61b8-default-rtdb.firebaseio.com",
    projectId: "clothsstorage-a61b8",
    storageBucket: "clothsstorage-a61b8.appspot.com",
    messagingSenderId: "77149414889",
    appId: "1:77149414889:web:39d3aededf678b831dd778"
  };

 // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default firebaseConfig;