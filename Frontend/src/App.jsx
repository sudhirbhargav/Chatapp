import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Signin from "./Components/SignIn/Signin";
import Signup from "./Components/SignUp/Signup";
import { useEffect } from "react";
import { persistor } from "./redux/store";

function PrivateRoutes({ children }) {
  const isloggedin = localStorage.getItem("token") !== null;

  const location = useLocation();
  const pathname = location.pathname;

  if (!isloggedin) {
    return <Navigate to="/signin" replace />;
  } else if (isloggedin && ["/signin", "/signup"].includes(pathname)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    if (
      (token == null ||
        token == "null" ||
        token == undefined ||
        token == "undefined") &&
      location?.pathname !== "/auth/forgot/password" &&
      location?.pathname !== "/auth/resetpassword"
    ) {
      localStorage.clear();
      window.localStorage.removeItem("persist:root");
      persistor.pause();
      return navigate("/signin");
    } else if (token) {
      return navigate("/");
    }
  }, [Routes, Route, token]);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        }
      />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
