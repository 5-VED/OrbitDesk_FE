import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button as MuiButton,
  LinearProgress,
  CircularProgress,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Users,
  Ticket,
  Building2,
  UsersRound,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Eye,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { dashboardService } from "@/services/dashboard.service";
import { useNavigate } from "react-router-dom";

const iconMap = {
  Users,
  Ticket,
  Building2,
  UsersRound,
};

const getAuditEventIcon = (type) => {
  switch (type) {
    case "policy":
      return Clock;
    case "automation":
      return Activity;
    case "user":
      return Users;
    case "security":
      return Shield;
    default:
      return Activity;
  }
};

function formatTimeAgo(date) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [slaData, setSlaData] = useState([]);
  const [agents, setAgents] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, slaRes, agentsRes, auditRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getSlaOverview(),
          dashboardService.getTopAgents(),
          dashboardService.getRecentActivity(),
        ]);

        const mappedStats = (statsRes?.data?.systemStats || []).map((s) => ({
          ...s,
          icon: iconMap[s.icon] || Users,
          change: s.change || "—",
          trend: s.trend || "neutral",
        }));
        setStats(mappedStats);

        setSlaData(slaRes?.data || []);
        setAgents(agentsRes?.data || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          gap: 2,
        }}
      >
        <CircularProgress size={36} color="primary" />
        <Typography color="text.secondary">Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            System overview and health monitoring
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <MuiButton
            variant="outlined"
            color="inherit"
            startIcon={<BarChart3 size={16} />}
            onClick={() => navigate("/reports")}
            sx={{ textTransform: "none" }}
          >
            View Reports
          </MuiButton>
          <MuiButton
            variant="outlined"
            color="inherit"
            startIcon={<Eye size={16} />}
            onClick={() => navigate("/admin/audit-log")}
            sx={{ textTransform: "none" }}
          >
            Audit Log
          </MuiButton>
        </Stack>
      </Box>

      {/* Quick Stats Grid */}
      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 2,
                transition: "all 0.2s",
                "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.light",
                    color: "primary.main",
                  }}
                >
                  <stat.icon size={22} />
                </Box>
                {stat.trend !== "neutral" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color:
                        stat.trend === "up" ? "success.main" : "error.main",
                      bgcolor:
                        stat.trend === "up"
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(239, 68, 68, 0.1)",
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                    }}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {stat.change}
                  </Box>
                )}
              </Box>
              <Typography variant="h4" fontWeight={800}>
                {stat.value}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                {stat.label}
              </Typography>
              {stat.subtitle && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5, opacity: 0.8 }}
                >
                  {stat.subtitle}
                </Typography>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Cards Grid */}
      <Grid container spacing={3}>
        {/* SLA Compliance Overview */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card variant="outlined" sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
                SLA Compliance Overview
              </Typography>
              <Stack spacing={2.5}>
                {slaData.map((item) => {
                  const isGood = item.inverted
                    ? item.value <= item.target
                    : item.value >= item.target;
                  return (
                    <Box key={item.label}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.75,
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {item.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color={isGood ? "success.main" : "warning.main"}
                        >
                          {item.value}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(item.value, 100)}
                        color={isGood ? "success" : "warning"}
                        sx={{ height: 8, borderRadius: 4, mb: 0.75 }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Target: {item.inverted ? "≤" : "≥"}
                          {item.target}%
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: isGood ? "success.main" : "warning.main",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {isGood ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <AlertTriangle size={12} />
                          )}
                          {isGood ? "Meeting target" : "Below target"}
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card variant="outlined" sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <Stack spacing={2}>
                {auditEvents.map((event) => {
                  const IconComponent = getAuditEventIcon(event.type);
                  return (
                    <Paper
                      key={event.id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        borderRadius: 1.5,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.02)"
                            : "grey.50",
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          bgcolor: "action.hover",
                          color: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={16} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{ wordBreak: "break-word" }}
                        >
                          <strong>{event.user}</strong> {event.action}{" "}
                          <Box
                            component="span"
                            sx={{ color: "primary.main", fontWeight: 600 }}
                          >
                            {event.target}
                          </Box>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimeAgo(event.time)}
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performing Agents */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Top Performing Agents
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Agent</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Tickets
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Resolved
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        Rating
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agents.map((agent) => (
                      <TableRow key={agent.name} hover>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              name={agent.name}
                              size="sm"
                              status={agent.status}
                            />
                            <Typography variant="body2" fontWeight={600}>
                              {agent.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{agent.tickets}</TableCell>
                        <TableCell align="right">{agent.resolved}</TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="warning.main"
                          >
                            ⭐ {agent.satisfaction}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
