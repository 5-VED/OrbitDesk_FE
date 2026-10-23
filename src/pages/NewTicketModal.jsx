import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { Modal } from "../components/ui/Modal";
import { Input, Textarea, Select } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { userService } from "../features/contacts/api/users";
import { groupService } from "../features/groups/api/groups";
import { getPriorityOptions, getTypeOptions } from "../utils/ticketConstants";
import { aiService } from "../services/ai.service";
import {
  Sparkles,
  Bug,
  HelpCircle,
  ListChecks,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const typeIconChip = {
  question: { icon: HelpCircle, variant: "info" },
  incident: { icon: AlertTriangle, variant: "warning" },
  problem: { icon: Bug, variant: "danger" },
  task: { icon: ListChecks, variant: "success" },
};

export function TicketModal({ isOpen, onClose, onSubmit, ticket = null }) {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "normal",
    type: "question",
    assignee_id: "",
    group_id: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agents, setAgents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
      if (ticket) {
        setFormData({
          subject: ticket.subject || "",
          description: ticket.description || "",
          priority: ticket.priority || "normal",
          type: ticket.type || "question",
          assignee_id: ticket.assignee_id?._id || ticket.assignee_id || "",
          group_id: ticket.group_id?._id || ticket.group_id || "",
          tags: ticket.tags ? ticket.tags.join(", ") : "",
        });
      } else {
        setFormData({
          subject: "",
          description: "",
          priority: "normal",
          type: "question",
          assignee_id: "",
          group_id: "",
          tags: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, ticket]);

  const fetchOptions = async () => {
    if (agents.length > 0 && groups.length > 0) return;

    setLoadingOptions(true);
    try {
      const agentsResponse = await userService.getAgents();
      if (agentsResponse.success && agentsResponse.data) {
        const agentOptions = agentsResponse.data.map((agent) => ({
          value: agent._id,
          label: `${agent.first_name} ${agent.last_name}`,
        }));
        setAgents(agentOptions);
      }

      const groupsResponse = await groupService.list();
      if (groupsResponse.success && groupsResponse.data) {
        const groupOptions = groupsResponse.data.map((group) => ({
          value: group._id,
          label: group.name,
        }));
        setGroups(groupOptions);
      }
    } catch (error) {
      console.error("Failed to fetch options:", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSuggestTags = async () => {
    if (!formData.description) return;

    setLoadingTags(true);
    try {
      const result = await aiService.suggestTags(formData.description);
      if (result && result.tags && result.tags.length > 0) {
        const newTags = result.tags.join(", ");
        setFormData((prev) => ({
          ...prev,
          tags: prev.tags ? `${prev.tags}, ${newTags}` : newTags,
        }));
        toast.success(`Added ${result.tags.length} suggested tags`);
      } else {
        toast("No tags suggested based on description", { icon: "ℹ️" });
      }
    } catch (error) {
      console.error("Failed to suggest tags:", error);
      toast.error("Failed to get AI suggestions");
    } finally {
      setLoadingTags(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const processedData = {
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        type: formData.type,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      };

      if (formData.assignee_id) {
        processedData.assignee_id = formData.assignee_id;
      }

      if (formData.group_id) {
        processedData.group_id = formData.group_id;
      }

      await onSubmit(processedData);
      onClose();
    } catch (error) {
      console.error("Error saving ticket:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to save ticket. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const chipConfig = ticket ? typeIconChip[ticket.type] : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow={ticket ? "Edit Work Item" : "New Work Item"}
      iconChip={chipConfig}
      title={
        ticket
          ? `#${ticket._id?.slice(-6).toUpperCase()} - ${ticket.subject}`
          : "Create New Ticket"
      }
      size="large"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting}>
            {ticket ? "Save Changes" : "Create Ticket"}
          </Button>
        </>
      }
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        {errors.submit && <Alert severity="error">{errors.submit}</Alert>}

        {/* Basic Information */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "text.primary", mb: 1.5 }}
          >
            Basic Information
          </Typography>

          <Input
            label="Subject"
            placeholder="Brief summary of the issue"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            error={errors.subject}
            required
          />

          <Textarea
            label="Description"
            placeholder="Provide detailed information about the issue..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            error={errors.description}
            rows={5}
            required
          />
        </Box>

        {/* Classification */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "text.primary", mb: 1.5 }}
          >
            Classification
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Select
                label="Priority"
                options={getPriorityOptions()}
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                placeholder="Select priority"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Select
                label="Type"
                options={getTypeOptions()}
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                placeholder="Select type"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Assignment */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "text.primary", mb: 1.5 }}
          >
            Assignment (Optional)
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Select
                label="Assign To"
                options={[{ value: "", label: "Select assignee" }, ...agents]}
                value={formData.assignee_id}
                onChange={(e) => handleChange("assignee_id", e.target.value)}
                placeholder="Select assignee"
                disabled={loadingOptions}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Select
                label="Group"
                options={[{ value: "", label: "Select group" }, ...groups]}
                value={formData.group_id}
                onChange={(e) => handleChange("group_id", e.target.value)}
                placeholder="Select group"
                disabled={loadingOptions}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Additional Information */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Additional Information (Optional)
            </Typography>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={Sparkles}
              onClick={handleSuggestTags}
              disabled={loadingTags || !formData.description}
              sx={{ color: "secondary.main", fontSize: "0.75rem" }}
            >
              {loadingTags ? "Suggesting..." : "Auto-Suggest Tags"}
            </Button>
          </Box>

          <Input
            label="Tags"
            placeholder="Enter tags separated by commas (e.g., billing, urgent, bug)"
            value={formData.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            hint="Separate multiple tags with commas"
          />
        </Box>
      </Box>
    </Modal>
  );
}

export default TicketModal;
