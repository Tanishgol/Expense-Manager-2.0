import { useState } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import PageTop from "./Components/main/pagetop";
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
import Profile from "./Pages/profilepage";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from "./Components/main/AppLayout";

function App() {
  const location = useLocation();
  const getInitialTab = () => {
    const tab = location.pathname.split('/')[1];
    const validTabs = ['dashboard', 'transactions', 'budgets', 'reports', 'settings', 'profile'];
    return validTabs.includes(tab) ? tab : 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-center" />
        <PageTop />

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
              <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/transactions"
            element={
              <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Transactions />
              </AppLayout>
            }
          />
          <Route
            path="/budgets"
            element={
              <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Budgets />
              </AppLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Reports />
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Settings />
              </AppLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <AppLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Profile />
              </AppLayout>
            }
          />

          <Route path="*" element={<Error404 />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;