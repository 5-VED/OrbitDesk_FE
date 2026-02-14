import { useState, useEffect } from 'react';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { userService } from '../features/contacts/api/users';
import { groupService } from '../features/groups/api/groups';
import { getPriorityOptions, getTypeOptions } from '../utils/ticketConstants';
import { aiService } from '../services/ai.service';
import { Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './NewTicketModal.css';

export function TicketModal({ isOpen, onClose, onSubmit, ticket = null }) {
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'normal',
        type: 'question',
        assignee_id: '',
        group_id: '',
        tags: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agents, setAgents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [loadingTags, setLoadingTags] = useState(false);

    // Reset or populate form when modal opens or ticket changes
    useEffect(() => {
        if (isOpen) {
            fetchOptions();
            if (ticket) {
                setFormData({
                    subject: ticket.subject || '',
                    description: ticket.description || '',
                    priority: ticket.priority || 'normal',
                    type: ticket.type || 'question',
                    assignee_id: ticket.assignee_id?._id || ticket.assignee_id || '',
                    group_id: ticket.group_id?._id || ticket.group_id || '',
                    tags: ticket.tags ? ticket.tags.join(', ') : '',
                });
            } else {
                setFormData({
                    subject: '',
                    description: '',
                    priority: 'normal',
                    type: 'question',
                    assignee_id: '',
                    group_id: '',
                    tags: '',
                });
            }
            setErrors({});
        }
    }, [isOpen, ticket]);

    const fetchOptions = async () => {
        if (agents.length > 0 && groups.length > 0) return; // Don't refetch if already loaded

        setLoadingOptions(true);
        try {
            // Fetch agents
            const agentsResponse = await userService.getAgents();
            if (agentsResponse.success && agentsResponse.data) {
                const agentOptions = agentsResponse.data.map(agent => ({
                    value: agent._id,
                    label: `${agent.first_name} ${agent.last_name}`,
                }));
                setAgents(agentOptions);
            }

            // Fetch groups
            const groupsResponse = await groupService.list();
            if (groupsResponse.success && groupsResponse.data) {
                const groupOptions = groupsResponse.data.map(group => ({
                    value: group._id,
                    label: group.name,
                }));
                setGroups(groupOptions);
            }
        } catch (error) {
            console.error('Failed to fetch options:', error);
        } finally {
            setLoadingOptions(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSuggestTags = async () => {
        if (!formData.description) return;

        setLoadingTags(true);
        try {
            const result = await aiService.suggestTags(formData.description);
            if (result && result.tags && result.tags.length > 0) {
                const newTags = result.tags.join(', ');
                setFormData(prev => ({
                    ...prev,
                    tags: prev.tags ? `${prev.tags}, ${newTags}` : newTags
                }));
                toast.success(`Added ${result.tags.length} suggested tags`);
            } else {
                toast("No tags suggested based on description", { icon: 'ℹ️' });
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
            newErrors.subject = 'Subject is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
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
            // Process tags - split by comma and trim
            const processedData = {
                subject: formData.subject,
                description: formData.description,
                priority: formData.priority,
                type: formData.type,
                tags: formData.tags
                    ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
                    : [],
            };

            // Only include optional fields if they have values
            if (formData.assignee_id) {
                processedData.assignee_id = formData.assignee_id;
            }
            // For update, we might want to allow clearing assignee if needed, but existing logic was "only include if value"
            // If editing, user might want to UNASSIGN. API might need null or empty string. 
            // The current create logic only sends it if truthy. Let's keep it consistent for now.

            if (formData.group_id) {
                processedData.group_id = formData.group_id;
            }

            await onSubmit(processedData);

            onClose();
        } catch (error) {
            console.error('Error saving ticket:', error);
            setErrors({ submit: error.response?.data?.message || 'Failed to save ticket. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={ticket ? "Edit Ticket" : "Create New Ticket"}
            size="large"
            footer={
                <>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (ticket ? 'Save Changes' : 'Create Ticket')}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="new-ticket-form">
                {errors.submit && (
                    <div className="form-error-banner">
                        {errors.submit}
                    </div>
                )}

                <div className="form-section">
                    <h3 className="form-section-title">Basic Information</h3>

                    <Input
                        label="Subject"
                        placeholder="Brief summary of the issue"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        error={errors.subject}
                        required
                    />

                    <Textarea
                        label="Description"
                        placeholder="Provide detailed information about the issue..."
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        error={errors.description}
                        rows={6}
                        required
                    />
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Classification</h3>

                    <div className="form-row">
                        <Select
                            label="Priority"
                            options={getPriorityOptions()}
                            value={formData.priority}
                            onChange={(e) => handleChange('priority', e.target.value)}
                            placeholder="Select priority"
                        />

                        <Select
                            label="Type"
                            options={getTypeOptions()}
                            value={formData.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                            placeholder="Select type"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Assignment (Optional)</h3>

                    <div className="form-row">
                        <Select
                            label="Assign To"
                            options={[{ value: '', label: 'Select assignee' }, ...agents]}
                            value={formData.assignee_id}
                            onChange={(e) => handleChange('assignee_id', e.target.value)}
                            placeholder="Select assignee"
                            disabled={loadingOptions}
                        />

                        <Select
                            label="Group"
                            options={[{ value: '', label: 'Select group' }, ...groups]}
                            value={formData.group_id}
                            onChange={(e) => handleChange('group_id', e.target.value)}
                            placeholder="Select group"
                            disabled={loadingOptions}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="form-section-title mb-0">Additional Information (Optional)</h3>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={Sparkles}
                            onClick={handleSuggestTags}
                            disabled={loadingTags || !formData.description}
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-8 px-2 text-xs"
                        >
                            {loadingTags ? 'Suggesting...' : 'Auto-Suggest Tags'}
                        </Button>
                    </div>

                    <Input
                        label="Tags"
                        placeholder="Enter tags separated by commas (e.g., billing, urgent, bug)"
                        value={formData.tags}
                        onChange={(e) => handleChange('tags', e.target.value)}
                        hint="Separate multiple tags with commas"
                    />
                </div>
            </form>
        </Modal>
    );
}
