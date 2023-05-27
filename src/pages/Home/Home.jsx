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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M21.6 12.2272C21.6 11.5181 21.5364 10.8363 21.4182 10.1818H12V14.0499H17.3818C17.15 15.2999 16.4455 16.359 15.3864 17.0681V19.5772H18.6182C20.5091 17.8363 21.6 15.2727 21.6 12.2272Z"
              fill="#4285F4"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 21.9999C14.7 21.9999 16.9636 21.1044 18.6181 19.5772L15.3863 17.0681C14.4909 17.6681 13.3454 18.0226 12 18.0226C9.39542 18.0226 7.19087 16.2635 6.40451 13.8999H3.0636V16.4908C4.70905 19.759 8.09087 21.9999 12 21.9999Z"
              fill="#34A853"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.40455 13.9001C6.20455 13.3001 6.09091 12.6592 6.09091 12.0001C6.09091 11.341 6.20455 10.7001 6.40455 10.1001V7.50916H3.06364C2.38636 8.85916 2 10.3864 2 12.0001C2 13.6137 2.38636 15.141 3.06364 16.491L6.40455 13.9001Z"
              fill="#FBBC05"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 5.97727C13.4681 5.97727 14.7863 6.48182 15.8227 7.47273L18.6909 4.60455C16.9591 2.99091 14.6954 2 12 2C8.09087 2 4.70905 4.24091 3.0636 7.50909L6.40451 10.1C7.19087 7.73636 9.39542 5.97727 12 5.97727Z"
              fill="#EA4335"
            ></path>
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
