import React, { useState } from "react";
import firebase from "./utils/Firebase";
import { ToastContainer } from "react-toastify";
import "firebase/auth";
import Auth from "./pages/Auth";
import loggedLayout from "./layouts/LoggedLayout";
import LoggedLayout from "./layouts/LoggedLayout";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadApp, setReloadApp] = useState(false);

  firebase.auth().onAuthStateChanged(currentUser => {
    
    if(!currentUser?.emailVerified) {
      firebase.auth().signOut();
      setUser(null);
    } else{
      setUser(currentUser);
    }
   
    setLoading(false);
  });

  if (loading) {
    return null;
  }

  return(
    <>
      {!user ? <Auth /> : <LoggedLayout user={user} setReloadApp={setReloadApp}/>}

      <ToastContainer 
        position="top-center"
        autoclose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover={false}
      />
    </>
  )
}

export default App;
