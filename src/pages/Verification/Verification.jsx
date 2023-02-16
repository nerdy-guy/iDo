import { sendEmailVerification } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../../Firebase/firebase";
import styles from "./Verification.module.css";

const VerificationPage = () => {
  const handleResend = async () => {
    await sendEmailVerification(auth.currentUser);
  };

  return (
    <div className={styles.container}>
      <p>Email verification was sent check your inbox</p>
      <Link to="/signin">Sign in</Link>
      <p>Didn't get a verification?</p>
      <button onClick={handleResend}>Resend email verification</button>
    </div>
  );
};

export default VerificationPage;
