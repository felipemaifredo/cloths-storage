import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC1DrNOlx5f6nsKk3uofpB7KYtkiChmQp4",
    authDomain: "clothes-storage.firebaseapp.com",
    projectId: "clothes-storage",
    storageBucket: "clothes-storage.appspot.com",
    messagingSenderId: "358744516008",
    appId: "1:358744516008:web:4ee0ac539599ac17fe299d"
  };

 // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default firebaseConfig;