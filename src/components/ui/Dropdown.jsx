import React, { useState, useRef } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";

export function Dropdown({
  trigger,
  items = [],
  value,
  onChange,
  align = "start",
  className = "",
  sx = {},
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const triggerRef = useRef(null);

  const flatItems = items.reduce((acc, group) => {
    if (group.items) {
      return [...acc, ...group.items];
    }
    return [...acc, group];
  }, []);

  const selectedItem = flatItems.find((item) => item.value === value);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (item) => {
    if (item.disabled) return;
    onChange?.(item.value);
    handleClose();
  };

  return (
    <Box
      className={`dropdown-container ${className}`}
      sx={{ display: "inline-block", ...sx }}
    >
      <Box
        ref={triggerRef}
        onClick={handleOpen}
        sx={{ cursor: "pointer", display: "inline-flex" }}
      >
        {trigger(selectedItem)}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: align === "end" ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: align === "end" ? "right" : "left",
        }}
        PaperProps={{
          sx: {
            minWidth: 180,
            maxHeight: 320,
            borderRadius: 2,
            boxShadow: 4,
          },
        }}
      >
        {items.map((group, gi) => {
          if (group.items) {
            return (
              <Box key={group.label || gi}>
                {group.label && (
                  <ListSubheader
                    sx={{
                      lineHeight: "32px",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      backgroundColor: "transparent",
                      color: "text.tertiary",
                    }}
                  >
                    {group.label}
                  </ListSubheader>
                )}
                {group.items.map((item) => {
                  const isSelected = item.value === value;
                  return (
                    <MenuItem
                      key={item.value}
                      selected={isSelected}
                      disabled={item.disabled}
                      onClick={() => handleItemClick(item)}
                      sx={{
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1.5,
                        color: item.destructive ? "error.main" : "text.primary",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {item.dotColor && (
                          <Box
                            component="span"
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: item.dotColor,
                            }}
                          />
                        )}
                        <span>{item.label}</span>
                      </Box>
                      {isSelected && (
                        <CheckIcon
                          sx={{ fontSize: 16, color: "primary.main" }}
                        />
                      )}
                    </MenuItem>
                  );
                })}
              </Box>
            );
          }

          const isSelected = group.value === value;
          return (
            <Box key={group.value || gi}>
              {group.divider && <Divider sx={{ my: 0.5 }} />}
              <MenuItem
                selected={isSelected}
                disabled={group.disabled}
                onClick={() => handleItemClick(group)}
                sx={{
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                  color: group.destructive ? "error.main" : "text.primary",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {group.dotColor && (
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: group.dotColor,
                      }}
                    />
                  )}
                  <span>{group.label}</span>
                </Box>
                {isSelected && (
                  <CheckIcon sx={{ fontSize: 16, color: "primary.main" }} />
                )}
              </MenuItem>
            </Box>
          );
        })}
      </Menu>
    </Box>
  );
}

export default Dropdown;
