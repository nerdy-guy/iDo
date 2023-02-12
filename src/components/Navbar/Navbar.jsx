import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../Firebase/firebase";

const Navbar = ({ setIsAuth }) => {
  const signUserOut = async () => {
    try {
      await signOut(auth);
      setIsAuth(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <img
        src={
          auth.currentUser.photoURL
            ? auth.currentUser.photoURL
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
        }
        alt="Profile Picture"
        // TODO: Change witdh from css
        width={40}
      />
      <button onClick={signUserOut}>Sign out</button>
      <h1>iDo</h1>
    </div>
  );
};

export default Navbar;
