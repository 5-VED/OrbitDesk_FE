import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Globe,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  ArrowLeft,
  Calendar,
  Settings,
  Share2,
} from "lucide-react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { Modal } from "../components/ui/Modal";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { DataTable } from "../components/ui/DataTable";
import { Badge } from "../components/ui/Badge";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchOrganizations,
  deleteOrganization,
  setOrgSearchQuery,
  setOrgSelectedRows,
  clearOrgSelectedRows,
  setDetailOrg,
  clearDetailOrg,
  selectFilteredOrganizations,
  selectOrganizationsLoading,
  selectOrgSearchQuery,
  selectOrgSelectedRows,
  selectOrgDetail,
} from "../store/slices/organizationsSlice";
import { OrganizationModal } from "./OrganizationModal";
import { toast } from "react-hot-toast";

export function Organizations() {
  const dispatch = useAppDispatch();
  const filteredOrgs = useAppSelector(selectFilteredOrganizations);
  const loading = useAppSelector(selectOrganizationsLoading);
  const searchQuery = useAppSelector(selectOrgSearchQuery);
  const selectedRows = useAppSelector(selectOrgSelectedRows);
  const detailOrg = useAppSelector(selectOrgDetail);

  // Local ephemeral UI state
  const [editingOrg, setEditingOrg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [singleDeleteOrg, setSingleDeleteOrg] = useState(null);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  const handleCreateSuccess = () => {
    dispatch(fetchOrganizations());
    setIsModalOpen(false);
  };

  // Multi-select handlers
  const handleSelectRow = (id, checked) => {
    const newSelection = checked
      ? [...selectedRows, id]
      : selectedRows.filter((i) => i !== id);
    dispatch(setOrgSelectedRows(newSelection));
  };

  const handleSelectAll = (checked) => {
    dispatch(setOrgSelectedRows(checked ? filteredOrgs.map((o) => o._id) : []));
  };

  // Delete handlers
  const handleBulkDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleSingleDelete = (org) => {
    setSingleDeleteOrg(org);
    setIsDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    setDeleteLoading(true);
    try {
      if (singleDeleteOrg) {
        await dispatch(deleteOrganization(singleDeleteOrg._id)).unwrap();
        toast.success("Organization deleted successfully");
        if (detailOrg?._id === singleDeleteOrg._id) {
          dispatch(clearDetailOrg());
        }
      } else {
        for (const id of selectedRows) {
          await dispatch(deleteOrganization(id)).unwrap();
        }
        toast.success(`${selectedRows.length} organizations deleted`);
        if (detailOrg && selectedRows.includes(detailOrg._id)) {
          dispatch(clearDetailOrg());
        }
        dispatch(clearOrgSelectedRows());
      }
      setIsDeleteModalOpen(false);
      setSingleDeleteOrg(null);
    } catch (error) {
      toast.error(error || "Failed to delete organizations");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getOrgInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "O"
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns = [
    {
      key: "name",
      header: "Organization",
      render: (_, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            variant="rounded"
            sx={{
              width: 36,
              height: 36,
              bgcolor: "secondary.light",
              color: "secondary.contrastText",
              fontWeight: 700,
              fontSize: "0.875rem",
            }}
          >
            {getOrgInitials(row.name)}
          </Avatar>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {row.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {row.domains?.length > 0 ? row.domains.join(", ") : "No domains"}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "domains",
      header: "Domains",
      render: (value) => (
        <Typography variant="body2" color="text.secondary">
          {value?.length || 0} domain{value?.length !== 1 ? "s" : ""}
        </Typography>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (value) => (
        <Badge variant={value !== false ? "success" : "default"}>
          {value !== false ? (
            <>
              <CheckCircle size={12} style={{ marginRight: 4 }} /> Active
            </>
          ) : (
            <>
              <XCircle size={12} style={{ marginRight: 4 }} /> Inactive
            </>
          )}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (value) => formatDate(value),
    },
    {
      key: "actions",
      header: "",
      render: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setEditingOrg(row);
              setIsModalOpen(true);
            }}
          >
            <Edit size={16} />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleSingleDelete(row);
            }}
          >
            <Trash2 size={16} />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <PageContainer
      title="Organizations"
      actions={
        <Button
          icon={Plus}
          onClick={() => {
            setEditingOrg(null);
            setIsModalOpen(true);
          }}
        >
          Add Organization
        </Button>
      }
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: detailOrg ? "1fr 360px" : "1fr",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Organizations List */}
        <Box
          sx={{
            display: {
              xs: detailOrg ? "none" : "flex",
              lg: "flex",
            },
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Box sx={{ maxWidth: 360 }}>
            <OutlinedInput
              size="small"
              fullWidth
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => dispatch(setOrgSearchQuery(e.target.value))}
              startAdornment={
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              }
            />
          </Box>

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                bgcolor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {selectedRows.length} selected
              </Typography>
              <Button
                variant="ghost"
                size="sm"
                className="danger"
                onClick={handleBulkDelete}
              >
                <Trash2 size={16} /> Delete
              </Button>
            </Paper>
          )}

          <DataTable
            columns={columns}
            data={filteredOrgs}
            selectable
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            emptyMessage={
              loading
                ? { title: "Loading organizations...", subtitle: "" }
                : {
                    title: "No Organizations Yet",
                    subtitle:
                      "Add your first organization to manage your customer accounts.",
                  }
            }
            onRowClick={(row) => dispatch(setDetailOrg(row))}
            rowKey="_id"
          />

          {/* Stats */}
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {filteredOrgs.length}{" "}
              {filteredOrgs.length === 1 ? "organization" : "organizations"}
            </Typography>
          </Box>
        </Box>

        {/* Organization Detail */}
        {detailOrg && (
          <Box
            sx={{
              display: {
                xs: "block",
                lg: "block",
              },
              position: { lg: "sticky" },
              top: { lg: 80 },
            }}
          >
            <Card>
              <Box
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{ display: { xs: "inline-flex", lg: "none" } }}
                    onClick={() => dispatch(clearDetailOrg())}
                  >
                    <ArrowLeft size={18} />
                  </IconButton>
                  <Box
                    sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        fontWeight: 700,
                        fontSize: "1.5rem",
                      }}
                    >
                      {getOrgInitials(detailOrg.name)}
                    </Avatar>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingOrg(detailOrg);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit size={16} />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {detailOrg.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {detailOrg.is_active !== false
                    ? "Active Organization"
                    : "Inactive Organization"}
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    display: "block",
                    mb: 1.5,
                  }}
                >
                  Domains
                </Typography>
                {detailOrg.domains?.length > 0 ? (
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}
                  >
                    {detailOrg.domains.map((domain) => (
                      <Chip
                        key={domain}
                        icon={<Globe size={13} />}
                        label={domain}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    No domains configured
                  </Typography>
                )}

                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    display: "block",
                    mb: 1.5,
                  }}
                >
                  Settings
                </Typography>
                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Share2 size={16} style={{ opacity: 0.6 }} />
                    <Typography variant="body2">
                      External Sharing{" "}
                      {detailOrg.settings?.allow_external_sharing
                        ? "Enabled"
                        : "Disabled"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Settings size={16} style={{ opacity: 0.6 }} />
                    <Typography variant="body2">
                      Locale: {detailOrg.settings?.default_locale || "en-US"}
                    </Typography>
                  </Box>
                </Stack>

                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    display: "block",
                    mb: 1.5,
                  }}
                >
                  Info
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Calendar size={16} style={{ opacity: 0.6 }} />
                  <Typography variant="body2">
                    Created {formatDate(detailOrg.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        )}
      </Box>

      <OrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
        organization={editingOrg}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSingleDeleteOrg(null);
        }}
        title="Delete Organization"
        size="small"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSingleDeleteOrg(null);
              }}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              className="danger"
              onClick={confirmBulkDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        {singleDeleteOrg ? (
          <Typography variant="body2">
            Are you sure you want to delete "{singleDeleteOrg.name}"? This
            action cannot be undone.
          </Typography>
        ) : (
          <Typography variant="body2">
            Are you sure you want to delete {selectedRows.length}{" "}
            {selectedRows.length === 1 ? "organization" : "organizations"}? This
            action cannot be undone.
          </Typography>
        )}
      </Modal>
    </PageContainer>
  );
}
