import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ReferralEarning from "./pages/ReferralEarning";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";

// Move the redirection logic to a custom hook to avoid issues with hook usage outside of Router
function ReferralRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to signup if referral link is detected
    if (location.pathname.startsWith("/referral/")) {
      const referralAddress = location.pathname.split("/")[2];
      navigate("/register", { state: { referralAddress } });
    }
  }, [location, navigate]);

  return null;
}

function App() {
  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <p className="font-bold text-white text-2xl text-center">Our website is currently under maintenance...</p>
    </div>
    // <Provider store={store}>
    //   <PersistGate loading={null} persistor={persistor}>
    //     <Router>
    //       {/* Toast container */}
    //       <ToastContainer
    //         position="top-center"
    //         autoClose={3000}
    //         theme="dark"
    //         newestOnTop={true}
    //         pauseOnFocusLoss
    //         toastClassName="custom-toast"
    //       />
          
    //       {/* Referral redirection logic */}
    //       <ReferralRedirect />

    //       {/* App routes */}
    //       <Routes>
    //         <Route path="/" element={<Login />} />
    //         <Route path="/register" element={<Register />} />
    //         <Route path="/home" element={<Home />} />
    //         <Route path="/referralearning" element={<ReferralEarning />} />
    //       </Routes>
    //     </Router>
    //   </PersistGate>
    // </Provider>
  );
}

export default App;
