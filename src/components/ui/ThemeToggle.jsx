import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Sun, Moon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleTheme, selectTheme } from "../../store/slices/themeSlice";

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  const handleToggle = () => dispatch(toggleTheme());
  const label = `Switch to ${theme === "light" ? "dark" : "light"} mode`;

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={handleToggle}
        aria-label={label}
        size="medium"
        sx={{
          width: 38,
          height: 38,
          color: "text.secondary",
          borderRadius: 1.5,
          border: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
          "&:hover": {
            backgroundColor: "background.hover",
            color: "text.primary",
            borderColor: "divider",
          },
        }}
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
