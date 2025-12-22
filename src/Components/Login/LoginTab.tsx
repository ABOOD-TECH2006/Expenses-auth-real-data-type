import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthController from "../../controllers/auth-controller";
import { authActions } from "../../redux/slices/auth-slice";
import toast from "react-hot-toast";

// -----------------------------
// TypeScript interfaces
// -----------------------------
interface LoginFormInputs {
  email: string;
  password?: string;
}

const LoginTab: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<LoginFormInputs>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = new AuthController();

  const [forgot, setForgot] = useState(false);
  const [unverifiedToken, setUnverifiedToken] = useState<string | null>(null);

  // -----------------------------
  // Login submit handler
  // -----------------------------
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    if (!data.email || !data.password) return;

    const res = await auth.login(data.email, data.password);
    if (!res.status) return toast.error(res.message ?? "Something went wrong");

    const userRes = await auth.getUserData(res.token ?? "Something went wrong");
    if (!userRes.status) return toast.error("Failed to fetch user info");

    if (!userRes.user.emailVerified) {
      toast.error("Your email is not verified. Please verify your email.");
      // تحويل undefined إلى null لتجنب TypeScript error
      setUnverifiedToken(res.token ?? null);
      return;
    }

    // Update Redux + localStorage
    localStorage.setItem("token", res.token ?? "");
    localStorage.setItem("userId", userRes.user.localId);
    localStorage.setItem("emailVerified", "true");

    dispatch(
      authActions.login({
        token: res.token ?? "",
        userId: userRes.user.localId,
        emailVerified: true,
      })
    );

    toast.success("Welcome back");
    navigate("/", { replace: true });
  };

  // -----------------------------
  // Forgot password submit handler
  // -----------------------------
  const handleForgotPassword: SubmitHandler<LoginFormInputs> = async (data) => {
    if (!data.email) return;
    const res = await auth.sendPasswordResetEmail(data.email);
    if (!res.status) return toast.error(res.message ?? "Something went wrong");

    toast.success("Password reset email sent!");
    reset();
    setForgot(false);
  };

  // -----------------------------
  // Resend verification email
  // -----------------------------
  const handleResendVerification = async () => {
    if (!unverifiedToken) {
      toast.error("No token available for verification.");
      return;
    }

    try {
      const res = await auth.sendVerificationEmail(unverifiedToken);
      if (!res.status) throw new Error(res.message || "Failed to resend verification email");

      toast.success(
        "Verification email has been sent. If you don’t see it, please check your Spam."
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(forgot ? handleForgotPassword : onSubmit)}
    >
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Email"
          {...register("email", { required: true })}
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

        {!forgot && (
          <TextField
            fullWidth
            type="password"
            label="Password"
            {...register("password", { required: true, minLength: 6 })}
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
        )}

        <Button
          fullWidth
          size="large"
          type="submit"
          sx={{
            py: 1.5,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#fff",
            background: forgot
              ? "linear-gradient(135deg,#ff416c,#ff4b2b)"
              : "linear-gradient(135deg,#667eea,#764ba2)",
            boxShadow: "0 5px 20px rgba(102,126,234,0.5)",
            transition: "all 0.4s ease",
            "&:hover": {
              opacity: 0.95,
              transform: "translateY(-2px)",
              boxShadow: forgot
                ? "0 10px 30px rgba(255,75,43,0.6)"
                : "0 10px 30px rgba(102,126,234,0.6)",
            },
          }}
        >
          {forgot ? "Send Reset Email" : "Sign In"}
        </Button>

        {unverifiedToken && !forgot && (
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

        <Typography
          onClick={() => setForgot(!forgot)}
          sx={{
            color: "#ffeb3b",
            textAlign: "center",
            mt: 1,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
            fontWeight: 600,
          }}
        >
          {forgot ? "Back to Login" : "Forgot Password?"}
        </Typography>
      </Stack>
    </Box>
  );
};

export default LoginTab;
