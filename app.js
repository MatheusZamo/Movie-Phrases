import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js"
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js"
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
const collectionPhrases = collection(db, 'phrases')

const buttonGoogle = document.querySelector('[data-js="button-google"]')
const buttonLogout = document.querySelector('[data-js="logout"]')
const phrasesList = document.querySelector('[data-js="phrases-list"]')

const addPhrase = async e => {
  e.preventDefault()

  try {
    await addDoc(collectionPhrases, {
      movieTitle: DOMPurify.sanitize(e.target.title.value),
      phrase: DOMPurify.sanitize(e.target.phrase.value)
    })

    e.target.reset()

    const modalAddPhrase = document.querySelector('[data-modal="add-phrase"]')
    M.Modal.getInstance(modalAddPhrase).close()

  } catch(error) {
    console.log(error)
  }
}

const initCollapsibles = () => M.Collapsible.init(phrasesList)

const handleAuthStateChanged = user => {
  console.log(user)

  const lis = [...document.querySelector('[data-js="nav-ul"]').children]

  lis.forEach(li => {
    const liShouldBeVisible = li.dataset.js.includes(user ? 'logged-in' : 'logged-out')

    if (liShouldBeVisible) {
      li.classList.remove('hide')
      return
    }

    li.classList.add('hide')
  }
)

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
    buttonLogout.removeEventListener('click', logout)
    buttonGoogle.addEventListener('click', login)
    phrasesList.innerHTML = ''
    return
  }

  buttonGoogle.removeEventListener('click', login)
  formAddPhrase.addEventListener('submit', addPhrase)
  buttonLogout.addEventListener('click', logout)
  onSnapshot(collectionPhrases, snapshot => {
    const documentFragment = document.createDocumentFragment()

    snapshot.docChanges().forEach(docChange => {
      const liPhrase = document.createElement('li')
      const movieTitleContainer = document.createElement('div')
      const phraseContainer = document.createElement('div')
      const { movieTitle, phrase } = docChange.doc.data()

      movieTitleContainer.textContent = DOMPurify.sanitize(movieTitle)
      phraseContainer.textContent = DOMPurify.sanitize(phrase)
      movieTitleContainer.setAttribute('class','collapsible-header blue-grey-text text-lighten-5 blue-grey darken-4')
      phraseContainer.setAttribute('class','collapsible-body blue-grey-text text-lighten-5 blue-grey darken-3')

      liPhrase.append(movieTitleContainer, phraseContainer)
      documentFragment.append(liPhrase)
    })

    phrasesList.append(documentFragment)
  })
  initCollapsibles()
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

onAuthStateChanged(auth, handleAuthStateChanged)
buttonGoogle.addEventListener('click',login)
buttonLogout.addEventListener('click', logout)

initModals()


