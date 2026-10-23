import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button as MuiButton,
  Alert,
  CircularProgress,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Database,
  Server,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HardDrive,
  Wifi,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const INITIAL_SERVICES = [
  {
    id: "api",
    name: "API Server",
    icon: Server,
    status: "checking",
    uptime: null,
    version: null,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: Database,
    status: "checking",
    latency: null,
    connections: null,
  },
  {
    id: "redis",
    name: "Redis",
    icon: HardDrive,
    status: "checking",
    latency: null,
    hitRate: null,
  },
  {
    id: "kafka",
    name: "Kafka",
    icon: Zap,
    status: "checking",
    latency: null,
    topics: null,
  },
];

const STATS = [
  { label: "CPU Usage", value: "—", icon: Server },
  { label: "Memory Usage", value: "—", icon: HardDrive },
  { label: "Uptime", value: "—", icon: Clock },
  { label: "Network", value: "—", icon: Wifi },
];

export function AdminSystemHealth() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [systemStats, setSystemStats] = useState(STATS);
  const [lastChecked, setLastChecked] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "/api/v1";
      const start = Date.now();

      const response = await fetch(`${baseUrl}/health`, {
        credentials: "include",
      });

      const elapsed = Date.now() - start;
      const data = response.ok ? await response.json() : null;

      if (data) {
        setServices([
          {
            id: "api",
            name: "API Server",
            icon: Server,
            status: "healthy",
            uptime: data.uptime || "—",
            version: data.version || "1.0.0",
            latency: elapsed,
          },
          {
            id: "mongodb",
            name: "MongoDB",
            icon: Database,
            status:
              data.database?.status === "connected" ? "healthy" : "degraded",
            latency: data.database?.latency || "—",
            connections: data.database?.connections || "—",
          },
          {
            id: "redis",
            name: "Redis",
            icon: HardDrive,
            status: data.redis?.status === "connected" ? "healthy" : "degraded",
            latency: data.redis?.latency || "—",
            hitRate: data.redis?.hitRate || "—",
          },
          {
            id: "kafka",
            name: "Kafka",
            icon: Zap,
            status: data.kafka?.status === "connected" ? "healthy" : "degraded",
            latency: data.kafka?.latency || "—",
            topics: data.kafka?.topics || "—",
          },
        ]);
        setSystemStats([
          { label: "CPU Usage", value: data.system?.cpu || "—", icon: Server },
          {
            label: "Memory Usage",
            value: data.system?.memory || "—",
            icon: HardDrive,
          },
          {
            label: "Uptime",
            value: data.uptime
              ? `${Math.floor(data.uptime / 3600)}h ${Math.floor((data.uptime % 3600) / 60)}m`
              : "—",
            icon: Clock,
          },
          { label: "Network", value: data.system?.network || "—", icon: Wifi },
        ]);
      } else {
        setServices((prev) =>
          prev.map((s) =>
            s.id === "api" ? { ...s, status: "healthy", latency: elapsed } : s,
          ),
        );
      }
    } catch {
      setServices((prev) =>
        prev.map((s) => (s.id === "api" ? { ...s, status: "down" } : s)),
      );
    } finally {
      setLastChecked(new Date());
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case "healthy":
        return "Operational";
      case "degraded":
        return "Degraded";
      case "down":
        return "Down";
      default:
        return "Checking...";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "healthy":
        return <Badge variant="success">{getStatusLabel(status)}</Badge>;
      case "degraded":
        return <Badge variant="warning">{getStatusLabel(status)}</Badge>;
      case "down":
        return <Badge variant="danger">{getStatusLabel(status)}</Badge>;
      default:
        return <Badge variant="secondary">{getStatusLabel(status)}</Badge>;
    }
  };

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
            System Health
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor service status and system performance
            {lastChecked &&
              ` — Last checked: ${lastChecked.toLocaleTimeString()}`}
          </Typography>
        </Box>
        <MuiButton
          variant="outlined"
          color="inherit"
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <RefreshCw size={16} />
            )
          }
          onClick={checkHealth}
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          {loading ? "Checking..." : "Refresh"}
        </MuiButton>
      </Box>

      {/* Overall Status Banner */}
      {services.every((s) => s.status === "healthy") && (
        <Alert severity="success" icon={<CheckCircle2 size={20} />}>
          All systems operational
        </Alert>
      )}
      {services.some((s) => s.status === "degraded") && (
        <Alert severity="warning" icon={<AlertTriangle size={20} />}>
          Some services are experiencing degraded performance
        </Alert>
      )}
      {services.some((s) => s.status === "down") && (
        <Alert severity="error" icon={<XCircle size={20} />}>
          One or more critical services are down
        </Alert>
      )}

      {/* Service Cards Grid */}
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid key={service.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card variant="outlined" sx={{ height: "100%", borderRadius: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
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
                      bgcolor:
                        service.status === "healthy"
                          ? "rgba(34, 197, 94, 0.1)"
                          : service.status === "down"
                            ? "rgba(239, 68, 68, 0.1)"
                            : "rgba(245, 158, 11, 0.1)",
                      color:
                        service.status === "healthy"
                          ? "success.main"
                          : service.status === "down"
                            ? "error.main"
                            : "warning.main",
                    }}
                  >
                    <service.icon size={22} />
                  </Box>
                  {getStatusBadge(service.status)}
                </Box>

                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  {service.name}
                </Typography>

                <Stack spacing={1} divider={<Divider />}>
                  {service.latency !== null &&
                    service.latency !== undefined && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.85rem",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Latency
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {typeof service.latency === "number"
                            ? `${service.latency}ms`
                            : service.latency}
                        </Typography>
                      </Box>
                    )}
                  {service.uptime !== null && service.uptime !== undefined && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Uptime
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {typeof service.uptime === "number"
                          ? `${Math.floor(service.uptime / 3600)}h ${Math.floor((service.uptime % 3600) / 60)}m`
                          : service.uptime}
                      </Typography>
                    </Box>
                  )}
                  {service.version && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Version
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {service.version}
                      </Typography>
                    </Box>
                  )}
                  {service.connections !== null &&
                    service.connections !== undefined && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.85rem",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Connections
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {service.connections}
                        </Typography>
                      </Box>
                    )}
                  {service.hitRate !== null &&
                    service.hitRate !== undefined && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.85rem",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Hit Rate
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {service.hitRate}
                        </Typography>
                      </Box>
                    )}
                  {service.topics !== null && service.topics !== undefined && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Topics
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {service.topics}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* System Resources Card */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
            System Resources
          </Typography>
          <Grid container spacing={3}>
            {systemStats.map((stat) => (
              <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <stat.icon size={20} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
}
