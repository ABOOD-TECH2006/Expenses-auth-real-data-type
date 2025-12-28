/*
 * Copyright (c) 2025 abdallah(abood) shaalan
 * All rights reserved.
 * This file is for viewing purposes only.
 */

import React from "react";
import { Box, Button, Typography, keyframes } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  // Floating particle animation
  const float = keyframes`
    0% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
    100% { transform: translateY(0) rotate(360deg); }
  `;

  // Generate animated particles
  const particles = React.useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => {
        const size = Math.random() * 12 + 8;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 4 + Math.random() * 6;
        const color = `hsl(${Math.random() * 360}, 80%, 60%)`;

        return (
          <Box
            key={i}
            sx={{
              position: "absolute",
              bottom: "-50px",
              left: `${left}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: 0.7,
              animation: `${float} ${duration}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      }),
    [float]
  );

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #ff416c, #ff4b2b, #1e3c72, #6a11cb)",
        backgroundSize: "400% 400%",
        animation: `${keyframes`
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        `} 15s ease infinite`,
        color: "#fff",
        textAlign: "center",
        fontFamily: "Inter, Roboto, Poppins, sans-serif",
      }}
    >
      {particles}

      <Box zIndex={1} position="relative" p={3}>
        <Typography
          variant="h1"
          fontWeight={900}
          sx={{ fontSize: { xs: "8rem", md: "12rem" }, mb: 2 }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, letterSpacing: 2 }}>
          Oops! Page not found
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            px: 5,
            py: 1.5,
            fontWeight: 600,
            fontSize: "1.1rem",
            background: "linear-gradient(135deg,#43cea2,#185a9d)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            transition: "all 0.4s ease",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
              opacity: 0.95,
            },
          }}
        >
          Go Home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
