import { signOut } from "firebase/auth";
import React from "react";
import Cookies from "universal-cookie";
import { auth } from "../../Firebase/firebase";

const Navbar = ({ setIsAuth, cookies, isAuth }) => {
  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
  };

  return (
    <div>
      <img
        src={auth.currentUser.photoURL}
        // TODO: Change witdh from css
        width={40}
      />
      <button onClick={signUserOut}>Sign out</button>
      <h1>iDo</h1>
    </div>
  );
};

export default Navbar;
