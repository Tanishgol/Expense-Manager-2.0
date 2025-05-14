import React from "react";
import { Routes, Route } from "react-router-dom";
import Default from "./Pages/default";
import Login from "./auth/login";
import Otpverify from "./auth/otpverify";
import EmailVerification from "./auth/emailverification";
import Register from "./auth/register";
import Error404 from "./Pages/error404";
import ResetPassword from "./auth/resetpassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<Error404 />} />
        <Route path="/" element={<Default />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<Otpverify />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
