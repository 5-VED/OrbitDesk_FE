import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { layout } from "@/theme/tokens";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectSidebarCollapsed,
  toggleSidebar as toggleSidebarAction,
} from "@/store/slices/uiSlice";

export function AdminLayout() {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    dispatch(toggleSidebarAction());
  }, [dispatch]);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <AdminSidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />

      <AdminTopbar collapsed={collapsed} onToggleMobile={toggleMobile} />

      <Box
        component="main"
        className={`admin-main ${collapsed ? "expanded" : ""}`}
        sx={{
          // The permanent Drawer already reserves its width in this flex row,
          // so no margin-left offset is needed here.
          flexGrow: 1,
          minWidth: 0,
          minHeight: `calc(100vh - ${layout.navbarHeight}px)`,
          mt: `${layout.navbarHeight}px`,
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;
