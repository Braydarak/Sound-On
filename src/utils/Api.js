import firebaseApp from "./Firebase";
import firebase from "firebase";
const db = firebase.firestore(firebaseApp);

export async function isUserAdmin(uid) {
  const response = await db.collection("Admins").doc(uid).get();
  return response.exists;
}

export const reauthenticate = password => {
  const user = firebase.auth().currentUser;

  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );

  return user.reauthenticateWithCredential(credentials);
};
