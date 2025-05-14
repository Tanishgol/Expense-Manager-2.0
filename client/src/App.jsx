import React from "react";
import { Routes, Route } from "react-router-dom";
import Default from "./Pages/default";
import Login from "./auth/login";
import Otpverify from "./auth/otpverify";
import Forgetpassword from "./auth/forgetpassword";
import Register from "./auth/register";
import Error404 from "./Pages/error404";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<Error404 />} />
        <Route path="/" element={<Default />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otpverify" element={<Otpverify />} />
        <Route path="/forgot-password" element={<Forgetpassword />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
