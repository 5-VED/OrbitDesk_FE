import { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar as MuiAvatar,
  IconButton,
  Button as MuiButton,
  TextField,
  Chip,
  CircularProgress,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Camera,
  Save,
  X,
  Phone,
} from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  updateUserProfile,
  selectCurrentUser,
} from "../store/slices/authSlice";
import { ratingService } from "../services/rating.service";
import { ticketService } from "../features/tickets/api/tickets";
import toast from "react-hot-toast";

export function Profile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    assigned: "—",
    resolved: "—",
    rating: "—",
    slaCompliance: "—",
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setPreviewUrl(user.profile_pic || null);
    }
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const [ratingRes, ticketsRes] = await Promise.allSettled([
          ratingService.getAgentRating(user._id),
          ticketService.list({ assignee_id: user._id, limit: 1 }),
        ]);

        let avgRating = "—";
        if (ratingRes.status === "fulfilled" && ratingRes.value?.data) {
          avgRating = ratingRes.value.data.avgRating?.toFixed(1) || "—";
        }

        let assigned = "—",
          resolved = "—";
        if (ticketsRes.status === "fulfilled" && ticketsRes.value?.data) {
          const tickets = ticketsRes.value.data;
          if (Array.isArray(tickets)) {
            assigned = tickets.length || 0;
            resolved =
              tickets.filter(
                (t) => t.status === "solved" || t.status === "closed",
              ).length || 0;
          }
        }

        setStats({
          assigned: assigned !== "—" ? assigned : user.ticketCount || "—",
          resolved,
          rating: avgRating !== "—" ? avgRating : user.avgRating || "—",
          slaCompliance: user.slaCompliance || "—",
        });
      } catch {
        // fall back to defaults
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [user?._id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setPreviewUrl(user.profile_pic || null);
      setProfilePic(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("blob:")) return url;
    return url;
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);

      if (profilePic) {
        data.append("profile_pic", profilePic);
      }

      await dispatch(
        updateUserProfile({ userId: user._id || user.id, data }),
      ).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <PageContainer title="Profile">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress size={36} color="primary" />
        </Box>
      </PageContainer>
    );
  }

  const initials =
    `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() ||
    "U";

  return (
    <PageContainer title="My Profile">
      <Stack spacing={3}>
        {/* Header card with cover and avatar */}
        <Card sx={{ overflow: "hidden", position: "relative" }}>
          <Box
            sx={{
              height: 160,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(244,67,54,0.3) 0%, rgba(20,24,33,0.9) 100%)"
                  : "linear-gradient(135deg, #fee2e2 0%, #ffedd5 100%)",
              width: "100%",
            }}
          />
          <Box
            sx={{
              px: { xs: 2, sm: 3, md: 4 },
              pb: 3,
              display: "flex",
              alignItems: { xs: "center", sm: "flex-end" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              mt: "-60px",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <MuiAvatar
                src={getImageUrl(previewUrl)}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  bgcolor: "primary.main",
                  color: "#ffffff",
                  border: (theme) =>
                    `4px solid ${theme.palette.background.paper}`,
                  boxShadow: 3,
                }}
              >
                {initials}
              </MuiAvatar>
              {isEditing && (
                <>
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    size="small"
                    aria-label="Upload photo"
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: 2,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Camera size={16} />
                  </IconButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </>
              )}
            </Box>

            <Box sx={{ flex: 1, mt: { xs: 1, sm: 8 } }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                {user.first_name} {user.last_name}
              </Typography>
              <Chip
                label={user.role || "User"}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ textTransform: "capitalize", fontWeight: 600 }}
              />
            </Box>

            <Box sx={{ mt: { xs: 2, sm: 8 } }}>
              {isEditing ? (
                <Stack direction="row" spacing={1}>
                  <MuiButton
                    variant="outlined"
                    color="inherit"
                    onClick={handleEditToggle}
                    disabled={loading}
                    startIcon={<X size={16} />}
                  >
                    Cancel
                  </MuiButton>
                  <MuiButton
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <Save size={16} />
                      )
                    }
                  >
                    Save
                  </MuiButton>
                </Stack>
              ) : (
                <MuiButton
                  variant="outlined"
                  color="primary"
                  onClick={handleEditToggle}
                >
                  Edit Profile
                </MuiButton>
              )}
            </Box>
          </Box>
        </Card>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                  {/* Full Name */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderRadius: 2,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.02)"
                          : "grey.50",
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "primary.light",
                        color: "primary.main",
                      }}
                    >
                      <User size={20} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Full Name
                      </Typography>
                      {isEditing ? (
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          sx={{ mt: 0.5 }}
                        >
                          <TextField
                            size="small"
                            fullWidth
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="First Name"
                          />
                          <TextField
                            size="small"
                            fullWidth
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                          />
                        </Stack>
                      ) : (
                        <Typography variant="body1" fontWeight={500}>
                          {user.first_name} {user.last_name}
                        </Typography>
                      )}
                    </Box>
                  </Paper>

                  {/* Email */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderRadius: 2,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.02)"
                          : "grey.50",
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "primary.light",
                        color: "primary.main",
                      }}
                    >
                      <Mail size={20} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Email Address
                      </Typography>
                      {isEditing ? (
                        <TextField
                          size="small"
                          fullWidth
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email Address"
                          sx={{ mt: 0.5 }}
                        />
                      ) : (
                        <Typography variant="body1" fontWeight={500}>
                          {user.email}
                        </Typography>
                      )}
                    </Box>
                  </Paper>

                  {/* Phone */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderRadius: 2,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.02)"
                          : "grey.50",
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "primary.light",
                        color: "primary.main",
                      }}
                    >
                      <Phone size={20} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Phone Number
                      </Typography>
                      {isEditing ? (
                        <TextField
                          size="small"
                          fullWidth
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Phone Number"
                          sx={{ mt: 0.5 }}
                        />
                      ) : (
                        <Typography variant="body1" fontWeight={500}>
                          {user.phone || "Not set"}
                        </Typography>
                      )}
                    </Box>
                  </Paper>

                  {/* Role */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderRadius: 2,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.02)"
                          : "grey.50",
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "primary.light",
                        color: "primary.main",
                      }}
                    >
                      <Shield size={20} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Role
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {user.role}
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Organization ID */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderRadius: 2,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.02)"
                          : "grey.50",
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "primary.light",
                        color: "primary.main",
                      }}
                    >
                      <Calendar size={20} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Organization ID
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {user.organization_id || "—"}
                      </Typography>
                    </Box>
                  </Paper>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Activity Overview */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Activity Overview
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {statsLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 4 }}
                  >
                    <CircularProgress size={28} />
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {[
                      { label: "Tickets Assigned", value: stats.assigned },
                      { label: "Tickets Resolved", value: stats.resolved },
                      { label: "Avg Rating", value: stats.rating },
                      { label: "SLA Compliance", value: stats.slaCompliance },
                    ].map((statItem, idx) => (
                      <Grid key={idx} size={{ xs: 6 }}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2.5,
                            textAlign: "center",
                            borderRadius: 2,
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.02)"
                                : "grey.50",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: 2,
                            },
                          }}
                        >
                          <Typography
                            variant="h4"
                            color="primary.main"
                            fontWeight={700}
                          >
                            {statItem.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, display: "block" }}
                          >
                            {statItem.label}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </PageContainer>
  );
}
