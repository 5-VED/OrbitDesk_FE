import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button as MuiButton,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Paper,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Search,
  Plus,
  UserCheck,
  UserX,
  Trash2,
  Edit,
  Download,
  X,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { userService } from "@/features/contacts/api/users";

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "agent", label: "Agent" },
  { value: "customer", label: "Customer" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const getRoleBadgeVariant = (role) => {
  switch (role) {
    case "admin":
      return "danger";
    case "agent":
      return "primary";
    case "customer":
      return "default";
    default:
      return "default";
  }
};

const getStatusBadgeVariant = (status) => {
  return status === "active" ? "success" : "default";
};

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.list();
        setUsers(res?.data || []);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !roleFilter || user.role_type === roleFilter;
    const matchesStatus =
      !statusFilter || user.is_active === (statusFilter === "active");
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map((u) => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  const userCounts = {
    total: users.length,
    admins: users.filter((u) => u.role_type === "admin").length,
    agents: users.filter((u) => u.role_type === "agent").length,
    customers: users.filter((u) => u.role_type === "customer").length,
  };

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
        <Typography color="text.secondary">Loading users...</Typography>
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
            Users & Agents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage all system users, agents, and their permissions
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <MuiButton
            variant="outlined"
            color="inherit"
            startIcon={<Download size={16} />}
            sx={{ textTransform: "none" }}
          >
            Export
          </MuiButton>
          <MuiButton
            variant="contained"
            color="primary"
            startIcon={<Plus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
            sx={{ textTransform: "none" }}
          >
            Add User
          </MuiButton>
        </Stack>
      </Box>

      {/* Quick Stats Banner */}
      <Grid container spacing={2}>
        {[
          {
            label: "Total Users",
            value: userCounts.total,
            color: "text.primary",
          },
          { label: "Admins", value: userCounts.admins, color: "error.main" },
          { label: "Agents", value: userCounts.agents, color: "primary.main" },
          {
            label: "Customers",
            value: userCounts.customers,
            color: "success.main",
          },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, sm: 3 }}>
            <Paper
              variant="outlined"
              sx={{ p: 2, textAlign: "center", borderRadius: 2 }}
            >
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ color: stat.color }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Filters & Bulk Actions Toolbar */}
      <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        size={18}
                        color="var(--color-text-secondary, #94a3b8)"
                      />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery("")}
                      >
                        <X size={14} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              select
              size="small"
              fullWidth
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {roleOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              select
              size="small"
              fullWidth
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Bulk Actions Bar */}
        {selectedUsers.length > 0 && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Typography variant="body2" fontWeight={600} color="primary.main">
              {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""}{" "}
              selected
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <MuiButton
                size="small"
                variant="outlined"
                color="inherit"
                startIcon={<UserCheck size={14} />}
              >
                Activate
              </MuiButton>
              <MuiButton
                size="small"
                variant="outlined"
                color="inherit"
                startIcon={<UserX size={14} />}
              >
                Deactivate
              </MuiButton>
              <MuiButton
                size="small"
                variant="outlined"
                color="error"
                startIcon={<Trash2 size={14} />}
              >
                Delete
              </MuiButton>
              <MuiButton
                size="small"
                variant="text"
                color="inherit"
                onClick={() => setSelectedUsers([])}
              >
                Clear
              </MuiButton>
            </Stack>
          </Box>
        )}
      </Card>

      {/* Users Table */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Organization</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Group</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Last Login</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => {
                const isSelected = selectedUsers.includes(user._id);
                return (
                  <TableRow key={user._id} hover selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={() => handleSelectUser(user._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          name={`${user.first_name} ${user.last_name}`}
                          size="sm"
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {user.first_name} {user.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role_type)}>
                        {user.role_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(
                          user.is_active ? "active" : "inactive",
                        )}
                      >
                        {user.is_active ? "active" : "inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.organization_id?.name || user.organization || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.group || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.lastLogin || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="View">
                          <IconButton size="small">
                            <Eye size={15} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <Edit size={15} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <Trash2 size={15} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            textAlign: "right",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Showing {filteredUsers.length} of {users.length} users
          </Typography>
        </Box>
      </Card>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New User"
      >
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            setIsCreateModalOpen(false);
          }}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Input label="First Name" placeholder="Enter first name" required />
            <Input label="Last Name" placeholder="Enter last name" required />
          </Box>
          <Input
            label="Email"
            type="email"
            placeholder="user@example.com"
            required
          />
          <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
          <Select
            label="Role"
            options={[
              { value: "customer", label: "Customer" },
              { value: "agent", label: "Agent" },
              { value: "admin", label: "Admin" },
            ]}
          />
          <Select
            label="Status"
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Set initial password"
            required
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              mt: 1,
            }}
          >
            <MuiButton
              variant="outlined"
              color="inherit"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </MuiButton>
            <MuiButton
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Plus size={16} />}
            >
              Create User
            </MuiButton>
          </Box>
        </Box>
      </Modal>
    </Stack>
  );
}
