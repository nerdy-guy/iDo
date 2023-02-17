import { Link, useNavigate } from "react-router-dom";
import { signInAnonymously, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, provider } from "../../config/firebase";
import logo from "../../assets/logo.svg";
import styles from "./Home.module.css";

const Home = ({ setIsAuth }) => {
  const navigate = useNavigate();

  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const userRef = doc(db, "users", auth.currentUser.uid);

      const { currentUser } = auth;

      await setDoc(userRef, {
        displayName: currentUser.displayName,
        email: currentUser.email,
        photo: currentUser.photoURL,
        uid: currentUser.uid,
        emailVerified: currentUser.emailVerified,
        isAnonymous: currentUser.isAnonymous,
        createdAt: currentUser.metadata.creationTime,
        lastSignInAt: currentUser.metadata.lastSignInTime,
      });

      setIsAuth(true);
      navigate("/todo");
    } catch (e) {
      console.error(e);
    }
  };

  const signUpAnonymously = async () => {
    try {
      const result = await signInAnonymously(auth);

      const userRef = doc(db, "users", auth.currentUser.uid);

      const { currentUser } = auth;

      await setDoc(userRef, {
        uid: currentUser.uid,
        emailVerified: currentUser.emailVerified,
        isAnonymous: currentUser.isAnonymous,
        createdAt: currentUser.metadata.creationTime,
        lastSignInAt: currentUser.metadata.lastSignInTime,
      });

      setIsAuth(true);
      navigate("/todo");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="iDo logo" /> iDo
        </Link>

        <p>Sign up with Google or Email to save your todos across browsers</p>

        <Link onClick={signUpWithGoogle} className={styles.google}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          Sign up with Google
        </Link>

        <Link to="/signup" className={styles.email}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
          </svg>
          Sign up with Email
        </Link>

        <Link onClick={signUpAnonymously} className={styles.anonymous}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
          </svg>
          Sign in Anonymously
        </Link>

        <p>
          Already have an account?{" "}
          <Link to="/signin" className={styles["sign-in"]}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Home;
