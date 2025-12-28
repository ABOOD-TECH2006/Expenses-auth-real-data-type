/*
 * Copyright (c) 2025 abdallah(abood) shaalan
 * All rights reserved.
 * This file is for viewing purposes only.
 */
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  SxProps,
  Theme,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthController from "../../controllers/auth-controller";
import toast, { Toaster } from "react-hot-toast";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const oobCode = searchParams.get("oobCode");
  const auth = new AuthController();

  const handleReset = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!oobCode) {
      toast.error("Invalid or expired reset link");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await auth.confirmPasswordReset(oobCode, password);
    setLoading(false);

    if (res.status) {
      toast.success("Password successfully reset!");
      navigate("/login", { replace: true });
    } else {
      toast.error(res.message ?? "Something went wrong");
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <Box
        component="form"
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          overflow: "hidden",
          background:
            "radial-gradient(circle at top, #A855F7, #4F46E5 35%, #06B6D4 70%)",
        }}
      >
        <Paper
          sx={{
            width: { xs: "92%", sm: 420 },
            p: { xs: 3.5, sm: 5 },
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(22px)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))",
            boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <Typography variant="h4" fontWeight={800} mb={1} color="#fff">
            Reset Password
          </Typography>

          <Typography variant="body2" mb={4} color="#EDE9FE">
            Create a new secure password for your account
          </Typography>

          <Stack spacing={2.6}>
            <TextField
              fullWidth
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{ sx: inputStyles }}
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
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              InputProps={{ sx: inputStyles }}
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

            <Button
              fullWidth
              type="submit"
              disabled={loading}
              onClick={handleReset}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 800,
                color: "#fff",
                background: "linear-gradient(135deg, #EC4899, #F97316)",
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

// MUI input field styles
const inputStyles: SxProps<Theme> = {
  borderRadius: 3,
  backgroundColor: "rgba(255,255,255,0.18)",
  color: "#FFFFFF",
};

export default ResetPasswordPage;
