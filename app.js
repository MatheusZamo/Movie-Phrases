import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js"
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js"
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js"

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
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


const buttonGoogle = document.querySelector('[data-js="button-google"]')
const buttonLogout = document.querySelector('[data-js="logout"]')

const addPhrase = e => {
  e.preventDefault()
  console.log('Callback do envio do form executado')
}

const showAppropriatedNavLinks = user => {
  console.log(user)

  const lis = [...document.querySelector('[data-js="nav-ul"]').children]

  lis.forEach(li => {
    const liShouldBeVisible = li.dataset.js.includes(user ? 'logged-in' : 'logged-out')

    if (liShouldBeVisible) {
      li.classList.remove('hide')
      return
    }

    li.classList.add('hide')
  })

  const loginMessageExists = document.querySelector('[data-js="login-message"]')
  loginMessageExists?.remove()

  const formAddPhrase = document.querySelector('[  data-js="add-phrase-form"]')

  if (!user) {
    const phrasesContainer = document.querySelector('[data-js = "phrases-container"]')
    const loginMessage = document.createElement('h5')

    loginMessage.textContent = 'Faça login para ver as frases'
    loginMessage.classList.add('center-align','white-text')
    loginMessage.setAttribute('data-js','login-message')
    phrasesContainer.append(loginMessage)
    formAddPhrase.removeEventListener('submit', addPhrase)
    return
  }

  formAddPhrase.addEventListener('submit', addPhrase)
}

const initModals = () =>  {
  const elems = document.querySelectorAll('.modal')
  M.Modal.init(elems)
}

const login = async () => {
  try{
    await signInWithPopup(auth, provider)

    const modalLogin = document.querySelector('[data-modal="login"]')
    M.Modal.getInstance(modalLogin).close()
  } catch (error) {
    console.log('error:', error)
  }
}

const logout = async () => {
  try { 
    await signOut(auth)
    console.log('Usuario foi deslogado')
  } catch (error){
    console.log('error:', error)
  }
}

onAuthStateChanged(auth, showAppropriatedNavLinks)
buttonGoogle.addEventListener('click',login)
buttonLogout.addEventListener('click', logout)

initModals()


