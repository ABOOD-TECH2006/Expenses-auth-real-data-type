/*
 * Copyright (c) 2025 abdallah(abood) shaalan
 * All rights reserved.
 * This file is for viewing purposes only.
 */

import React from "react";
import { useLocation } from "react-router-dom";
import ResetPasswordPage from "./ResetPasswordPage";
import VerifyEmailPage from "./VerifyEmail";

const AuthActionPage: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const mode = params.get("mode");

  // Render page based on Firebase action mode
  if (mode === "resetPassword") {
    return <ResetPasswordPage />;
  }

  if (mode === "verifyEmail") {
    return <VerifyEmailPage />;
  }

  return <p>Invalid or unsupported action.</p>;
};

export default AuthActionPage;
