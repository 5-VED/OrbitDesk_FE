import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Plus, Search, Star, Mail, Edit2, Trash2 } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { AgentModal } from "./AgentModal";
import { userService } from "../features/contacts/api/users";
import { toast } from "react-hot-toast";

const statusColors = {
  online: "success",
  busy: "danger",
  away: "warning",
  offline: "default",
};

export function Agents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getAgents();
      if (response.success && response.data?.agents) {
        setAgents(response.data.agents);
        setFilteredAgents(response.data.agents);
      }
    } catch (error) {
      console.error("Failed to fetch agents", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = agents.filter((agent) => {
      const fullName = `${agent.first_name} ${agent.last_name}`.toLowerCase();
      const matchesQuery =
        fullName.includes(lowerQuery) ||
        agent.email.toLowerCase().includes(lowerQuery);
      const matchesStatus =
        statusFilter === "all" || agent.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
    setFilteredAgents(filtered);
  }, [searchQuery, agents, statusFilter]);

  const handleEdit = (agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const handleDelete = async (agentId) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;

    try {
      await userService.delete(agentId);
      toast.success("Agent deleted successfully");
      fetchAgents();
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete agent");
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
    fetchAgents();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
  };

  const onlineCount = agents.filter((a) => a.status === "online").length;
  const offlineCount = agents.filter(
    (a) => a.status === "offline" || !a.status,
  ).length;

  return (
    <PageContainer
      title="Agents"
      actions={
        <Button
          icon={Plus}
          onClick={() => {
            setSelectedAgent(null);
            setIsModalOpen(true);
          }}
        >
          Add Agent
        </Button>
      }
    >
      <AgentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        agent={selectedAgent}
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Search and Filters */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <OutlinedInput
            size="small"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Search size={18} style={{ opacity: 0.6 }} />
              </InputAdornment>
            }
            sx={{ width: { xs: "100%", sm: 300 }, borderRadius: 1.5 }}
          />

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Box
              onClick={() => setStatusFilter("all")}
              sx={{ cursor: "pointer" }}
            >
              <Badge
                variant={statusFilter === "all" ? "primary" : "default"}
                size="md"
              >
                All ({agents.length})
              </Badge>
            </Box>
            <Box
              onClick={() => setStatusFilter("online")}
              sx={{ cursor: "pointer" }}
            >
              <Badge
                variant={statusFilter === "online" ? "success" : "default"}
                size="md"
                dot
              >
                Online ({onlineCount})
              </Badge>
            </Box>
            <Box
              onClick={() => setStatusFilter("offline")}
              sx={{ cursor: "pointer" }}
            >
              <Badge
                variant={statusFilter === "offline" ? "primary" : "default"}
                size="md"
              >
                Offline ({offlineCount})
              </Badge>
            </Box>
          </Box>
        </Paper>

        {/* Agents Grid */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
            <CircularProgress size={36} />
          </Box>
        ) : filteredAgents.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              No Agents Found
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", maxWidth: 400 }}
            >
              Add your first agent to start assigning and managing support
              tickets.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2.5}>
            {filteredAgents.map((agent) => (
              <Grid key={agent._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  hover
                  sx={{
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    height: "100%",
                  }}
                >
                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Avatar
                      name={`${agent.first_name} ${agent.last_name}`}
                      src={agent.profile_pic}
                      size="lg"
                      status={agent.status}
                    />
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Edit Agent">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(agent)}
                          sx={{ color: "text.secondary" }}
                        >
                          <Edit2 size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Agent">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(agent._id)}
                          sx={{ color: "error.main" }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Info */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        lineHeight: 1.2,
                      }}
                    >
                      {agent.first_name} {agent.last_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", display: "block", mb: 1 }}
                    >
                      {agent.role?.role || "Agent"}
                    </Typography>
                    <Badge
                      variant={statusColors[agent.status] || "default"}
                      size="sm"
                    >
                      {(agent.status || "offline").charAt(0).toUpperCase() +
                        (agent.status || "offline").slice(1)}
                    </Badge>
                  </Box>

                  {/* Meta */}
                  <Box
                    sx={{
                      pt: 1,
                      borderTop: 1,
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "text.tertiary" }}
                    >
                      {agent.department || "General"}
                    </Typography>
                    <Box
                      component="a"
                      href={`mailto:${agent.email}`}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        fontSize: "0.8125rem",
                        color: "text.secondary",
                        textDecoration: "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        "&:hover": {
                          color: "primary.main",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      <Mail size={14} style={{ flexShrink: 0 }} />
                      <span>{agent.email}</span>
                    </Box>
                  </Box>

                  {/* Stats */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 1,
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor: "background.subtle",
                      mt: "auto",
                      textAlign: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          lineHeight: 1.2,
                        }}
                      >
                        {agent.tickets?.open || 0}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.tertiary", fontSize: "0.6875rem" }}
                      >
                        Open
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          lineHeight: 1.2,
                        }}
                      >
                        {agent.tickets?.resolved || 0}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.tertiary", fontSize: "0.6875rem" }}
                      >
                        Resolved
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          lineHeight: 1.2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.25,
                        }}
                      >
                        <Star size={11} color="#f59e0b" fill="#f59e0b" />
                        {agent.rating?.avg > 0
                          ? agent.rating.avg.toFixed(1)
                          : "—"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.tertiary", fontSize: "0.6875rem" }}
                      >
                        Rating
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          lineHeight: 1.2,
                        }}
                      >
                        100%
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.tertiary", fontSize: "0.6875rem" }}
                      >
                        SLA
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </PageContainer>
  );
}

export default Agents;
