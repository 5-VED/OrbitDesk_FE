import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Lock,
  Globe,
  Edit,
  Trash2,
  ArrowLeft,
  Calendar,
  Info,
} from "lucide-react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { Modal } from "../components/ui/Modal";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { DataTable } from "../components/ui/DataTable";
import { Badge } from "../components/ui/Badge";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchGroups,
  deleteGroup,
  setGroupSearchQuery,
  setGroupSelectedRows,
  clearGroupSelectedRows,
  setDetailGroup,
  clearDetailGroup,
  selectFilteredGroups,
  selectGroupsLoading,
  selectGroupSearchQuery,
  selectGroupSelectedRows,
  selectGroupDetail,
} from "../store/slices/groupsSlice";
import { GroupModal } from "./GroupModal";
import { toast } from "react-hot-toast";

export function Groups() {
  const dispatch = useAppDispatch();
  const filteredGroups = useAppSelector(selectFilteredGroups);
  const loading = useAppSelector(selectGroupsLoading);
  const searchQuery = useAppSelector(selectGroupSearchQuery);
  const selectedRows = useAppSelector(selectGroupSelectedRows);
  const detailGroup = useAppSelector(selectGroupDetail);

  // Local ephemeral UI state
  const [editingGroup, setEditingGroup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [singleDeleteGroup, setSingleDeleteGroup] = useState(null);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleCreateSuccess = () => {
    dispatch(fetchGroups());
    setIsModalOpen(false);
  };

  // Multi-select handlers
  const handleSelectRow = (id, checked) => {
    const newSelection = checked
      ? [...selectedRows, id]
      : selectedRows.filter((i) => i !== id);
    dispatch(setGroupSelectedRows(newSelection));
  };

  const handleSelectAll = (checked) => {
    dispatch(
      setGroupSelectedRows(checked ? filteredGroups.map((g) => g._id) : []),
    );
  };

  // Delete handlers
  const handleBulkDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleSingleDelete = (group) => {
    setSingleDeleteGroup(group);
    setIsDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    setDeleteLoading(true);
    try {
      if (singleDeleteGroup) {
        await dispatch(deleteGroup(singleDeleteGroup._id)).unwrap();
        toast.success("Group deleted successfully");
        if (detailGroup?._id === singleDeleteGroup._id) {
          dispatch(clearDetailGroup());
        }
      } else {
        for (const id of selectedRows) {
          await dispatch(deleteGroup(id)).unwrap();
        }
        toast.success(`${selectedRows.length} groups deleted`);
        if (detailGroup && selectedRows.includes(detailGroup._id)) {
          dispatch(clearDetailGroup());
        }
        dispatch(clearGroupSelectedRows());
      }
      setIsDeleteModalOpen(false);
      setSingleDeleteGroup(null);
    } catch (error) {
      toast.error(error || "Failed to delete groups");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getGroupInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "G"
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
      header: "Group",
      render: (_, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            variant="rounded"
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.light",
              color: "primary.contrastText",
              fontWeight: 700,
              fontSize: "0.875rem",
            }}
          >
            {getGroupInitials(row.name)}
          </Avatar>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {row.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {row.description || "No description"}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "is_private",
      header: "Visibility",
      render: (value) => (
        <Badge variant={value ? "warning" : "success"}>
          {value ? (
            <>
              <Lock size={12} style={{ marginRight: 4 }} /> Private
            </>
          ) : (
            <>
              <Globe size={12} style={{ marginRight: 4 }} /> Public
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
              setEditingGroup(row);
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
      title="Groups"
      actions={
        <Button
          icon={Plus}
          onClick={() => {
            setEditingGroup(null);
            setIsModalOpen(true);
          }}
        >
          Add Group
        </Button>
      }
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: detailGroup ? "1fr 360px" : "1fr",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Groups List */}
        <Box
          sx={{
            display: {
              xs: detailGroup ? "none" : "flex",
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
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => dispatch(setGroupSearchQuery(e.target.value))}
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
            data={filteredGroups}
            selectable
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            emptyMessage={
              loading
                ? { title: "Loading groups...", subtitle: "" }
                : {
                    title: "No Groups Yet",
                    subtitle:
                      "Create a group to organize your agents and route tickets efficiently.",
                  }
            }
            onRowClick={(row) => dispatch(setDetailGroup(row))}
            rowKey="_id"
          />

          {/* Stats */}
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {filteredGroups.length}{" "}
              {filteredGroups.length === 1 ? "group" : "groups"}
            </Typography>
          </Box>
        </Box>

        {/* Group Detail */}
        {detailGroup && (
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
                    onClick={() => dispatch(clearDetailGroup())}
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
                      {getGroupInitials(detailGroup.name)}
                    </Avatar>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingGroup(detailGroup);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit size={16} />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {detailGroup.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {detailGroup.is_private ? "Private Group" : "Public Group"}
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
                    mb: 2,
                  }}
                >
                  Group Information
                </Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Info size={16} style={{ opacity: 0.6 }} />
                    <Typography variant="body2">
                      {detailGroup.description || "No description"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {detailGroup.is_private ? (
                      <Lock size={16} style={{ opacity: 0.6 }} />
                    ) : (
                      <Globe size={16} style={{ opacity: 0.6 }} />
                    )}
                    <Typography variant="body2">
                      {detailGroup.is_private ? "Private" : "Public"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Calendar size={16} style={{ opacity: 0.6 }} />
                    <Typography variant="body2">
                      Created {formatDate(detailGroup.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Card>
          </Box>
        )}
      </Box>

      <GroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
        group={editingGroup}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSingleDeleteGroup(null);
        }}
        title="Delete Group"
        size="small"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSingleDeleteGroup(null);
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
        {singleDeleteGroup ? (
          <Typography variant="body2">
            Are you sure you want to delete "{singleDeleteGroup.name}"? This
            action cannot be undone.
          </Typography>
        ) : (
          <Typography variant="body2">
            Are you sure you want to delete {selectedRows.length}{" "}
            {selectedRows.length === 1 ? "group" : "groups"}? This action cannot
            be undone.
          </Typography>
        )}
      </Modal>
    </PageContainer>
  );
}
