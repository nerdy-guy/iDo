import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import "./App.css";
import TodoForm from "./components/TodoForm/TodoForm";
import Auth from "./Firebase/Auth/Auth";
import { auth } from "./Firebase/firebase";
import Navbar from "./components/Navbar/Navbar";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

      if (user) {
        cookies.set(
          "auth-token",
          user.isAnonymous === true ? crypto.randomUUID() : user.refreshToken
        );
      } else {
        cookies.remove("auth-token");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return !isAuth ? (
    <div>
      <Auth setIsAuth={setIsAuth} cookies={cookies} />
    </div>
  ) : (
    <>
      {auth.currentUser && (
        <div>
          <Navbar setIsAuth={setIsAuth} cookies={cookies} isAuth={isAuth} />

          <TodoForm />
        </div>
      )}
    </>
  );
}

export default App;
