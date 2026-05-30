// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwOs7FBOxwse7qqeid-868CoaExfRMkVM",
  authDomain: "write-flow-ai.firebaseapp.com",
  projectId: "write-flow-ai",
  storageBucket: "write-flow-ai.firebasestorage.app",
  messagingSenderId: "872138572302",
  appId: "1:872138572302:web:f3d3e15536076eb8c6325f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);