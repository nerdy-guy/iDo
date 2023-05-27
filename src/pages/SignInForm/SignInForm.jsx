import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import logo from "../../assets/logo.svg";
import styles from "./SignInForm.module.css";
import { toast } from "react-toastify";

const SignInForm = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkVerified, setCheckVerified] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (auth.currentUser.emailVerified) {
        const { currentUser } = auth;

        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          emailVerified: currentUser.emailVerified,
          lastSignInAt: currentUser.metadata.lastSignInTime,
        });

        setIsAuth(true);
        navigate("/todo");
      } else {
        setCheckVerified(true);
        setIsAuth(false);
        toast.error("Please verify your email address.");
        return;
      }
    } catch (e) {
      setCheckVerified(false);
      toast.error("Incorrect email or password.");
    }

    setPassword("");
  };

  const handleResend = async () => {
    try {
      await sendEmailVerification(auth.currentUser);

      toast.success("Email verification sent!");
    } catch (e) {
      toast.error(
        e.code === "auth/too-many-requests"
          ? "Too many requests. Please try again later."
          : "An error has occurred. Please try again later."
      );
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSignIn}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="iDo logo" /> iDo
        </Link>

        <div className={styles.email}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            className={styles.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoFocus
            required
          />
        </div>

        <div className={styles.password}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className={styles.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            minLength={8}
            required
          />
        </div>

        {checkVerified && (
          <span className={styles.resend} onClick={handleResend}>
            Resend email verification
          </span>
        )}

        <button type="submit" className={styles["sign-in"]}>
          Sign in
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/signup" className={styles["sign-up"]}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignInForm;
