import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import Cookies from "universal-cookie";
import Home from "./pages/Home/Home";
import SignInForm from "./pages/SignInForm/SignInForm";
import TodoForm from "./pages/TodoForm/TodoForm";
import Error from "./pages/Error/Error";
import Verification from "./pages/Verification/Verification";
import SignUpForm from "./pages/SignUpForm/SignUpForm";
import Loading from "./components/Loading/Loading";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if ((user && isAuth && user?.emailVerified) || user?.isAnonymous) {
        cookies.set("auth-token", user.refreshToken);
      } else {
        cookies.remove("auth-token");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, isAuth, user?.emailVerified]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home setIsAuth={setIsAuth} />} />

        <Route
          path="/signup"
          element={
            (user && isAuth && user?.emailVerified) || user?.isAnonymous ? (
              <Navigate to="/todo" />
            ) : (
              <SignUpForm />
            )
          }
        />

        <Route
          path="/signin"
          element={
            (user && isAuth && user?.emailVerified) || user?.isAnonymous ? (
              <Navigate to="/todo" />
            ) : (
              <SignInForm setIsAuth={setIsAuth} />
            )
          }
        />

        <Route
          path="/verification"
          element={
            user && !user?.emailVerified && !user?.isAnonymous ? (
              <Verification />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/todo"
          element={
            (user && isAuth && user?.emailVerified) || user?.isAnonymous ? (
              <TodoForm setIsAuth={setIsAuth} />
            ) : (
              <Loading />
            )
          }
        />

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
