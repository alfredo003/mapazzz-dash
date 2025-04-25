const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
require('dotenv').config();

const firebaseConfig = {
  apiKey: "AIzaSyAX7PCdIpNTZAYXi6viASwt_4qS9znpQYY",
  authDomain: "mapzzz-62a4f.firebaseapp.com",
  projectId: "mapzzz-62a4f",
  storageBucket: "mapzzz-62a4f.firebasestorage.app",
  messagingSenderId: "734479508053",
  appId: "1:734479508053:web:e6bf134dfdb033a95daadc",
  measurementId: "G-07LZMHE6GL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

module.exports = { auth }; 