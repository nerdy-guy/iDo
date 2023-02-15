import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Firebase/firebase";
import styles from "./SignInForm.module.css";
import logo from "../../assets/logo.svg";

const SignInForm = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checkVerified, setCheckVerified] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (auth.currentUser.emailVerified === false) {
        await signOut(auth);
        setCheckVerified(true);
        setError(false);
        return;
      }

      if (auth.currentUser.emailVerified) {
        setIsAuth(true);
        navigate("/todo");
      }
    } catch (e) {
      setError(true);
      setCheckVerified(false);
    }

    setPassword("");
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

        {error && (
          <span className={styles.error}>Incorrect email or password</span>
        )}

        {checkVerified && (
          <span className={styles.error}>Please verify your email</span>
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