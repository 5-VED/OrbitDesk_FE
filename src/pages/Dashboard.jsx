import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MuiCircularProgress from "@mui/material/CircularProgress";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Ticket,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Target,
  Loader2,
} from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { slaService } from "../features/settings/api/sla";
import { userService } from "../features/contacts/api/users";

function CircularRing({ value, target, size = 80 }) {
  const isAtRisk = value < target;
  const color = isAtRisk ? "warning.main" : "success.main";

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      {/* Background circle */}
      <MuiCircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={4.5}
        sx={{
          color: "background.subtle",
        }}
      />
      {/* Foreground circle */}
      <MuiCircularProgress
        variant="determinate"
        value={Math.min(value, 100)}
        size={size}
        thickness={4.5}
        sx={{
          color,
          position: "absolute",
          left: 0,
          strokeLinecap: "round",
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.9375rem" }}
        >
          {value}%
        </Typography>
      </Box>
    </Box>
  );
}

export function Dashboard() {
  const theme = useTheme();
  const [dashData, setDashData] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, agentsRes] = await Promise.all([
          slaService.getDashboardStats(),
          userService.getAgents().catch(() => ({ data: { agents: [] } })),
        ]);
        setDashData(statsRes.data || null);

        const agentList = agentsRes?.data?.agents || agentsRes?.data || [];
        setAgents(Array.isArray(agentList) ? agentList.slice(0, 5) : []);
      } catch {
        // Non-critical; show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const ts = dashData?.ticketStats || {};
  const sla = dashData?.slaCompliance || {};

  const ticketStats = [
    {
      label: "Open Tickets",
      value: ts.open ?? 0,
      icon: Ticket,
      color: "primary",
    },
    { label: "Pending", value: ts.pending ?? 0, icon: Clock, color: "warning" },
    {
      label: "Overdue",
      value: ts.overdue ?? 0,
      icon: AlertTriangle,
      color: "error",
    },
    {
      label: "Resolved Today",
      value: ts.resolvedToday ?? 0,
      icon: CheckCircle2,
      color: "success",
    },
  ];

  const avgResponseLabel =
    sla.avgResponseMinutes != null
      ? sla.avgResponseMinutes < 60
        ? `${sla.avgResponseMinutes}m`
        : `${(sla.avgResponseMinutes / 60).toFixed(1)}h`
      : "-";

  const slaStatus = [
    { label: "First Response", value: sla.firstResponse ?? 0, target: 95 },
    { label: "Resolution Time", value: sla.resolution ?? 0, target: 90 },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "ticket_created",
      user: "Sarah Chen",
      action: "created ticket",
      target: "#1234 - Login issue",
      time: "2 min ago",
    },
    {
      id: 2,
      type: "ticket_resolved",
      user: "Mike Johnson",
      action: "resolved ticket",
      target: "#1230 - Payment failed",
      time: "15 min ago",
    },
    {
      id: 3,
      type: "comment",
      user: "Emily Davis",
      action: "commented on",
      target: "#1228 - API error",
      time: "32 min ago",
    },
    {
      id: 4,
      type: "assigned",
      user: "Alex Kim",
      action: "was assigned to",
      target: "#1225 - Dashboard bug",
      time: "1 hour ago",
    },
    {
      id: 5,
      type: "ticket_created",
      user: "John Smith",
      action: "created ticket",
      target: "#1233 - Mobile app crash",
      time: "2 hours ago",
    },
  ];

  const fallbackAgents = [
    {
      name: "Sarah Chen",
      tickets: 34,
      resolved: 28,
      rating: 4.8,
      status: "online",
    },
    {
      name: "Mike Johnson",
      tickets: 29,
      resolved: 25,
      rating: 4.6,
      status: "online",
    },
    {
      name: "Emily Davis",
      tickets: 22,
      resolved: 20,
      rating: 4.9,
      status: "busy",
    },
    {
      name: "Alex Kim",
      tickets: 18,
      resolved: 15,
      rating: 4.5,
      status: "away",
    },
  ];

  const displayAgents =
    agents.length > 0
      ? agents.map((a) => ({
          name:
            `${a.first_name || ""} ${a.last_name || ""}`.trim() ||
            a.email ||
            "Agent",
          tickets: a.ticketStats?.total ?? 0,
          resolved: a.ticketStats?.resolved ?? 0,
          status: a.status || "online",
        }))
      : fallbackAgents;

  if (loading) {
    return (
      <PageContainer title="Workspace">
        <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
          <Loader2
            size={36}
            className="spin"
            color={theme.palette.primary.main}
          />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Workspace"
      actions={
        <Button icon={TrendingUp} variant="secondary">
          View Reports
        </Button>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Stats row */}
        <Grid container spacing={2.5}>
          {ticketStats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2.5,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: (t) =>
                      alpha(
                        t.palette[stat.color]?.main || t.palette.primary.main,
                        0.12,
                      ),
                    color: `${stat.color}.main`,
                    flexShrink: 0,
                  }}
                >
                  <stat.icon size={24} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                      fontSize: "0.8125rem",
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "text.primary", mt: 0.25 }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main 2-column Grid */}
        <Grid container spacing={3}>
          {/* Workspace Health */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardHeader>
                <CardTitle>Workspace Health</CardTitle>
              </CardHeader>
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    py: 2,
                    flexWrap: "wrap",
                    gap: 3,
                  }}
                >
                  {slaStatus.map((s) => (
                    <Box
                      key={s.label}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <CircularRing
                        value={s.value}
                        target={s.target}
                        size={88}
                      />
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "text.primary" }}
                        >
                          {s.label}
                        </Typography>
                        <Badge
                          variant={s.value >= s.target ? "success" : "warning"}
                          size="sm"
                          dot
                        >
                          {s.value >= s.target ? "On track" : "At risk"}
                        </Badge>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 1.5,
                    backgroundColor: "background.subtle",
                    mt: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    Avg. Response Time
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    {avgResponseLabel}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Today's Focus */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ height: "100%" }}>
              <CardHeader>
                <CardTitle>Today's Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {[
                    {
                      title: "Resolve escalation #1220",
                      meta: "Due today · Priority high",
                      color: "error.main",
                    },
                    {
                      title: "Review pending SLA exceptions",
                      meta: "3 items · Review by EOD",
                      color: "warning.main",
                    },
                    {
                      title: "Team standup at 10:00 AM",
                      meta: "Weekly sync",
                      color: "info.main",
                    },
                  ].map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1.75,
                        borderRadius: 1.5,
                        backgroundColor: "background.subtle",
                        borderLeft: 4,
                        borderLeftColor: item.color,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "text.primary" }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {item.meta}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Team Activity */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ height: "100%" }}>
              <CardHeader>
                <CardTitle>Team Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}
                >
                  {recentActivity.map((item) => (
                    <Box
                      key={item.id}
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar name={item.user} size="sm" />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <strong>{item.user}</strong> {item.action}{" "}
                          <Box
                            component="span"
                            sx={{ color: "primary.main", fontWeight: 500 }}
                          >
                            {item.target}
                          </Box>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.tertiary" }}
                        >
                          {item.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Team Capacity */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ height: "100%" }}>
              <CardHeader>
                <CardTitle>Team Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {displayAgents.map((agent) => (
                    <Box
                      key={agent.name}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: 1.5,
                        backgroundColor: "background.subtle",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          name={agent.name}
                          size="sm"
                          status={agent.status}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "text.primary" }}
                          >
                            {agent.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {agent.status === "online"
                              ? "Available"
                              : agent.status === "busy"
                                ? "On a call"
                                : "Away"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: "text.primary" }}
                          >
                            {agent.resolved}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.tertiary" }}
                          >
                            Resolved
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: "text.primary" }}
                          >
                            {agent.tickets}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.tertiary" }}
                          >
                            Active
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* AI Signals */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Target size={18} color={theme.palette.primary.main} />
                <span>AI Signals</span>
                <Badge variant="info" size="sm">
                  2 new
                </Badge>
              </Box>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    p: 2,
                    borderRadius: 1.5,
                    backgroundColor: (t) => alpha(t.palette.warning.main, 0.08),
                    border: 1,
                    borderColor: (t) => alpha(t.palette.warning.main, 0.25),
                  }}
                >
                  <AlertTriangle
                    size={20}
                    color={theme.palette.warning.main}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.primary", fontWeight: 500 }}
                    >
                      Unusually high ticket volume on login flow — consider
                      reviewing recent deployment
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        mt: 0.5,
                      }}
                    >
                      Detected 15m ago
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    p: 2,
                    borderRadius: 1.5,
                    backgroundColor: (t) => alpha(t.palette.success.main, 0.08),
                    border: 1,
                    borderColor: (t) => alpha(t.palette.success.main, 0.25),
                  }}
                >
                  <TrendingUp
                    size={20}
                    color={theme.palette.success.main}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.primary", fontWeight: 500 }}
                    >
                      Agent Sarah Chen has highest resolution rate this week
                      (94%)
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        mt: 0.5,
                      }}
                    >
                      Weekly trend
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;
