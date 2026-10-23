import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { organizationService } from "@/features/organizations/api/organizations";
import { toast } from "react-hot-toast";

const LOCALE_OPTIONS = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "es-ES", label: "Spanish" },
  { value: "fr-FR", label: "French" },
  { value: "de-DE", label: "German" },
  { value: "pt-BR", label: "Portuguese (Brazil)" },
  { value: "ja-JP", label: "Japanese" },
  { value: "zh-CN", label: "Chinese (Simplified)" },
];

export function OrganizationModal({
  isOpen,
  onClose,
  onSuccess,
  organization = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    domains: [],
    is_active: true,
    settings: {
      allow_external_sharing: false,
      default_locale: "en-US",
    },
  });
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!organization;

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        domains: organization.domains || [],
        is_active: organization.is_active !== false,
        settings: {
          allow_external_sharing:
            organization.settings?.allow_external_sharing || false,
          default_locale: organization.settings?.default_locale || "en-US",
        },
      });
    } else {
      setFormData({
        name: "",
        domains: [],
        is_active: true,
        settings: {
          allow_external_sharing: false,
          default_locale: "en-US",
        },
      });
    }
    setDomainInput("");
    setErrors({});
  }, [organization, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Organization name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await organizationService.update(organization._id, formData);
        toast.success("Organization updated successfully");
      } else {
        await organizationService.create(formData);
        toast.success("Organization created successfully");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} organization`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("settings.")) {
      const settingKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingKey]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddDomain = () => {
    const domain = domainInput.trim().toLowerCase();
    if (domain && !formData.domains.includes(domain)) {
      setFormData((prev) => ({
        ...prev,
        domains: [...prev.domains, domain],
      }));
      setDomainInput("");
    }
  };

  const handleRemoveDomain = (domain) => {
    setFormData((prev) => ({
      ...prev,
      domains: prev.domains.filter((d) => d !== domain),
    }));
  };

  const handleDomainKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddDomain();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Organization" : "Create New Organization"}
      size="medium"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update Organization"
                : "Create Organization"}
          </Button>
        </>
      }
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        <Input
          label="Organization Name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter organization name"
          error={errors.name}
          required
        />

        <Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <Box sx={{ flex: 1 }}>
              <Input
                label="Domains"
                id="domains"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyDown={handleDomainKeyDown}
                placeholder="Enter domain (e.g., example.com)"
              />
            </Box>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleAddDomain}
              sx={{ mb: 0.25 }}
            >
              Add
            </Button>
          </Box>
          {formData.domains.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
              {formData.domains.map((domain) => (
                <Chip
                  key={domain}
                  label={domain}
                  size="small"
                  onDelete={() => handleRemoveDomain(domain)}
                  color="default"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </Box>

        <Select
          label="Default Locale"
          id="default_locale"
          name="settings.default_locale"
          value={formData.settings.default_locale}
          onChange={handleChange}
          options={LOCALE_OPTIONS}
        />

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                name="settings.allow_external_sharing"
                checked={formData.settings.allow_external_sharing}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Allow External Sharing"
          />
          <FormHelperText sx={{ ml: 4, mt: -0.5 }}>
            Enable sharing tickets and knowledge base with external users
          </FormHelperText>
        </Box>

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Active Organization"
          />
          <FormHelperText sx={{ ml: 4, mt: -0.5 }}>
            Inactive organizations cannot create new tickets
          </FormHelperText>
        </Box>
      </Box>
    </Modal>
  );
}
