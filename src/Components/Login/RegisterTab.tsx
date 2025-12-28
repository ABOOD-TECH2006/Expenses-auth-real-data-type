/*
 * Copyright (c) 2025 abdallah(abood) shaalan
 * All rights reserved.
 * This file is for viewing purposes only.
 */
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Stack, Alert } from "@mui/material";
import AuthController from "../../controllers/auth-controller";
import toast from "react-hot-toast";
import SocialIcons from "./SocialIcons";

// -----------------------------
// TypeScript interfaces
// -----------------------------
interface RegisterFormInputs {
  email: string;
  password: string;
  confirm: string;
}

// Password strength check function
const checkPasswordStrength = (password: string): number => {
  const lengthCriteria = password.length >= 8;
  const numberCriteria = /[0-9]/.test(password);
  const uppercaseCriteria = /[A-Z]/.test(password);
  const lowercaseCriteria = /[a-z]/.test(password);
  const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;
  if (lengthCriteria) score++;
  if (numberCriteria) score++;
  if (uppercaseCriteria) score++;
  if (lowercaseCriteria) score++;
  if (specialCharCriteria) score++;

  return score;
};

const RegisterTab: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const password = watch("password");
  const auth = new AuthController();

  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  // -----------------------------
  // Submit handler
  // -----------------------------
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (data.password !== data.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await auth.register(data.email, data.password);
    if (!res.status) return toast.error(res.message);

    setVerificationToken(res.token);
    setVerificationSent(true);
    toast.success(
  "Verification email has been sent. If you don’t see it, please check your Spam."
);

    reset();
  };

  const handleResendVerification = async () => {
    if (!verificationToken) return;
    const res = await auth.sendVerificationEmail(verificationToken);
    if (!res.status) return toast.error("Failed to resend verification email");

    toast.success("Verification email resent successfully.");
  };

  // -----------------------------
  // Password strength colors & labels
  // -----------------------------
  const strengthColors = ["#ff4b5c", "#ff6f61", "#ffb400", "#a3d900", "#00c853"];
  const strengthLabels = ["Very Weak", "Weak", "Average", "Strong", "Very Strong"];

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {/* <SocialIcons /> */}

        {verificationSent && (
          <Alert severity="info">
            We have sent a verification email to your address.
            <br />
            Please verify your account before logging in.
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          {...register("email", { required: "Email is required" })}
          InputLabelProps={{ style: { color: "#fff" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "#fff",
              "& fieldset": { borderColor: "rgba(255,255,255,0.4)" },
              "&:hover fieldset": { borderColor: "#fff" },
              "&.Mui-focused fieldset": {
                borderColor: "#ffeb3b",
                boxShadow: "0 0 8px #ffeb3b",
              },
            },
            input: { color: "#fff" },
          }}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters long" },
          })}
          InputLabelProps={{ style: { color: "#fff" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "#fff",
              "& fieldset": { borderColor: "rgba(255,255,255,0.4)" },
              "&:hover fieldset": { borderColor: "#fff" },
              "&.Mui-focused fieldset": {
                borderColor: "#ffeb3b",
                boxShadow: "0 0 8px #ffeb3b",
              },
            },
            input: { color: "#fff" },
          }}
        />

        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          {...register("confirm", {
            required: "Please confirm your password",
            validate: (v) => v === password || "Passwords do not match",
          })}
          InputLabelProps={{ style: { color: "#fff" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "#fff",
              "& fieldset": { borderColor: "rgba(255,255,255,0.4)" },
              "&:hover fieldset": { borderColor: "#fff" },
              "&.Mui-focused fieldset": {
                borderColor: "#ffeb3b",
                boxShadow: "0 0 8px #ffeb3b",
              },
            },
            input: { color: "#fff" },
          }}
        />

        {errors.confirm && (
          <Alert severity="error" sx={{ fontSize: 12 }}>
            {errors.confirm.message}
          </Alert>
        )}

        {/* Password strength bar */}
        <Box sx={{ mt: 1 }}>
          <Box
            sx={{
              height: 12,
              width: "100%",
              borderRadius: 6,
              backgroundColor: "rgba(255,255,255,0.2)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${(passwordStrength / 5) * 100}%`,
                background: strengthColors[passwordStrength - 1] || "transparent",
                transition: "width 0.3s ease",
              }}
            />
          </Box>
          {password && (
            <Box sx={{ mt: 0.5, textAlign: "center", fontSize: 12, color: "#fff" }}>
              {strengthLabels[passwordStrength - 1] || "Too Weak"}
            </Box>
          )}
        </Box>

        <Button
          fullWidth
          size="large"
          type="submit"
          disabled={verificationSent}
          sx={{
            py: 1.5,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#fff",
            background: "linear-gradient(135deg,#43cea2,#185a9d)",
            boxShadow: "0 5px 20px rgba(67,206,162,0.5)",
            transition: "all 0.4s ease",
            "&:hover": {
              opacity: 0.95,
              transform: "translateY(-2px)",
              boxShadow: "0 10px 30px rgba(67,206,162,0.6)",
            },
          }}
        >
          {verificationSent
            ? "Waiting for Email Verification..."
            : "Create Account"}
        </Button>

        {verificationSent && (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleResendVerification}
            sx={{
              color: "#ffeb3b",
              borderColor: "#ffeb3b",
              "&:hover": { borderColor: "#fff", color: "#fff" },
            }}
          >
            Resend Verification Email
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default RegisterTab;
