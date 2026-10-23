import React, { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { layout } from "@/theme/tokens";

export function PageContainer({ children, title, actions, maxWidth = false }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const toggleSidebar = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const sidebarWidth = collapsed
    ? layout.sidebarCollapsedWidth
    : layout.sidebarWidth;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />

      {/* Frozen TopNavbar - internally handles notification polling and badge */}
      <TopNavbar collapsed={collapsed} onToggleMobile={toggleMobile} />

      <Box
        component="main"
        className={`page-main ${collapsed ? "expanded" : ""}`}
        sx={{
          flexGrow: 1,
          minHeight: `calc(100vh - ${layout.navbarHeight}px)`,
          mt: `${layout.navbarHeight}px`,
          ml: {
            xs: 0,
            md: `${sidebarWidth}px`,
          },
          transition: theme.transitions.create(["margin-left", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          width: {
            xs: "100%",
            md: `calc(100% - ${sidebarWidth}px)`,
          },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {(title || actions) && (
          <Box
            className="page-header"
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 1 },
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2, sm: 2.5 },
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            {title && (
              <Typography
                component="h1"
                variant="h4"
                className="page-title"
                sx={{
                  fontFamily: "font.heading",
                  fontWeight: 600,
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  color: "text.primary",
                  m: 0,
                }}
              >
                {title}
              </Typography>
            )}
            {actions && (
              <Box
                className="page-actions"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1.5,
                }}
              >
                {actions}
              </Box>
            )}
          </Box>
        )}

        <Box
          className="page-content"
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            flexGrow: 1,
            maxWidth: maxWidth || "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default PageContainer;
