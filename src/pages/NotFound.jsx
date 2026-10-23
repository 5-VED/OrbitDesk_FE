import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button as MuiButton,
  Chip,
  Stack,
} from "@mui/material";
import {
  Home,
  ArrowLeft,
  LayoutDashboard,
  Ticket,
  Users,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

export function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  const quickLinks = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Tickets", to: "/tickets", icon: Ticket },
    { label: "Agents", to: "/agents", icon: Users },
    { label: "Knowledge Base", to: "/knowledge-base", icon: BookOpen },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 4 },
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background ambient glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 300, sm: 600 },
          height: { xs: 300, sm: 600 },
          borderRadius: "50%",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(244,67,54,0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(244,67,54,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 6 },
          maxWidth: 580,
          width: "100%",
          textAlign: "center",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* 404 Header */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "5rem", sm: "7rem" },
            lineHeight: 1,
            background: "linear-gradient(135deg, #F44336 0%, #ff8a80 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-2px",
          }}
        >
          404
        </Typography>

        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            bgcolor: "primary.light",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            my: 2,
          }}
        >
          <AlertTriangle size={26} />
        </Box>

        <Typography variant="h5" fontWeight={700} gutterBottom>
          Page Not Found
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2.5, px: { xs: 1, sm: 4 } }}
        >
          The page you're looking for doesn't exist or has been moved.
          Double-check the URL or navigate back to a known page.
        </Typography>

        {/* Path indicator */}
        <Chip
          icon={<AlertTriangle size={14} />}
          label={location.pathname}
          size="small"
          variant="outlined"
          color="warning"
          sx={{ mb: 3, maxWidth: "100%", overflow: "hidden" }}
        />

        {/* Main Action Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          <MuiButton
            id="nf-go-back-btn"
            variant="outlined"
            color="inherit"
            onClick={() => navigate(-1)}
            startIcon={<ArrowLeft size={16} />}
            sx={{ textTransform: "none", px: 3 }}
          >
            Go Back
          </MuiButton>
          <MuiButton
            id="nf-home-btn"
            component={RouterLink}
            to="/dashboard"
            variant="contained"
            color="primary"
            startIcon={<Home size={16} />}
            sx={{ textTransform: "none", px: 3 }}
          >
            Back to Dashboard
          </MuiButton>
        </Stack>

        {/* Quick Navigation Chips */}
        <Box sx={{ pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            display="block"
            sx={{
              mb: 1.5,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Quick Navigation
          </Typography>
          {quickLinks.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Chip
                key={link.to}
                component={RouterLink}
                to={link.to}
                clickable
                icon={<LinkIcon size={14} />}
                label={link.label}
                size="small"
                variant="outlined"
                sx={{
                  textDecoration: "none",
                  borderRadius: 1.5,
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "primary.light",
                  },
                }}
              />
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
}
