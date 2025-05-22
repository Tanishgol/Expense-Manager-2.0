import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Default from "./Pages/default";
import Login from "./auth/login";
import Otpverify from "./auth/otpverify";
import EmailVerification from "./auth/emailverification";
import Register from "./auth/register";
import Error404 from "./Pages/error404";
import ResetPassword from "./auth/resetpassword";
import Dashboard from "./Pages/dashboard";
import Reports from "./Pages/reports";
import Settings from "./Pages/settings";
import Transactions from "./Pages/transactions";
import Budgets from "./Pages/budgets";
import Navbar from "./Components/main/navbar";
import Profile from "./Pages/profilepage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Default />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<Otpverify />} />
        <Route path="/email-verification" element={<EmailVerification />} />

        <Route
          path="/dashboard"
          element={
            <>
              <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/transactions"
          element={
            <>
              <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
              <Transactions />
            </>
          }
        />
        <Route
          path="/budgets"
          element={
            <>
              <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
              <Budgets className="flex-1 overflow-y-auto p-4 md:p-6" />
            </>
          }
        />
        <Route
          path="/reports"
          element={
            <>
              <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
              <Reports />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
              <Settings />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
              <Profile />
            </>
          }
        />

        <Route path="*" element={<Error404 />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;