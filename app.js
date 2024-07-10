import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js"
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js"
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
const formAddPhrase = document.querySelector('[  data-js="add-phrase-form"]')
const accountDetailsContainer = document.querySelector('[data-js="account-details"]')
const accountDetails = document.createElement('p')

const closeModalAddPhrase = () => {
  const modalAddPhrase = document.querySelector('[data-modal="add-phrase"]')
  M.Modal.getInstance(modalAddPhrase).close()
}

const addPhrase = async (e, user) => {
  e.preventDefault()

  try {
    await addDoc(collectionPhrases, {
      movieTitle: DOMPurify.sanitize(e.target.title.value),
      phrase: DOMPurify.sanitize(e.target.phrase.value),
      userId: user.uid
    })

    e.target.reset()
    closeModalAddPhrase()
 
  } catch(error) {
    console.log(error)
  }
}

const initModals = () =>  {
  const elems = document.querySelectorAll('.modal')
  M.Modal.init(elems)
}

const initCollapsibles = () => M.Collapsible.init(phrasesList)

const login = async () => {
  try{
    await signInWithPopup(auth, provider)

    const modalLogin = document.querySelector('[data-modal="login"]')
    M.Modal.getInstance(modalLogin).close()
  } catch (error) {
    console.log('error:', error)
  }
}

const logout = async unsubscribe => {
  try { 
    await signOut(auth)
    unsubscribe()
    console.log('Usuario foi deslogado')
  } catch (error){
    console.log('error:', error)
  }
}

const renderLinks = ({ userExists }) => {
  const lis = [...document.querySelector('[data-js="nav-ul"]').children]

  lis.forEach(li => {
    const liShouldBeVisible = li.dataset.js.includes(userExists ? 'logged-in' : 'logged-out')

    if (liShouldBeVisible) {
      li.classList.remove('hide')
      return
    }

    li.classList.add('hide')
  }
)
}

const removeLoginMessage = () => {
  const loginMessageExists = document.querySelector('[data-js="login-message"]')
  loginMessageExists?.remove()
}

const handleAnonymousUser = () => {
  const phrasesContainer = document.querySelector('[data-js = "phrases-container"]')
  const loginMessage = document.createElement('h5')

  loginMessage.textContent = 'Faça login para ver as frases'
  loginMessage.classList.add('center-align','white-text')
  loginMessage.setAttribute('data-js','login-message')
  phrasesContainer.append(loginMessage)

  formAddPhrase.onsubmit = null
  buttonLogout.onclick = null
  buttonGoogle.addEventListener('click', login)
  phrasesList.innerHTML = ''
  accountDetailsContainer.innerHTML = ''
}

const createUserDocument = async user => {
  try {
    const userDocRef = doc(db, 'users', user.uid)
    const docSnapshot = await getDoc(userDocRef)

    if(!docSnapshot.exists()) {
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        userId: user.uid
      })
    }
  } catch (error) {
    console.log('Erro ao tentar registrar usuário:', error)
  }
}

const renderPhrases = user => {
  const queryPhrases = query(collectionPhrases, where('userId', '==', user.uid))
  
  return onSnapshot(queryPhrases, snapshot => {
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
}

const handleSignedUser = async user => {
  createUserDocument(user)
  buttonGoogle.removeEventListener('click', login)
  formAddPhrase.onsubmit = e => addPhrase(e, user)

  const unsubscribe = renderPhrases(user)

  buttonLogout.onclick = () => logout(unsubscribe)
  initCollapsibles()
  accountDetails.textContent = `${user.displayName} | ${user.email}`
  accountDetailsContainer.append(accountDetails)
}

const handleAuthStateChanged = async user => {
  renderLinks({userExists : Boolean(user)})
  removeLoginMessage()
  
  if (!user) {
   handleAnonymousUser()
   return 
  }

  handleSignedUser({
    displayName: DOMPurify.sanitize(user.displayName),
    email: DOMPurify.sanitize(user.email),
    uid: DOMPurify.sanitize(user.uid)
  })
}

onAuthStateChanged(auth, handleAuthStateChanged)

initModals()
