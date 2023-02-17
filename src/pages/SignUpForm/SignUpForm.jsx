import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import logo from "../../assets/logo.svg";
import styles from "./SignUpForm.module.css";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const signUpWithEmailAndPassword = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, {
        displayName,
        email,
        password,
      });

      await sendEmailVerification(auth.currentUser);

      navigate("/verification");
    } catch (e) {
      setError(
        e.code === "auth/email-already-in-use"
          ? "This email is already in use"
          : "An error occurred. Please try again later."
      );
      console.error(e);
      setPassword("");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={signUpWithEmailAndPassword}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="iDo logo" /> iDo
        </Link>

        <div className={styles["display-name"]}>
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            name="displayName"
            id="displayName"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoFocus
            required
          />
        </div>
        <div className={styles.email}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.password}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        <span className={styles.error}>{error}</span>
        <button className={styles["sign-up"]} type="submit">
          Sign Up
        </button>
        <p>
          Already have an account?{" "}
          <Link to="/signin" className={styles["sign-in"]}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
