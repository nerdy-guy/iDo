import { auth, db, provider } from "../firebase";
import { signInAnonymously, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Auth = ({ setIsAuth }) => {
  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setIsAuth(true);
    } catch (e) {
      console.error(e);
    }

    const userRef = doc(db, "users", auth.currentUser.uid);

    await setDoc(userRef, {
      user: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photo: auth.currentUser.photoURL,
      uid: auth.currentUser.uid,
    });
  };

  const signUpAnonymously = async () => {
    try {
      const result = await signInAnonymously(auth);
      setIsAuth(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <p>Sign in with Google to continue</p>
      <button onClick={signUpWithGoogle}>Sign in with Google</button>

      <p>Sign in with Anon</p>
      <button onClick={signUpAnonymously}>Sign in with anon</button>
    </div>
  );
};

export default Auth;
