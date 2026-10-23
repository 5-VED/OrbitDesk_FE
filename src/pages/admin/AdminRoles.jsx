import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button as MuiButton,
  IconButton,
  LinearProgress,
  CircularProgress,
  Stack,
  Paper,
  Chip,
  Checkbox,
  FormControlLabel,
  TextField,
  Divider,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  CheckSquare,
  Square,
  Lock,
  Copy,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { roleService } from "@/services/role.service";
import { toast } from "react-hot-toast";

const permissionGroups = [
  {
    name: "Tickets",
    permissions: [
      { key: "tickets.view", label: "View tickets" },
      { key: "tickets.create", label: "Create tickets" },
      { key: "tickets.edit", label: "Edit tickets" },
      { key: "tickets.delete", label: "Delete tickets" },
      { key: "tickets.assign", label: "Assign tickets" },
      { key: "tickets.bulk", label: "Bulk operations" },
    ],
  },
  {
    name: "Users",
    permissions: [
      { key: "users.view", label: "View users" },
      { key: "users.create", label: "Create users" },
      { key: "users.edit", label: "Edit users" },
      { key: "users.delete", label: "Delete users" },
      { key: "users.manage_roles", label: "Manage roles" },
    ],
  },
  {
    name: "Organizations",
    permissions: [
      { key: "orgs.view", label: "View organizations" },
      { key: "orgs.create", label: "Create organizations" },
      { key: "orgs.edit", label: "Edit organizations" },
      { key: "orgs.delete", label: "Delete organizations" },
    ],
  },
  {
    name: "Reports",
    permissions: [
      { key: "reports.view", label: "View reports" },
      { key: "reports.export", label: "Export reports" },
    ],
  },
  {
    name: "Settings",
    permissions: [
      { key: "settings.view", label: "View settings" },
      { key: "settings.edit", label: "Edit settings" },
      { key: "settings.admin", label: "Admin panel access" },
    ],
  },
];

const allPermissionKeys = permissionGroups.flatMap((g) =>
  g.permissions.map((p) => p.key),
);

export function AdminRoles() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    description: "",
    permissions: [],
  });

  const fetchRoles = async () => {
    try {
      const response = await roleService.list();
      if (response.success && response.data) {
        setRoles(response.data);
        if (!selectedRole && response.data.length > 0) {
          setSelectedRole(response.data[0]);
        } else if (selectedRole) {
          const updated = response.data.find((r) => r._id === selectedRole._id);
          setSelectedRole(updated || response.data[0] || null);
        }
      }
    } catch {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const resetForm = () => {
    setFormData({ role: "", description: "", permissions: [] });
    setIsEditMode(false);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = () => {
    if (!selectedRole) return;
    setFormData({
      role: selectedRole.role,
      description: selectedRole.description || "",
      permissions: selectedRole.permissions || [],
    });
    setIsEditMode(true);
    setIsCreateModalOpen(true);
  };

  const handlePermissionToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter((p) => p !== key)
        : [...prev.permissions, key],
    }));
  };

  const handleToggleGroupAll = (group) => {
    const groupKeys = group.permissions.map((p) => p.key);
    const allSelected = groupKeys.every((k) =>
      formData.permissions.includes(k),
    );

    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((p) => !groupKeys.includes(p))
        : [...new Set([...prev.permissions, ...groupKeys])],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role.trim()) {
      toast.error("Role name is required");
      return;
    }

    setFormSubmitting(true);
    try {
      if (isEditMode && selectedRole) {
        await roleService.update(selectedRole._id, formData);
        toast.success("Role updated successfully");
      } else {
        await roleService.create(formData);
        toast.success("Role created successfully");
      }
      setIsCreateModalOpen(false);
      resetForm();
      await fetchRoles();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} role`,
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRole) return;

    setFormSubmitting(true);
    try {
      await roleService.delete(selectedRole._id);
      toast.success("Role deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
      await fetchRoles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete role");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDuplicate = () => {
    if (!selectedRole) return;
    setFormData({
      role: `${selectedRole.role} (Copy)`,
      description: selectedRole.description || "",
      permissions: [...(selectedRole.permissions || [])],
    });
    setIsEditMode(false);
    setIsCreateModalOpen(true);
  };

  const handlePermissionToggleInline = async (permKey) => {
    if (!selectedRole || selectedRole.isSystem) return;

    const updatedPermissions = selectedRole.permissions?.includes(permKey)
      ? selectedRole.permissions.filter((p) => p !== permKey)
      : [...(selectedRole.permissions || []), permKey];

    try {
      await roleService.update(selectedRole._id, {
        permissions: updatedPermissions,
      });
      await fetchRoles();
    } catch {
      toast.error("Failed to update permission");
    }
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
        <Typography color="text.secondary">Loading roles...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Page Header */}
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
            Roles & Permissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure access control for different user types
          </Typography>
        </Box>
        <MuiButton
          variant="contained"
          color="primary"
          startIcon={<Plus size={16} />}
          onClick={openCreateModal}
          sx={{ textTransform: "none" }}
        >
          Create Role
        </MuiButton>
      </Box>

      {/* Master-Detail Layout */}
      <Grid container spacing={3}>
        {/* Roles List */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Stack spacing={2}>
            {roles.length === 0 ? (
              <Paper
                variant="outlined"
                sx={{ p: 4, textAlign: "center", borderRadius: 2 }}
              >
                <Typography color="text.secondary">
                  No roles found. Create your first role.
                </Typography>
              </Paper>
            ) : (
              roles.map((role) => {
                const isSelected = selectedRole?._id === role._id;
                const permCount = (role.permissions || []).length;
                const permPercent =
                  (permCount / allPermissionKeys.length) * 100;

                return (
                  <Card
                    key={role._id}
                    variant="outlined"
                    onClick={() => setSelectedRole(role)}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      borderRadius: 2,
                      borderWidth: isSelected ? 2 : 1,
                      borderColor: isSelected ? "primary.main" : "divider",
                      bgcolor: isSelected
                        ? (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(244,67,54,0.08)"
                              : "rgba(244,67,54,0.04)"
                        : "background.paper",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: 2,
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1.5,
                            bgcolor: "primary.light",
                            color: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Shield size={16} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {role.role}
                          </Typography>
                        </Box>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {role.isSystem && (
                          <Chip
                            label="System"
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem", height: 20 }}
                          />
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "text.secondary",
                            fontSize: "0.8rem",
                          }}
                        >
                          <Users size={14} />
                          <span>{role.userCount || 0}</span>
                        </Box>
                      </Stack>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1.5, fontSize: "0.85rem" }}
                      noWrap
                    >
                      {role.description || "No description"}
                    </Typography>
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {permCount}/{allPermissionKeys.length} permissions
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {Math.round(permPercent)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={permPercent}
                        color="primary"
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </Card>
                );
              })
            )}
          </Stack>
        </Grid>

        {/* Permissions Detail */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          {selectedRole ? (
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Shield size={18} color="var(--color-primary, #F44336)" />
                      {selectedRole.role} Permissions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedRole.description || "No description provided"}
                    </Typography>
                  </Box>
                  {!selectedRole.isSystem && (
                    <Stack direction="row" spacing={1}>
                      <MuiButton
                        size="small"
                        variant="outlined"
                        color="inherit"
                        startIcon={<Copy size={14} />}
                        onClick={handleDuplicate}
                      >
                        Duplicate
                      </MuiButton>
                      <MuiButton
                        size="small"
                        variant="outlined"
                        color="inherit"
                        startIcon={<Edit size={14} />}
                        onClick={openEditModal}
                      >
                        Edit
                      </MuiButton>
                      <MuiButton
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Trash2 size={14} />}
                        onClick={() => setIsDeleteModalOpen(true)}
                      >
                        Delete
                      </MuiButton>
                    </Stack>
                  )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  {permissionGroups.map((group) => {
                    const grantedCount = group.permissions.filter((p) =>
                      (selectedRole.permissions || []).includes(p.key),
                    ).length;

                    return (
                      <Box key={group.name}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1.5,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="text.primary"
                          >
                            {group.name}
                          </Typography>
                          <Chip
                            label={`${grantedCount}/${group.permissions.length}`}
                            size="small"
                            color={grantedCount > 0 ? "primary" : "default"}
                            variant="outlined"
                            sx={{ height: 20, fontSize: "0.75rem" }}
                          />
                        </Box>
                        <Grid container spacing={1}>
                          {group.permissions.map((perm) => {
                            const isGranted = (
                              selectedRole.permissions || []
                            ).includes(perm.key);
                            return (
                              <Grid key={perm.key} size={{ xs: 12, sm: 6 }}>
                                <Paper
                                  variant="outlined"
                                  onClick={() =>
                                    handlePermissionToggleInline(perm.key)
                                  }
                                  sx={{
                                    p: 1.5,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    borderRadius: 1.5,
                                    cursor: selectedRole.isSystem
                                      ? "default"
                                      : "pointer",
                                    bgcolor: isGranted
                                      ? (theme) =>
                                          theme.palette.mode === "dark"
                                            ? "rgba(244,67,54,0.06)"
                                            : "rgba(244,67,54,0.03)"
                                      : "background.paper",
                                    borderColor: isGranted
                                      ? "primary.light"
                                      : "divider",
                                    transition: "all 0.15s",
                                    "&:hover": {
                                      borderColor: selectedRole.isSystem
                                        ? undefined
                                        : "primary.main",
                                    },
                                  }}
                                >
                                  {isGranted ? (
                                    <CheckSquare
                                      size={16}
                                      color="var(--color-primary, #F44336)"
                                    />
                                  ) : (
                                    <Square
                                      size={16}
                                      color="var(--color-text-secondary, #94a3b8)"
                                    />
                                  )}
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      flex: 1,
                                      fontWeight: isGranted ? 600 : 400,
                                    }}
                                  >
                                    {perm.label}
                                  </Typography>
                                  {selectedRole.isSystem && (
                                    <Tooltip title="System permissions are locked">
                                      <Lock
                                        size={12}
                                        color="var(--color-text-secondary, #94a3b8)"
                                      />
                                    </Tooltip>
                                  )}
                                </Paper>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Paper
              variant="outlined"
              sx={{ p: 6, textAlign: "center", borderRadius: 2 }}
            >
              <Typography color="text.secondary">
                Select a role to view its permissions.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Create / Edit Role Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title={isEditMode ? "Edit Role" : "Create New Role"}
        size="large"
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          <TextField
            label="Role Name"
            placeholder="e.g. Support Lead"
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, role: e.target.value }))
            }
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Description"
            placeholder="Brief description of this role"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            fullWidth
            multiline
            rows={2}
            size="small"
          />

          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              Permissions
            </Typography>
            <Stack
              spacing={2}
              sx={{ maxHeight: 360, overflowY: "auto", pr: 1 }}
            >
              {permissionGroups.map((group) => {
                const groupKeys = group.permissions.map((p) => p.key);
                const allSelected = groupKeys.every((k) =>
                  formData.permissions.includes(k),
                );

                return (
                  <Paper
                    key={group.name}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2 }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={allSelected}
                          onChange={() => handleToggleGroupAll(group)}
                        />
                      }
                      label={
                        <Typography variant="subtitle2" fontWeight={700}>
                          {group.name}
                        </Typography>
                      }
                    />
                    <Grid container spacing={1} sx={{ mt: 0.5, pl: 3 }}>
                      {group.permissions.map((perm) => (
                        <Grid key={perm.key} size={{ xs: 12, sm: 6 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={formData.permissions.includes(
                                  perm.key,
                                )}
                                onChange={() =>
                                  handlePermissionToggle(perm.key)
                                }
                              />
                            }
                            label={
                              <Typography variant="body2">
                                {perm.label}
                              </Typography>
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                );
              })}
            </Stack>
          </Box>

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
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              disabled={formSubmitting}
            >
              Cancel
            </MuiButton>
            <MuiButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={formSubmitting}
              startIcon={isEditMode ? <Edit size={16} /> : <Plus size={16} />}
            >
              {formSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update Role"
                  : "Create Role"}
            </MuiButton>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Role"
        size="small"
        footer={
          <>
            <MuiButton
              variant="text"
              color="inherit"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={formSubmitting}
            >
              Cancel
            </MuiButton>
            <MuiButton
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={formSubmitting}
            >
              {formSubmitting ? "Deleting..." : "Delete"}
            </MuiButton>
          </>
        }
      >
        <Typography variant="body1">
          Are you sure you want to delete the{" "}
          <strong>{selectedRole?.role}</strong> role?
          {selectedRole?.userCount > 0 && (
            <span>
              {" "}
              This role is currently assigned to{" "}
              <strong>{selectedRole.userCount}</strong> user(s).
            </span>
          )}
        </Typography>
      </Modal>
    </Stack>
  );
}
