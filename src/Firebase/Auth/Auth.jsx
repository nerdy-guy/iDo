import { auth, db, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
import { doc, setDoc } from "firebase/firestore";

const Auth = ({ setIsAuth, cookies }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
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

  return (
    <div>
      <p>Sign in with Google to continue</p>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default Auth;
