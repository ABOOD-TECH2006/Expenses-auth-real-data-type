import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks"; // typed Redux selector

import App from "../App";
import LoginPage from "../pages/Auth/LoginPage";
import VerifyEmailPage from "../pages/Auth/VerifyEmail";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import AuthActionPage from "../pages/Auth/AuthAction";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

const AppRoutes: React.FC = () => {
  // Get auth state from Redux
  const { loggedIn, emailVerified } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      {/* ================= ROOT ================= */}
      <Route
        path="/"
        element={
          loggedIn && emailVerified ? <App /> : <Navigate to="/login" replace />
        }
      />

      {/* ================= LOGIN ================= */}
      <Route
        path="/login"
        element={
          loggedIn && emailVerified ? <Navigate to="/" replace /> : <LoginPage />
        }
      />

      {/* ================= FIREBASE EMAIL ACTION ================= */}
      {/* This route is used for Firebase Email Action links */}
      <Route path="/auth/action" element={<AuthActionPage />} />

      {/* ================= OPTIONAL MANUAL PAGES ================= */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      <Route
        path="/reset-password"
        element={loggedIn ? <Navigate to="/" replace /> : <ResetPasswordPage />}
      />

      {/* ================= 404 PAGE ================= */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
