import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import "./App.css";
import Auth from "./pages/Home/Home";
import { auth } from "./Firebase/firebase";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Protected from "./components/Protected/Protected";
import VerificationPage from "./components/verificationPage/VerificationPage";
import { onAuthStateChanged } from "firebase/auth";
import SignUp from "./pages/SignUpForm/SignUpForm";
import SignInForm from "./pages/SignInForm/SignInForm";
import TodoForm from "./pages/TodoForm/TodoForm";
import Error from "./pages/Error/Error";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [user, setUser] = useState(null);
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        cookies.set("auth-token", user.refreshToken);
      } else {
        cookies.remove("auth-token");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth setIsAuth={setIsAuth} />} />
          <Route
            path="/signup"
            element={
              isAuth ? (
                <Navigate to="/todo" />
              ) : (
                <SignUp setIsAuth={setIsAuth} setIsSignedUp={setIsSignedUp} />
              )
            }
          />
          <Route
            path="/signin"
            element={
              isAuth ? (
                <Navigate to="/todo" />
              ) : (
                <SignInForm setIsAuth={setIsAuth} />
              )
            }
          />
          {isSignedUp && (
            <Route path="/verification" element={<VerificationPage />} />
          )}
          (
          {user && (user.emailVerified || user.isAnonymous) && isAuth && (
            <Route
              path="/todo"
              element={
                <Protected isAuth={isAuth}>
                  <TodoForm setIsAuth={setIsAuth} />
                </Protected>
              }
            />
          )}
          )
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
