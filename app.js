import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js"
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyAtl-9N2bcRWRug3sF768Ryb_lkb5FOVdE",
    authDomain: "fir-auth-20347.firebaseapp.com",
    projectId: "fir-auth-20347",
    storageBucket: "fir-auth-20347.appspot.com",
    messagingSenderId: "815223608199",
    appId: "1:815223608199:web:bffafe236ad7ce0bf57922",
    measurementId: "G-QS7NFDGJGK"
  };

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const provider = new GoogleAuthProvider()







// const getData = async () => {
//     const querySnapshot = await getDocs(collection(db, 'frases'))
//     querySnapshot.forEach(doc => console.log(doc.data()))
// } 

// getData()


const loggedOut = document.querySelector('[data-js="logged-out"]')
const modalLogin = document.querySelector('[data-js="modal-login"]')
const buttonGoogle = document.querySelector('[data-js="button-form"]')

loggedOut.addEventListener('click', () => {
  console.log('oi')
  modalLogin.classList.add('modal-login')
})

buttonGoogle.addEventListener('click', () => {
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
    // The signed-in user info.
      const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    }).catch((error) => {
    // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    // The email of the user's account used.
      const email = error.customData.email;
    // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
})