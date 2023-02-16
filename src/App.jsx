import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/firebase";
import Cookies from "universal-cookie";
import Home from "./pages/Home/Home";
import Protected from "./components/Protected/Protected";
import SignInForm from "./pages/SignInForm/SignInForm";
import TodoForm from "./pages/TodoForm/TodoForm";
import Error from "./pages/Error/Error";
import Verification from "./pages/Verification/Verification";
import SignUpForm from "./pages/SignUpForm/SignUpForm";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [user, setUser] = useState(null);
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        console.log(user);
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
          <Route path="/" element={<Home setIsAuth={setIsAuth} />} />
          <Route
            path="/signup"
            element={
              <SignUpForm setIsAuth={setIsAuth} setIsSignedUp={setIsSignedUp} />
            }
          />
          <Route
            path="/signin"
            element={<SignInForm setIsAuth={setIsAuth} />}
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

          {/* {user && isAuth && (user.emailVerified || user.isAnonymous) && (
            <Route
              path="/todo"
              element={
                <Protected isAuth={isAuth}>
                  <TodoForm setIsAuth={setIsAuth} />
                </Protected>
              }
            />
          )} */}

          {user && (
            <Route
              path="/todo"
              element={
                // <Protected isAuth={isAuth}>
                <TodoForm setIsAuth={setIsAuth} />
                // </Protected>
              }
            />
          )}

          {/* <Route path="*" element={<Error />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
