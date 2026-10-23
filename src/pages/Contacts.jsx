import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Mail,
  Phone,
  User as UserIcon,
  Edit,
  Upload,
  Download,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Modal } from "../components/ui/Modal";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { DataTable } from "../components/ui/DataTable";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchContacts,
  deleteContact,
  bulkDeleteContacts,
  importContacts,
  setContactSearchQuery,
  setContactPage,
  setContactPageSize,
  setContactSelectedRows,
  setDetailContact,
  clearDetailContact,
  selectContacts,
  selectContactsLoading,
  selectContactsFilters,
  selectContactsPagination,
  selectContactsSelectedRows,
  selectContactDetail,
} from "../store/slices/contactsSlice";
import { ContactModal } from "./ContactModal";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

export function Contacts() {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector(selectContacts);
  const loading = useAppSelector(selectContactsLoading);
  const filters = useAppSelector(selectContactsFilters);
  const pagination = useAppSelector(selectContactsPagination);
  const selectedRows = useAppSelector(selectContactsSelectedRows);
  const detailContact = useAppSelector(selectContactDetail);

  // Local ephemeral UI state
  const [editingContact, setEditingContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [singleDeleteContact, setSingleDeleteContact] = useState(null);

  const fileInputRef = useRef(null);

  // Fetch contacts when pagination changes
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch, pagination.page, pagination.limit]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        dispatch(fetchContacts());
      } else {
        dispatch(setContactPage(1));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const handleImportUser = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Importing users...");
    try {
      const result = await dispatch(importContacts(formData)).unwrap();
      toast.success(
        result.message || `Imported ${result.data?.successCount} users`,
        { id: toastId },
      );
      dispatch(fetchContacts());
    } catch (error) {
      toast.error(error || "Import failed", { id: toastId });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "First Name": "John",
        "Last Name": "Doe",
        Email: "john.doe@example.com",
        "Country Code": "+91",
        Phone: "9876543210",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    ws["!cols"] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "user_import_template.xlsx");
    toast.success("Template downloaded");
  };

  const handleCreateSuccess = () => {
    dispatch(fetchContacts());
    setIsModalOpen(false);
  };

  const handlePageSizeChange = (e) => {
    dispatch(setContactPageSize(parseInt(e.target.value, 10)));
  };

  // Multi-select handlers
  const handleSelectRow = (id, checked) => {
    const newSelection = checked
      ? [...selectedRows, id]
      : selectedRows.filter((i) => i !== id);
    dispatch(setContactSelectedRows(newSelection));
  };

  const handleSelectAll = (checked) => {
    dispatch(setContactSelectedRows(checked ? contacts.map((c) => c._id) : []));
  };

  // Delete handlers
  const handleBulkDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleSingleDelete = (contact) => {
    setSingleDeleteContact(contact);
    setIsDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    setDeleteLoading(true);
    try {
      if (singleDeleteContact) {
        await dispatch(deleteContact(singleDeleteContact._id)).unwrap();
        toast.success("Contact deleted successfully");
        if (detailContact?._id === singleDeleteContact._id) {
          dispatch(clearDetailContact());
        }
      } else {
        await dispatch(bulkDeleteContacts(selectedRows)).unwrap();
        toast.success(`${selectedRows.length} contacts deleted`);
        if (detailContact && selectedRows.includes(detailContact._id)) {
          dispatch(clearDetailContact());
        }
      }
      dispatch(fetchContacts());
      setIsDeleteModalOpen(false);
      setSingleDeleteContact(null);
    } catch (error) {
      toast.error(error || "Failed to delete contacts");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (_, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar name={`${row.first_name} ${row.last_name}`} size="sm" />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {row.first_name} {row.last_name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (value) => value || "N/A",
    },
    {
      key: "role",
      header: "Role",
      render: (value) => (
        <Badge variant="default">{value?.role || "User"}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <Badge variant={value === "online" ? "success" : "default"}>
          {value || "Offline"}
        </Badge>
      ),
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
              setEditingContact(row);
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
      title="Contacts"
      actions={
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".xlsx, .xls, .csv"
            onChange={handleImportUser}
          />
          <Button
            variant="outline"
            icon={Download}
            onClick={handleDownloadTemplate}
          >
            Download Template
          </Button>
          <Button
            variant="outline"
            icon={Upload}
            onClick={() => fileInputRef.current?.click()}
          >
            Import Users
          </Button>
          <Button
            icon={Plus}
            onClick={() => {
              setEditingContact(null);
              setIsModalOpen(true);
            }}
          >
            Add Contact
          </Button>
        </Stack>
      }
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: detailContact ? "1fr 360px" : "1fr",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Contacts List Section */}
        <Box
          sx={{
            display: {
              xs: detailContact ? "none" : "flex",
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
              placeholder="Search contacts..."
              value={filters.search}
              onChange={(e) => dispatch(setContactSearchQuery(e.target.value))}
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
            data={contacts}
            selectable
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            emptyMessage={
              loading
                ? { title: "Loading contacts...", subtitle: "" }
                : {
                    title: "No Contacts Yet",
                    subtitle:
                      "Add your first contact or import a list to get started.",
                  }
            }
            onRowClick={(row) => dispatch(setDetailContact(row))}
            rowKey="_id"
          />

          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography variant="body2" color="text.secondary">
                Showing{" "}
                {pagination.total === 0
                  ? 0
                  : (pagination.page - 1) * pagination.limit + 1}{" "}
                to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} entries
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Show
                </Typography>
                <FormControl size="small">
                  <Select
                    value={pagination.limit}
                    onChange={handlePageSizeChange}
                    sx={{ height: 32, fontSize: "0.8125rem" }}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary">
                  entries
                </Typography>
              </Stack>
            </Stack>

            <Pagination
              count={pagination.totalPages || 1}
              page={pagination.page}
              onChange={(_, page) => dispatch(setContactPage(page))}
              color="primary"
              shape="rounded"
              size="small"
            />
          </Box>
        </Box>

        {/* Contact Detail Sidebar */}
        {detailContact && (
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
                    onClick={() => dispatch(clearDetailContact())}
                  >
                    <ArrowLeft size={18} />
                  </IconButton>
                  <Box
                    sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                  >
                    <Avatar
                      name={`${detailContact.first_name} ${detailContact.last_name}`}
                      size="xl"
                    />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingContact(detailContact);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit size={16} />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {detailContact.first_name} {detailContact.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {detailContact.role?.role || "User"}
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
                  Contact Information
                </Typography>
                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Mail size={16} style={{ opacity: 0.6 }} />
                    <Typography
                      component="a"
                      href={`mailto:${detailContact.email}`}
                      variant="body2"
                      color="primary.main"
                      sx={{
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {detailContact.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Phone size={16} style={{ opacity: 0.6 }} />
                    <Typography variant="body2">
                      {detailContact.phone || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <UserIcon size={16} style={{ opacity: 0.6 }} />
                    <Typography variant="body2">
                      {detailContact.gender || "N/A"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Card>
          </Box>
        )}
      </Box>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
        contact={editingContact}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSingleDeleteContact(null);
        }}
        title="Delete Contact"
        size="small"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSingleDeleteContact(null);
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
        {singleDeleteContact ? (
          <Typography variant="body2">
            Are you sure you want to delete {singleDeleteContact.first_name}{" "}
            {singleDeleteContact.last_name}? This action cannot be undone.
          </Typography>
        ) : (
          <Typography variant="body2">
            Are you sure you want to delete {selectedRows.length}{" "}
            {selectedRows.length === 1 ? "contact" : "contacts"}? This action
            cannot be undone.
          </Typography>
        )}
      </Modal>
    </PageContainer>
  );
}
