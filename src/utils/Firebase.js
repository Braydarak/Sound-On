import firebase from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyAOHH1Xdfyau-I8VEzuO6taBin77vVmsiU",
    authDomain: "progressive-sound.firebaseapp.com",
    projectId: "progressive-sound",
    storageBucket: "progressive-sound.appspot.com",
    messagingSenderId: "486882979859",
    appId: "1:486882979859:web:ee4581d05aecfadb7a4fe6"
};

export default firebase.initializeApp(firebaseConfig);