import { useState } from "react";
import { Link } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../config/firebase";
import styles from "./Verification.module.css";

const VerificationPage = () => {
  const [notify, setNotify] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      setNotify(true);
      setError("");
    } catch (e) {
      setError(
        e.code === "auth/too-many-requests"
          ? "Too many requests. Please try again later."
          : null
      );
      setNotify(false);
    }
  };

  return (
    <div className={styles.container}>
      <p>Email verification was sent check your inbox</p>
      <Link to="/signin">Sign in</Link>
      <p>Didn't get a verification?</p>
      <button onClick={handleResend}>Resend email verification</button>
      {notify && <p className={styles.notify}>Email verification sent!</p>}
      <p className={styles.error}>{error}</p>
    </div>
  );
};

export default VerificationPage;
