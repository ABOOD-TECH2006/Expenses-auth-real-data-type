import React from "react";
import { Box, Typography, Skeleton, useTheme } from "@mui/material";

interface FooterProps {
  loading?: boolean;
}

const Footer: React.FC<FooterProps> = ({ loading = false }) => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        fontSize:"25px",
        mt: "auto",
        px: { xs: 2, sm: 4 },
        py: 3,
        position: "relative",

        /* Background */
        backgroundColor:
          theme.palette.mode === "dark" ? "#0B0F14" : "#FFFFFF",

        /* Top accent border */
        borderTop: "1px solid rgba(135,206,235,0.4)",

        /* Subtle elevation */
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 -8px 40px rgba(0,0,0,0.6)"
            : "0 -8px 40px rgba(0,0,0,0.08)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 0.75,
      }}
    >
      {/* Brand */}
      {loading ? (
        <Skeleton width={90} height={26} />
      ) : (
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            letterSpacing: "0.6px",
            background:
              "linear-gradient(90deg, #000000, #5DADE2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          TrackIt
        </Typography>
      )}

      {/* Meta */}
      {loading ? (
        <Skeleton width={300} height={16} />
      ) : (
        <Typography
          variant="caption"
          sx={{
            letterSpacing: "0.4px",
            color:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.7)"
                : "#4F4F4F",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} · Developed by{" "}
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              color: "#5DADE2", // SKY BLUE ACCENT
            }}
          >
            ABDALLAH (ABOOD) SHAALAN
          </Box>
        </Typography>
      )}
    </Box>
  );
};

export default Footer;
