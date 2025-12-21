import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Button, CircularProgress, SxProps, Theme } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthController from "../../controllers/auth-controller";
import toast from "react-hot-toast";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = new AuthController();

  const [loading, setLoading] = useState<boolean>(true);
  const [verified, setVerified] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);

  // Ref to track if verification already happened
  const verifiedRef = useRef<boolean>(false);

  useEffect(() => {
    const mode: string | null = searchParams.get("mode");
    const oobCode: string | null = searchParams.get("oobCode");

    if (mode !== "verifyEmail" || !oobCode || verifiedRef.current) {
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      const res: { status: boolean; message?: string } = await auth.confirmEmailVerification(oobCode);

      if (!res.status) {
        toast.error("Email verification failed");
        setLoading(false);
        return;
      }

      toast.success("Email verified successfully");
      verifiedRef.current = true; // Mark as verified
      setVerified(true);
      setLoading(false);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate("/login", { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    verifyEmail();
  }, [searchParams, navigate, auth]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(135deg, #667eea, #764ba2, #43cea2)",
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 450,
          width: "100%",
          p: 4,
          borderRadius: 4,
          textAlign: "center",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          color: "#fff",
        }}
      >
        {loading && (
          <>
            <CircularProgress sx={{ color: "#ffeb3b", mb: 2 }} />
            <Typography fontWeight={600}>Verifying your email address...</Typography>
          </>
        )}

        {!loading && verified && (
          <>
            <CheckCircleIcon sx={{ fontSize: 90, color: "#ffeb3b", mb: 2 }} />
            <Typography variant="h4" fontWeight={700}>
              Email Verified
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Redirecting to login in {countdown} seconds.
            </Typography>
            <Button
              fullWidth
              onClick={() => navigate("/login", { replace: true })}
              sx={{ background: "#ffeb3b", color: "#000" }}
            >
              Go to Login
            </Button>
          </>
        )}

        {!loading && !verified && (
          <>
            <ErrorOutlineIcon sx={{ fontSize: 90, color: "#ff5252", mb: 2 }} />
            <Typography variant="h4" fontWeight={700}>
              Verification Failed
            </Typography>
            <Typography sx={{ mb: 3 }}>The link is invalid or expired.</Typography>
            <Button
              fullWidth
              onClick={() => navigate("/login", { replace: true })}
              sx={{ background: "#ff5252", color: "#fff" }}
            >
              Back to Login
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default VerifyEmail;
