/*
 * Copyright (c) 2025 abdallah(abood) shaalan
 * All rights reserved.
 * This file is for viewing purposes only.
 */
import React from "react";
import { Stack, IconButton } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";
import { Google, GitHub, Facebook } from "@mui/icons-material";

const SocialIcons: React.FC = () => {
  const icons: SvgIconComponent[] = [Google, GitHub, Facebook];
  const colors = ["#DB4437", "#333333", "#1877F2"]; // Google, GitHub, Facebook

  return (
    <Stack direction="row" justifyContent="center" spacing={2} mb={3}>
      {icons.map((Icon, i) => (
        <IconButton
          key={i}
          sx={{
            transition: "all .35s ease",
            bgcolor: colors[i],
            boxShadow: 2,
            "&:hover": {
              boxShadow: 6,
              transform: "translateY(-3px)",
              bgcolor: `${colors[i]}90`, // slightly darker on hover
            },
          }}
        >
          <Icon sx={{ color: "#fff" }} />
        </IconButton>
      ))}
    </Stack>
  );
};

export default SocialIcons;
