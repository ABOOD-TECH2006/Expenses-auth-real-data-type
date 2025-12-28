/*
 * Copyright (c) 2025 abdallah(abood) shaalan
 * All rights reserved.
 * This file is for viewing purposes only.
 */
import React, { useState } from "react";
import { Box, Paper, Tabs, Tab, Typography, keyframes } from "@mui/material";
import LoginTab from "../../Components/Login/LoginTab";
import RegisterTab from "../../Components/Login/RegisterTab";
import { Toaster } from "react-hot-toast";

const LoginPage: React.FC = () => {
  const [tab, setTab] = useState<number>(0);

  // Animated gradient background
  const gradientAnimation = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  // Floating bubbles animation
  const rise = keyframes`
    0% { transform: translateY(0) scale(1); opacity: 0.3; }
    50% { opacity: 0.7; }
    100% { transform: translateY(-120vh) scale(1.4); opacity: 0; }
  `;

  // Generate floating bubbles
  const bubbles = React.useMemo(
    () =>
      Array.from({ length: 25 }).map((_, i) => {
        const size = Math.random() * 60 + 20;
        const left = Math.random() * 100;
        const delay = Math.random() * 12;
        const duration = 10 + Math.random() * 10;
        const opacity = 0.2 + Math.random() * 0.5;

        return (
          <Box
            key={i}
            sx={{
              position: "absolute",
              bottom: "-100px",
              left: `${left}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: `rgba(255,255,255,${opacity})`,
              boxShadow: `0 0 ${Math.random() * 15 + 10}px rgba(255,255,255,0.6)`,
              animation: `${rise} ${duration}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      }),
    [rise]
  );

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(120deg, #1e3c72, #2a5298, #6a11cb, #ff416c, #00f5d4)",
        backgroundSize: "400% 400%",
        animation: `${gradientAnimation} 25s ease infinite`,
        fontFamily: "Inter, Roboto, Poppins, sans-serif",
      }}
    >
      {/* Floating bubbles */}
      {bubbles}

      {/* Toaster */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Login/Register Card */}
      <Paper
        elevation={20}
        sx={{
          width: 480,
          maxWidth: "90%",
          p: 5,
          borderRadius: 6,
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255,255,255,0.1)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.25)",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={800}
          mb={2}
          sx={{
            color: "white",
            textShadow:
              "0 2px 8px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)",
            letterSpacing: 1,
          }}
        >
          Expenses Manager
        </Typography>
        <Typography
          variant="subtitle1"
          color="#f0f0f0"
          mb={4}
          sx={{
            textShadow: "0 1px 5px rgba(0,0,0,0.3)",
            letterSpacing: 0.5,
          }}
        >
          Track your expenses in real-time with style and simplicity
        </Typography>

        <Tabs
          value={tab}
          onChange={(_, v: number) => setTab(v)}
          centered
          sx={{
            "& .MuiTabs-indicator": {
              background:
                "linear-gradient(135deg, #ff416c, #ff4b2b, #ffeb3b, #00f5d4)",
              height: 5,
              borderRadius: 3,
            },
            "& .MuiTab-root": {
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "1rem",
              transition: "all 0.3s",
              "&:hover": { color: "#00f5d4", transform: "scale(1.05)" },
            },
            "& .Mui-selected": { color: "#ffeb3b", fontSize: "1.05rem" },
          }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Box mt={4}>{tab === 0 ? <LoginTab /> : <RegisterTab />}</Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
