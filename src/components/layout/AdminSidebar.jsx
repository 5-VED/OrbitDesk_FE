import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, alpha } from "@mui/material/styles";
import {
  LayoutDashboard,
  Users,
  Shield,
  Building2,
  UsersRound,
  Clock,
  Bell,
  Settings,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Activity,
  KeyRound,
} from "lucide-react";
import { layout } from "@/theme/tokens";

const adminNavSections = [
  {
    title: "Overview",
    items: [
      { path: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
      { path: "/admin/audit-log", icon: ScrollText, label: "Audit Log" },
    ],
  },
  {
    title: "People",
    items: [
      { path: "/admin/users", icon: Users, label: "Users & Agents" },
      { path: "/admin/roles", icon: Shield, label: "Roles & Permissions" },
    ],
  },
  {
    title: "Structure",
    items: [
      { path: "/admin/organizations", icon: Building2, label: "Organizations" },
      { path: "/admin/groups", icon: UsersRound, label: "Groups" },
    ],
  },
  {
    title: "Policies",
    items: [
      { path: "/admin/sla-policies", icon: Clock, label: "SLA Policies" },
      { path: "/admin/notifications", icon: Bell, label: "Notifications" },
    ],
  },
  {
    title: "System",
    items: [
      { path: "/admin/settings", icon: Settings, label: "System Settings" },
      { path: "/admin/api-keys", icon: KeyRound, label: "API Keys" },
      { path: "/admin/system-health", icon: Activity, label: "System Health" },
    ],
  },
];

export function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(layout.mobileQuery);

  const handleNavClick = () => {
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
  };

  const drawerWidth =
    collapsed && !isMobile ? layout.sidebarCollapsedWidth : layout.sidebarWidth;

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed && !isMobile ? "center" : "space-between",
          px: 2,
          height: layout.navbarHeight,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {!collapsed || isMobile ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                backgroundColor: "warning.main",
                color: "#1A1D23",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.125rem",
              }}
            >
              A
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.125rem",
                color: "text.primary",
              }}
            >
              Admin Panel
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              backgroundColor: "warning.main",
              color: "#1A1D23",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "1.125rem",
            }}
          >
            A
          </Box>
        )}
      </Box>

      {/* Back to App */}
      <Box sx={{ p: 1, borderBottom: 1, borderColor: "divider" }}>
        <Tooltip
          title={collapsed && !isMobile ? "Back to App" : ""}
          placement="right"
        >
          <ListItemButton
            onClick={() => {
              navigate("/");
              handleNavClick();
            }}
            sx={{
              minHeight: 38,
              px: collapsed && !isMobile ? 1.5 : 2,
              justifyContent: collapsed && !isMobile ? "center" : "initial",
              borderRadius: 1.5,
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "background.hover",
                color: "text.primary",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed && !isMobile ? "auto" : 1.5,
                justifyContent: "center",
                color: "inherit",
              }}
            >
              <ArrowLeft size={18} />
            </ListItemIcon>
            {(!collapsed || isMobile) && (
              <ListItemText
                primary="Back to App"
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>

      {/* Nav Sections */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        {adminNavSections.map((section) => (
          <List
            key={section.title}
            sx={{ px: 1, py: 0.5 }}
            subheader={
              !collapsed || isMobile ? (
                <ListSubheader
                  sx={{
                    lineHeight: "28px",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    backgroundColor: "transparent",
                    color: "text.tertiary",
                    px: 1.5,
                  }}
                >
                  {section.title}
                </ListSubheader>
              ) : null
            }
          >
            {section.items.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                <Tooltip
                  title={collapsed && !isMobile ? item.label : ""}
                  placement="right"
                >
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    end={item.end}
                    onClick={handleNavClick}
                    sx={{
                      minHeight: 38,
                      px: collapsed && !isMobile ? 1.5 : 2,
                      justifyContent:
                        collapsed && !isMobile ? "center" : "initial",
                      borderRadius: 1.5,
                      color: "text.secondary",
                      "&.active": {
                        backgroundColor: alpha(
                          theme.palette.warning.main,
                          0.15,
                        ),
                        color: "warning.main",
                        fontWeight: 600,
                        "& .MuiListItemIcon-root": {
                          color: "warning.main",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "background.hover",
                        color: "text.primary",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: collapsed && !isMobile ? "auto" : 2,
                        justifyContent: "center",
                        color: "inherit",
                      }}
                    >
                      <item.icon size={18} />
                    </ListItemIcon>
                    {(!collapsed || isMobile) && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        ))}
      </Box>

      {/* Collapse button */}
      {!isMobile && (
        <Box sx={{ borderTop: 1, borderColor: "divider", p: 1 }}>
          <ListItemButton
            onClick={onToggle}
            sx={{
              minHeight: 38,
              px: collapsed ? 1.5 : 2,
              justifyContent: collapsed ? "center" : "initial",
              borderRadius: 1.5,
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "background.hover",
                color: "text.primary",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? "auto" : 2,
                justifyContent: "center",
                color: "inherit",
              }}
            >
              {collapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Collapse"
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            )}
          </ListItemButton>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: layout.sidebarWidth,
            boxSizing: "border-box",
            backgroundColor: "background.paper",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "background.paper",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default AdminSidebar;
