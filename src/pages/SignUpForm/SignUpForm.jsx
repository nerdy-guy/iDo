import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { toast } from "react-toastify";
import logo from "../../assets/logo.svg";
import styles from "./SignUpForm.module.css";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const signUpWithEmailAndPassword = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      const userRef = doc(db, "users", auth.currentUser.uid);

      const { currentUser } = auth;

      await setDoc(userRef, {
        displayName,
        email,
        uid: currentUser.uid,
        emailVerified: currentUser.emailVerified,
        isAnonymous: currentUser.isAnonymous,
        createdAt: currentUser.metadata.creationTime,
        lastSignInAt: currentUser.metadata.lastSignInTime,
      });

      await sendEmailVerification(auth.currentUser);

      toast.success("Email verification sent!");

      navigate("/signin");
    } catch (e) {
      toast.error(
        e.code === "auth/email-already-in-use"
          ? "This email is already in use"
          : "An error occurred. Please try again later."
      );
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
