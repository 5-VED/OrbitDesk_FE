import { useState, useEffect, useRef } from "react";
import { Camera } from "lucide-react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { userService } from "@/features/contacts/api/users";
import { toast } from "react-hot-toast";

export function ContactModal({ isOpen, onClose, onSuccess, contact }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    gender: "male",
    country_code: "+91",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (contact) {
        setFormData({
          first_name: contact.first_name || "",
          last_name: contact.last_name || "",
          email: contact.email || "",
          phone: contact.phone || "",
          gender: contact.gender || "male",
          country_code: contact.country_code || "+91",
        });
        setPreviewUrl(contact.profile_pic || null);
      } else {
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          gender: "male",
          country_code: "+91",
        });
        setPreviewUrl(null);
      }
      setProfilePic(null);
      setErrors({});
    }
  }, [isOpen, contact]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();

      // Append form data
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("gender", formData.gender);
      data.append("country_code", formData.country_code);

      if (profilePic) {
        data.append("profile_pic", profilePic);
      }

      if (contact) {
        await userService.update(contact._id, data);
      } else {
        const password = "User@" + Math.floor(1000 + Math.random() * 9000);
        data.append("password", password);
        await userService.create(data);
      }

      toast.success(`Contact ${contact ? "updated" : "created"} successfully`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(
        `Failed to ${contact ? "update" : "create"} contact:`,
        error,
      );
      const msg =
        error.response?.data?.message ||
        error.message ||
        `Failed to ${contact ? "update" : "create"} contact`;
      toast.error(msg);
      setErrors({ submit: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("blob:")) return url;
    return url;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contact ? "Edit Contact" : "Add New Contact"}
      size="large"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : contact
                ? "Update Contact"
                : "Create Contact"}
          </Button>
        </>
      }
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        {errors.submit && <Alert severity="error">{errors.submit}</Alert>}

        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Box
            sx={{
              position: "relative",
              cursor: "pointer",
              display: "inline-block",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar
              src={getImageUrl(previewUrl)}
              name={`${formData.first_name} ${formData.last_name}`}
              size="xl"
              sx={{ width: 80, height: 80, fontSize: "2rem" }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "primary.main",
                borderRadius: "50%",
                width: 28,
                height: 28,
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 2,
                border: "2px solid",
                borderColor: "background.paper",
              }}
            >
              <Camera size={14} />
            </Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </Box>
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              display: "block",
              mb: 1.5,
              pb: 0.5,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            Personal Information
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                label="First Name"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                error={errors.first_name}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                error={errors.last_name}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errors.email}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 1 }}
              >
                <Input
                  label="Country Code"
                  value={formData.country_code}
                  onChange={(e) => handleChange("country_code", e.target.value)}
                  placeholder="+91"
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    handleChange("phone", value);
                  }}
                  error={errors.phone}
                  required
                  placeholder="1234567890"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}
